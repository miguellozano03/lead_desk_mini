"use client";

import { useState } from "react";
import { ExpandableMessage } from "./ExpandableMessage";
import { Lead } from "@/lib/validations/lead.schema";

export default function AdminLeadsView({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleStatus = async (id: string, currentStatus: Lead["status"]) => {
    const nextStatus: Lead["status"] =
      currentStatus === "New" ? "Contacted" : currentStatus === "Contacted" ? "Closed" : "New";

    // optimistic update
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, status: nextStatus } : lead)),
    );

    const res = await fetch(`/api/admin/leads/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: nextStatus }),
    });

    if (!res.ok) {
      // rollback si falla
      setLeads((prev) =>
        prev.map((lead) => (lead.id === id ? { ...lead, status: currentStatus } : lead)),
      );
    }
  };

  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const StatusBadge = ({ lead }: { lead: Lead }) => {
    const styles = {
      New: "bg-amber-100 text-amber-800 border-amber-200",
      Contacted: "bg-blue-100 text-blue-800 border-blue-200",
      Closed: "bg-green-100 text-green-800 border-green-200",
    };

    return (
      <button
        onClick={() => toggleStatus(lead.id, lead.status)}
        className={`w-28 h-7 inline-flex items-center justify-center rounded-full text-xs font-semibold border transition-all active:scale-95 shrink-0 ${
          styles[lead.status]
        }`}
      >
        {lead.status}
      </button>
    );
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Leads</h1>
        <input
          type="text"
          placeholder="Search by name or email"
          className="w-full md:w-80 px-4 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm text-sm"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="hidden md:block bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-gray-50/80 text-gray-500 border-b border-gray-200 text-xs uppercase tracking-wider">
                <th className="py-3.5 px-6 font-semibold">Name</th>
                <th className="py-3.5 px-6 font-semibold">Email</th>
                <th className="py-3.5 px-6 font-semibold">Budget</th>
                <th className="py-3.5 px-6 font-semibold">Message</th>
                <th className="py-3.5 px-6 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm align-top">
              {filteredLeads.map((lead) => (
                <tr key={lead.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-6 font-semibold whitespace-nowrap">{lead.name}</td>
                  <td className="py-4 px-6 text-gray-600 break-all max-w-70">{lead.email}</td>
                  <td className="py-4 px-6 text-gray-600 whitespace-nowrap font-medium">
                    {lead.budget}
                  </td>
                  <td className="py-4 px-6">
                    <ExpandableMessage message={lead.message} />
                  </td>
                  <td className="py-4 px-6 text-center">
                    <StatusBadge lead={lead} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="md:hidden flex flex-col gap-3">
        {filteredLeads.map((lead) => (
          <div
            key={lead.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col gap-2"
          >
            <div className="flex justify-between items-start gap-2">
              <div>
                <h3 className="font-semibold text-base leading-snug">{lead.name}</h3>
                <p className="text-gray-500 text-xs break-all">{lead.email}</p>
              </div>
              <StatusBadge lead={lead} />
            </div>

            <div className="text-xs font-medium text-gray-700 bg-gray-50 px-2.5 py-1 rounded-md w-max border border-gray-100">
              Budget: {lead.budget}
            </div>

            <div className="text-xs text-gray-600 mt-1 pt-2 border-t border-gray-100">
              <ExpandableMessage message={lead.message} />
            </div>
          </div>
        ))}
      </div>

      <p className="text-gray-400 text-xs mt-4">
        <span className="hidden md:inline">
          Click on the status pill to cycle to the next state: New → Contacted → Closed.
        </span>
        <span className="md:hidden">Tap the status pill to change its state.</span>
      </p>
    </>
  );
}
