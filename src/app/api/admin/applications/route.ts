import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

// GET /api/admin/applications — list all applications (ADMIN/SUPER_ADMIN/STAFF)
export async function GET(req: NextRequest) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN", "STAFF"]);

    const applications = await prisma.application.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        job: { select: { title: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
