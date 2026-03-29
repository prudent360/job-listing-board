import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { authorize } from "@/lib/auth";

// PATCH /api/admin/users/[id] — toggle active status, update role
export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const currentUser = authorize(req, ["SUPER_ADMIN", "ADMIN"]);
    const { id } = await params;
    const userId = parseInt(id);
    const body = await req.json();

    const target = await prisma.user.findUnique({ where: { id: userId } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent modifying SUPER_ADMIN unless you are SUPER_ADMIN
    if (target.role === "SUPER_ADMIN" && currentUser.role !== "SUPER_ADMIN") {
      return NextResponse.json({ error: "Cannot modify a Super Admin" }, { status: 403 });
    }

    // Prevent self-deactivation
    if (currentUser.userId === userId && body.isActive === false) {
      return NextResponse.json({ error: "Cannot deactivate your own account" }, { status: 400 });
    }

    const updateData: { isActive?: boolean; role?: string } = {};
    if (typeof body.isActive === "boolean") updateData.isActive = body.isActive;
    if (body.role && currentUser.role === "SUPER_ADMIN") updateData.role = body.role;

    const updated = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        role: true,
        isActive: true,
      },
    });

    return NextResponse.json({ user: updated });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unauthorized";
    const status = message === "Insufficient permissions" ? 403 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}
