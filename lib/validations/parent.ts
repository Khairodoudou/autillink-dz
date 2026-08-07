// lib/validations/parent.ts
// Schémas zod v4 pour l'espace parent

import { z } from "zod";

export const childSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  birthDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide (YYYY-MM-DD)"),
  pinCode: z
    .string()
    .length(4, "Le PIN doit contenir exactement 4 chiffres")
    .regex(/^\d{4}$/, "Le PIN doit contenir uniquement des chiffres"),
  autismLevel: z.enum(["LEGER", "MOYEN", "SEVERE"]).optional(),
  avatarColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/).optional(),
  avatarInitial: z.string().max(2).optional(),
  specialistId: z.string().optional(),
});

export const updateChildSchema = childSchema.partial().omit({ pinCode: true });

export const reportSchema = z.object({
  childId: z.string().min(1),
  mood: z.number().min(1).max(5).optional(),
  sleepHours: z.number().min(0).max(24).optional(),
  tantrums: z.number().min(0).optional(),
  newWords: z.array(z.string()).optional(),
  exercises: z.array(z.string()).optional(),
  notes: z.string().optional(),
});

export const appointmentSchema = z.object({
  childId: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Format de date invalide"),
  time: z.string().optional(),
  type: z.enum(["SESSION", "ASSESSMENT", "CONSULTATION"]).optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
});

export const messageSchema = z.object({
  receiverId: z.string().min(1),
  content: z.string().min(1, "Le message ne peut pas être vide").max(2000),
  childId: z.string().optional(),
});

export const subscriptionSchema = z.object({
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  price: z.number().positive().default(800),
});

export type ChildInput = z.infer<typeof childSchema>;
export type ReportInput = z.infer<typeof reportSchema>;
export type AppointmentInput = z.infer<typeof appointmentSchema>;
export type MessageInput = z.infer<typeof messageSchema>;
