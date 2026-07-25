import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, BackendError } from "@/lib/api/backend";
import { AUTH_COOKIE_NAME } from "@/lib/api/config";
import { fromBackendLead } from "@/lib/api/mappers";

export async function GET(req: NextRequest) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const search = req.nextUrl.searchParams.get("search") ?? undefined;

  try {
    const data = await backendFetch<{ items: unknown[] }>("/admin/leads", {
      token,
      searchParams: { search, page_size: "100" },
    });
    return NextResponse.json({ items: (data.items as any[]).map(fromBackendLead) });
  } catch (err) {
    const status = err instanceof BackendError ? err.status : 500;
    return NextResponse.json({ error: "Could not fetch leads" }, { status });
  }
}
