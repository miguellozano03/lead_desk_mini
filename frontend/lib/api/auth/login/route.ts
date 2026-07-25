import { NextRequest, NextResponse } from "next/server";
import { backendFetch, BackendError } from "@/lib/api/backend";
import { AUTH_COOKIE_NAME } from "@/lib/api/config";

export async function POST(req: NextRequest) {
  const body = await req.json();

  try {
    const { access_token } = await backendFetch<{ access_token: string }>("/auth/login", {
      method: "POST",
      body,
    });

    const res = NextResponse.json({ ok: true });
    res.cookies.set(AUTH_COOKIE_NAME, access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 8,
    });
    return res;
  } catch (err) {
    const status = err instanceof BackendError ? err.status : 500;
    return NextResponse.json({ error: "Invalid credentials" }, { status });
  }
}
