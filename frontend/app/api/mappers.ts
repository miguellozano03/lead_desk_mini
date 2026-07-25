import { Lead, LeadFormData } from "@/lib/validations/lead.schema";

type BackendStatus = "new" | "contacted" | "closed";
type BackendLead = {
  id: string;
  name: string;
  email: string;
  budget_range: string;
  message: string | null;
  status: BackendStatus;
  created_at: string;
  updated_at: string;
};

const statusToUi: Record<BackendStatus, Lead["status"]> = {
  new: "New",
  contacted: "Contacted",
  closed: "Closed",
};

const statusToBackend: Record<Lead["status"], BackendStatus> = {
  New: "new",
  Contacted: "contacted",
  Closed: "closed",
};

export function fromBackendLead(raw: BackendLead): Lead {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    budget: raw.budget_range,
    message: raw.message ?? "",
    status: statusToUi[raw.status],
  };
}

export function toBackendStatus(status: Lead["status"]): BackendStatus {
  return statusToBackend[status];
}

export function toBackendLeadCreate(data: LeadFormData) {
  return {
    name: data.name,
    email: data.email,
    budget_range: data.budget,
    message: data.message,
  };
}
