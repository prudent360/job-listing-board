import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";
import { generateSlug } from "@/lib/utils";

/**
 * Helper to find a job by either numeric ID or slug string.
 */
async function findJobByIdOrSlug(identifier: string) {
  const numericId = parseInt(identifier);
  if (!isNaN(numericId)) {
    return prisma.job.findUnique({ where: { id: numericId } });
  }
  return prisma.job.findUnique({ where: { slug: identifier } });
}

// GET /api/jobs/[id] — get a single job by ID or slug (public: approved only, admin: any status)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    // Check if this is an admin request (has valid auth header)
    let isAdmin = false;
    try {
      authorize(req, ["SUPER_ADMIN", "ADMIN", "STAFF"]);
      isAdmin = true;
    } catch {
      // Not an admin, that's fine — public access
    }

    const job = await prisma.job.findUnique({
      where: !isNaN(parseInt(id)) ? { id: parseInt(id) } : { slug: id },
      include: {
        postedBy: {
          select: { id: true, firstName: true, lastName: true },
        },
        _count: {
          select: { applications: true },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Public users can only see approved jobs
    if (!isAdmin && job.status !== "APPROVED") {
      return NextResponse.json({ error: "Job not available" }, { status: 404 });
    }

    return NextResponse.json({ job });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PUT /api/jobs/[id] — update a job (ADMIN/SUPER_ADMIN only)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;
    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const body = await req.json();
    const { title, company, location, type, salary, category, description, tags, externalApplyUrl } = body;

    // Regenerate slug if title or company changed
    let slugUpdate = {};
    const newTitle = title || existing.title;
    const newCompany = company || existing.company;
    if (title || company) {
      let newSlug = generateSlug(newCompany, newTitle);
      const conflict = await prisma.job.findUnique({ where: { slug: newSlug } });
      if (conflict && conflict.id !== jobId) {
        newSlug = `${newSlug}-${jobId}`;
      }
      slugUpdate = { slug: newSlug };
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: {
        ...(title && { title }),
        ...(company && { company }),
        ...(location && { location }),
        ...(type && { type }),
        ...(salary && { salary }),
        ...(category && { category }),
        ...(description !== undefined && { description }),
        ...(tags !== undefined && { tags: Array.isArray(tags) ? tags.join(", ") : tags }),
        ...(externalApplyUrl !== undefined && { externalApplyUrl: externalApplyUrl || null }),
        ...slugUpdate,
      },
    });

    return NextResponse.json({ job: updated });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/jobs/[id] — delete a job (ADMIN/SUPER_ADMIN only)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;
    const jobId = parseInt(id);

    if (isNaN(jobId)) {
      return NextResponse.json({ error: "Invalid job ID" }, { status: 400 });
    }

    const existing = await prisma.job.findUnique({ where: { id: jobId } });
    if (!existing) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Delete related applications first, then the job
    await prisma.application.deleteMany({ where: { jobId } });
    await prisma.job.delete({ where: { id: jobId } });

    return NextResponse.json({ message: "Job deleted" });
  } catch (err) {
    if (err instanceof Error && err.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
