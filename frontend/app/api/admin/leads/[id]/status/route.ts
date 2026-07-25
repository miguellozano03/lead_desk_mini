import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { backendFetch, BackendError } from "@/lib/api/backend";
import { AUTH_COOKIE_NAME } from "@/lib/api/config";
import { fromBackendLead, toBackendStatus } from "@/lib/api/mappers";
import { Lead } from "@/lib/validations/lead.schema";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const token = (await cookies()).get(AUTH_COOKIE_NAME)?.value;
  if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const { status } = (await req.json()) as { status: Lead["status"] };

  try {
    const updated = await backendFetch(`/admin/leads/${id}/status`, {
      method: "PATCH",
      token,
      body: { status: toBackendStatus(status) },
    });
    return NextResponse.json(fromBackendLead(updated as any));
  } catch (err) {
    const status_ = err instanceof BackendError ? err.status : 500;
    return NextResponse.json({ error: "Could not update status" }, { status: status_ });
  }
}
