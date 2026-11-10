import { z } from "zod";
import { CATEGORIES } from "../types/incident";

export const incidentSchema = z.object({
  title: z.string().trim().min(3, "Enter an incident title.").max(120, "Keep the title under 120 characters."),
  description: z.string().trim().min(10, "Add a few details about what happened.").max(2000, "Keep the description under 2,000 characters."),
  category: z.enum(CATEGORIES),
  location: z.string().trim().min(2, "Enter the incident location.").max(240, "Keep the location under 240 characters."),
  peopleAffected: z.number().int("Use a whole number.").min(0, "The number cannot be negative.").max(100000, "Enter a realistic number."),
  contactInfo: z.string().trim().max(160, "Keep contact information under 160 characters.").optional().or(z.literal("")),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
});

export type IncidentFormValues = z.infer<typeof incidentSchema>;