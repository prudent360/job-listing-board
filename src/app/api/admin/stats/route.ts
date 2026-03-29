import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN", "STAFF"]);

    const url = new URL(req.url);
    const period = parseInt(url.searchParams.get("period") || "30");
    const since = new Date();
    since.setDate(since.getDate() - period);

    const [
      totalUsers,
      totalJobs,
      totalApplications,
      pendingJobs,
      approvedJobs,
      rejectedJobs,
      newUsersInPeriod,
      newJobsInPeriod,
      newApplicationsInPeriod,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.job.count(),
      prisma.application.count(),
      prisma.job.count({ where: { status: "PENDING" } }),
      prisma.job.count({ where: { status: "APPROVED" } }),
      prisma.job.count({ where: { status: "REJECTED" } }),
      prisma.user.count({ where: { createdAt: { gte: since } } }),
      prisma.job.count({ where: { createdAt: { gte: since } } }),
      prisma.application.count({ where: { createdAt: { gte: since } } }),
    ]);

    const recentJobs = await prisma.job.findMany({
      include: {
        postedBy: { select: { firstName: true, lastName: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recentApplications = await prisma.application.findMany({
      include: {
        user: { select: { firstName: true, lastName: true, email: true } },
        job: { select: { title: true, company: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const recentUsers = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    return NextResponse.json({
      stats: {
        totalUsers,
        totalJobs,
        totalApplications,
        pendingJobs,
        approvedJobs,
        rejectedJobs,
        newUsersInPeriod,
        newJobsInPeriod,
        newApplicationsInPeriod,
      },
      recentJobs,
      recentApplications,
      recentUsers,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
