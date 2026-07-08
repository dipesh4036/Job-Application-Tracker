import { z } from "zod";

export const LOCATIONS = ["remote", "onsite", "hybrid"];
export const STATUSES = [
  "Applied",
  "Screening",
  "Interview",
  "Offer",
  "Closed",
];

export const applicationSchema = z.object({
  company: z.string().min(1, "Company is required").max(200),
  role: z.string().min(1, "Role is required").max(200),

  location: z.enum(LOCATIONS, {
    error: () => "Please select a location type",
  }),

  status: z.enum(STATUSES).default("Applied"),

  appliedDate: z
    .string()
    .min(1, "Applied date is required")
    .refine(
      (val) => {
        const date = new Date(val);
        const today = new Date();
        today.setHours(23, 59, 59, 999);
        return !isNaN(date.getTime()) && date <= today;
      },
      { message: "Applied date cannot be in the future" },
    ),

  nextFollowUpDate: z.string().optional().or(z.literal("")),

  salaryExpectation: z
    .union([
      z.literal(""),
      z.coerce.number().positive("Salary must be a positive number"),
    ])
    .optional()
    .transform((val) => (val === "" || val === undefined ? undefined : val)),

  notes: z
    .string()
    .max(2000, "Notes must be under 2000 characters")
    .optional()
    .or(z.literal("")),
});
