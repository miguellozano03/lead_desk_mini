import AdminLeadsView from "./_components/AdminLeadsView";
import { Lead } from "@/lib/validations/lead.schema";

async function getLeads(): Promise<Lead[]> {
  return [
    {
      id: "1",
      name: "Aarav Sharma",
      email: "aarav.sharma@techventure.in",
      budget: "$1k-5k",
      message:
        "We need a responsive landing page for our Bengaluru-based AI startup. Looking for a fast delivery with clean code.",
      status: "New",
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya.patel.enterprises@gmail.com",
      budget: "$5k-20k",
      message:
        "Looking to migrate our e-commerce store to Next.js and Tailwind CSS. We have over 2,000 SKUs and require seamless search performance.",
      status: "Contacted",
    },
    {
      id: "3",
      name: "Rohan Verma",
      email: "rohan.verma@fintech.co.in",
      budget: "< $1k",
      message: "Just need a minimal landing page and brand style guide for an early concept.",
      status: "Closed",
    },
    {
      id: "4",
      name: "Ananya Iyer",
      email: "ananya.iyer@globalagencies.com",
      budget: "$20k+",
      message:
        "We want to completely redesign our enterprise portal. The platform must support high traffic, integrate multi-language features, and include a dedicated analytics dashboard.",
      status: "New",
    },
  ];
}

export default async function AdminPage() {
  const leads = await getLeads();

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navigation Panel */}
      <nav className="bg-white border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="font-bold text-xl tracking-tight">
          LeadDesk <span className="text-blue-600">MINI</span>
        </div>
        <div className="text-sm font-medium text-gray-500 hidden md:block">Admin Dashboard</div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-8">
        <AdminLeadsView initialLeads={leads} />
      </main>
    </div>
  );
}
