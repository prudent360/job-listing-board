import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate, authorize, type Role } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

// POST /api/jobs — create a job (SUPER_ADMIN, ADMIN, STAFF only)
export async function POST(req: NextRequest) {
  try {
    const user = authorize(req, ["SUPER_ADMIN", "ADMIN", "STAFF"]);
    const body = await req.json();
    const { title, company, location, type, salary, category, description, tags, externalApplyUrl } = body;

    if (!title || !company || !location || !salary || !category || !description) {
      return NextResponse.json(
        { error: "Required fields: title, company, location, salary, category, description" },
        { status: 400 }
      );
    }

    // SUPER_ADMIN and ADMIN jobs are auto-approved, STAFF jobs are PENDING
    const status = (["SUPER_ADMIN", "ADMIN"] as Role[]).includes(user.role)
      ? "APPROVED"
      : "PENDING";

    // Generate a unique slug
    let slug = generateSlug(company, title);
    const existingCount = await prisma.job.count({ where: { slug: { startsWith: slug } } });
    if (existingCount > 0) slug = `${slug}-${existingCount + 1}`;

    const job = await prisma.job.create({
      data: {
        title,
        slug,
        company,
        location,
        type: type || "Full-time",
        salary,
        category,
        description,
        tags: Array.isArray(tags) ? tags.join(",") : tags || "",
        status,
        externalApplyUrl: externalApplyUrl || null,
        postedById: user.userId,
        approvedById: status === "APPROVED" ? user.userId : null,
      },
    });

    return NextResponse.json(
      { message: `Job created (${status.toLowerCase()})`, job },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

// GET /api/jobs — list jobs
// Public: only APPROVED jobs
// Authenticated admin/staff: all jobs with ?all=true
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const showAll = url.searchParams.get("all") === "true";
    const search = url.searchParams.get("search") || "";
    const category = url.searchParams.get("category") || "";
    const location = url.searchParams.get("location") || "";

    let whereStatus: object = { status: "APPROVED" };

    if (showAll) {
      try {
        authorize(req, ["SUPER_ADMIN", "ADMIN", "STAFF"]);
        whereStatus = {};
      } catch {
        // not authorized, show only approved
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = { ...whereStatus };
    if (search) {
      where.OR = [
        { title: { contains: search } },
        { company: { contains: search } },
        { description: { contains: search } },
      ];
    }
    if (category) where.category = category;
    if (location) {
      if (location === "Remote") where.location = "Remote";
      else where.location = { contains: location };
    }

    const jobs = await prisma.job.findMany({
      where,
      include: {
        postedBy: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
