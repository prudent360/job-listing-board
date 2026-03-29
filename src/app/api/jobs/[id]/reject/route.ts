import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

// PATCH /api/jobs/[id]/reject — reject a pending job (ADMIN/SUPER_ADMIN only)
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;
    const jobId = parseInt(id);

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.status === "REJECTED") {
      return NextResponse.json({ error: "Job is already rejected" }, { status: 400 });
    }

    const updated = await prisma.job.update({
      where: { id: jobId },
      data: { status: "REJECTED" },
    });

    return NextResponse.json({ message: "Job rejected", job: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
