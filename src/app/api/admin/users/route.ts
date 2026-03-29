import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize, hashPassword, type Role } from "@/lib/auth";

// GET /api/admin/users — list all users (SUPER_ADMIN, ADMIN only)
export async function GET(req: NextRequest) {
  try {
    authorize(req, ["SUPER_ADMIN", "ADMIN"]);

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ users });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}

// POST /api/admin/users — create STAFF or ADMIN (SUPER_ADMIN only)
export async function POST(req: NextRequest) {
  try {
    authorize(req, ["SUPER_ADMIN"]);

    const body = await req.json();
    const { email, password, firstName, lastName, role } = body;

    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: "All fields are required: email, password, firstName, lastName, role" },
        { status: 400 }
      );
    }

    const allowedRoles: Role[] = ["ADMIN", "STAFF"];
    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        { error: "Can only create ADMIN or STAFF users" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        role,
      },
    });

    return NextResponse.json(
      {
        message: "User created successfully",
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
