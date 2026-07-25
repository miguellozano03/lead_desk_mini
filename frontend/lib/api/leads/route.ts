import { NextRequest, NextResponse } from "next/server";
import { backendFetch, BackendError } from "@/lib/api/backend";
import { LeadSchema } from "@/lib/validations/lead.schema";
import { toBackendLeadCreate } from "@/lib/api/mappers";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const parsed = LeadSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten().fieldErrors }, { status: 422 });
  }

  try {
    await backendFetch("/leads", {
      method: "POST",
      body: toBackendLeadCreate(parsed.data),
    });
    return NextResponse.json({ ok: true }, { status: 201 });
  } catch (err) {
    const status = err instanceof BackendError ? err.status : 500;
    return NextResponse.json({ error: "Could not submit lead" }, { status });
  }
}
