import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

// GET /api/applications/job/[jobId] — get applications for a job (ADMIN/SUPER_ADMIN/STAFF)
export async function GET(req: NextRequest, { params }: { params: Promise<{ jobId: string }> }) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN", "STAFF"]);
    const { jobId } = await params;

    const applications = await prisma.application.findMany({
      where: { jobId: parseInt(jobId) },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true },
        },
        job: {
          select: { id: true, title: true, company: true },
        },
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
