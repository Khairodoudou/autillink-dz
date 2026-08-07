// lib/validations/specialist.ts
// Schémas zod v4 pour l'espace spécialiste

import { z } from "zod";

export const assessmentSchema = z.object({
  childId: z.string().min(1),
  type: z.enum(["MCHAT_R", "ADOS2", "CARS2", "VB_MAPP"]),
  answers: z.record(z.string(), z.union([z.boolean(), z.number(), z.string()])),
  date: z.string().optional(),
});

export const clinicalReportSchema = z.object({
  childId: z.string().min(1),
  notes: z.string().min(10, "Les notes cliniques doivent contenir au moins 10 caractères"),
  mood: z.number().min(1).max(5).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  tantrums: z.number().min(0).optional(),
});

export const updateAppointmentSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "DONE", "CANCELLED"]),
  notes: z.string().optional(),
});

export type AssessmentInput = z.infer<typeof assessmentSchema>;
export type ClinicalReportInput = z.infer<typeof clinicalReportSchema>;
