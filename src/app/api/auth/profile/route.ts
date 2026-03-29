import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authenticate } from "@/lib/auth";

// GET /api/auth/profile — get current user's profile
export async function GET(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        linkedIn: true,
        github: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}

// PUT /api/auth/profile — update current user's profile
export async function PUT(req: NextRequest) {
  try {
    const payload = authenticate(req);
    const body = await req.json();
    const { firstName, lastName, phone, location, linkedIn, github } = body;

    const updated = await prisma.user.update({
      where: { id: payload.userId },
      data: {
        ...(firstName !== undefined && { firstName }),
        ...(lastName !== undefined && { lastName }),
        ...(phone !== undefined && { phone: phone || null }),
        ...(location !== undefined && { location: location || null }),
        ...(linkedIn !== undefined && { linkedIn: linkedIn || null }),
        ...(github !== undefined && { github: github || null }),
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phone: true,
        location: true,
        linkedIn: true,
        github: true,
        role: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
}
