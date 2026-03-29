import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// POST /api/applications — apply to a job (JOB_SEEKER only)
export async function POST(req: NextRequest) {
  try {
    const user = authenticate(req);

    if (user.role !== "JOB_SEEKER") {
      return NextResponse.json({ error: "Only job seekers can apply" }, { status: 403 });
    }

    const body = await req.json();
    const { jobId, coverNote } = body;

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await prisma.job.findUnique({ where: { id: jobId } });
    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }
    if (job.status !== "APPROVED") {
      return NextResponse.json({ error: "Can only apply to approved jobs" }, { status: 400 });
    }

    const existing = await prisma.application.findUnique({
      where: { jobId_userId: { jobId, userId: user.userId } },
    });
    if (existing) {
      return NextResponse.json({ error: "You have already applied to this job" }, { status: 409 });
    }

    const application = await prisma.application.create({
      data: {
        jobId,
        userId: user.userId,
        coverNote: coverNote || "",
      },
    });

    return NextResponse.json(
      { message: "Application submitted", application },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    return NextResponse.json({ error: message }, { status: 401 });
  }
}
