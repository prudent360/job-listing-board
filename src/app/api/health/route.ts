import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Test database connection
    const userCount = await prisma.user.count();
    return NextResponse.json({
      status: "ok",
      database: "connected",
      users: userCount,
      env: {
        hasLibsqlUrl: !!process.env.LIBSQL_URL,
        hasAuthToken: !!process.env.LIBSQL_AUTH_TOKEN,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
      },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    const stack = err instanceof Error ? err.stack?.split("\n").slice(0, 5) : [];
    return NextResponse.json({
      status: "error",
      error: message,
      stack,
      env: {
        hasLibsqlUrl: !!process.env.LIBSQL_URL,
        hasAuthToken: !!process.env.LIBSQL_AUTH_TOKEN,
        hasJwtSecret: !!process.env.JWT_SECRET,
        nodeEnv: process.env.NODE_ENV,
      },
    }, { status: 500 });
  }
}
