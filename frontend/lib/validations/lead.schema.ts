import * as z from "zod";

export const LeadSchema = z.object({
  name: z.string().min(2, "Name is required"),
  email: z.email("Invalid email"),
  budget: z.string().min(1, "Select a budget"),
  message: z.string().min(10, "Message is too short"),
});

export type LeadFormData = z.infer<typeof LeadSchema>;
