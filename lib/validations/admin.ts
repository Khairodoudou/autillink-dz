// lib/validations/admin.ts
// Schémas zod v4 pour l'espace admin

import { z } from "zod";

export const centerSchema = z.object({
  name: z.string().min(3),
  wilaya: z.string().min(2),
  address: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  director: z.string().optional(),
});

export const updateCenterStatusSchema = z.object({
  status: z.enum(["PENDING", "ACTIVE", "SUSPENDED"]),
});

export const updateUserSchema = z.object({
  isActive: z.boolean().optional(),
  role: z.enum(["PARENT", "SPECIALIST", "ADMIN"]).optional(),
  centerId: z.string().optional(),
});

export const complaintSchema = z.object({
  fromEmail: z.string().email(),
  fromName: z.string().min(2),
  fromRole: z.string().optional(),
  subject: z.string().min(5),
  message: z.string().min(10),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"]).optional(),
});

export const updateComplaintSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
  resolution: z.string().optional(),
  assignedTo: z.string().optional(),
});

export const subscriptionSchema = z.object({
  centerId: z.string().min(1),
  plan: z.enum(["BASIC", "STANDARD", "PREMIUM"]),
  price: z.number().positive(),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export type CenterInput = z.infer<typeof centerSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type ComplaintInput = z.infer<typeof complaintSchema>;
