import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import AdminLeadsView from "./_components/AdminLeadsView";
import { backendFetch } from "@/lib/api/backend";
import { fromBackendLead } from "@/lib/api/mappers";
import { Lead } from "@/lib/validations/lead.schema";

async function getLeads(token: string): Promise<Lead[]> {
  const data = await backendFetch<{ items: unknown[] }>("/admin/leads", {
    token,
    searchParams: { page_size: "100" },
  });
  return (data.items as any[]).map(fromBackendLead);
}

export default async function AdminPage() {
  const token = (await cookies()).get("ld_token")?.value;
  if (!token) redirect("/admin/login");

  let leads: Lead[] = [];
  try {
    leads = await getLeads(token);
  } catch {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="font-bold text-xl tracking-tight">
          LeadDesk <span className="text-blue-600">MINI</span>
        </div>
        <form action="/api/auth/logout" method="POST">
          <button
            formAction={async () => {
              "use server";
              const { cookies } = await import("next/headers");
              (await cookies()).delete("ld_token");
              redirect("/admin/login");
            }}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
        </form>
      </nav>
      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <AdminLeadsView initialLeads={leads} />
      </main>
    </div>
  );
}
