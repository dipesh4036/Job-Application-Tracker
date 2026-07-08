import { z } from "zod";

export const LOCATIONS = ["remote", "onsite", "hybrid"];
export const STATUSES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Closed",
];

export const createApplicationSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().min(1, "Role is required").max(200),

  location: z.enum(LOCATIONS, {
    errorMap: () => ({ message: "Location must be remote, onsite, or hybrid" }),
  }),

  status: z.enum(STATUSES).default("Applied"),

  appliedDate: z.string().refine(
    (val) => {
      const date = new Date(val);
      const today = new Date();
      today.setHours(23, 59, 59, 999);
      return !isNaN(date.getTime()) && date <= today;
    },
    { message: "Applied date must be valid and not in the future" },
  ),

  nextFollowUpDate: z.string().optional().default(""),

  salaryExpectation: z
    .number()
    .positive("Salary must be a positive number")
    .optional(),

  notes: z.string().max(2000).optional().default(""),
});

// this is use for PUT request validation.
export const updateApplicationSchema = createApplicationSchema.partial();

// this is use for PATCH request validation.
export const updateStatusSchema = z.object({
  status: z.enum(STATUSES, {
    errorMap: () => ({ message: "Invalid status value" }),
  }),
});
