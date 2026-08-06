// lib/mock-data/specialists.ts

export interface Patient {
  id: string;
  name: string;
  age: number;
  parentName: string;
  parentPhone: string;
  diagnosisLevel: "خفيف" | "متوسط" | "شديد";
  diagnosisDate: string;
  lastSession: string;
  nextSession: string;
  sessionsCount: number;
  status: "نشط" | "متوقف" | "مكتمل";
  avatarColor: string;
  avatarInitial: string;
  skills: {
    communication: number; // 0-100
    social: number;
    sensory: number;
    motor: number;
    cognitive: number;
  };
  skillsHistory: {
    month: string;
    communication: number;
    social: number;
    sensory: number;
    motor: number;
    cognitive: number;
  }[];
  notes: string;
}

export interface SpecialistAppointment {
  id: string;
  date: string;
  time: string;
  duration: number; // minutes
  patientId: string;
  patientName: string;
  type: "جلسة علاج" | "تقييم" | "استشارة";
  status: "قادم" | "مكتمل" | "ملغى";
  notes?: string;
}

export interface Assessment {
  id: string;
  tool: "mchat" | "ados2" | "cars2" | "vbmapp";
  toolName: string;
  patientId: string;
  patientName: string;
  date: string;
  score: number;
  maxScore: number;
  result: string;
  recommendation: string;
}

export const mockPatients: Patient[] = [
  {
    id: "child-001",
    name: "آدم بن علي",
    age: 6,
    parentName: "محمد بن علي",
    parentPhone: "0661 234 567",
    diagnosisLevel: "متوسط",
    diagnosisDate: "2025-09-01",
    lastSession: "2026-07-28",
    nextSession: "2026-08-07",
    sessionsCount: 42,
    status: "نشط",
    avatarColor: "#E97F6B",
    avatarInitial: "آ",
    skills: {
      communication: 55,
      social: 40,
      sensory: 65,
      motor: 70,
      cognitive: 60,
    },
    skillsHistory: [
      { month: "مارس", communication: 30, social: 20, sensory: 45, motor: 55, cognitive: 40 },
      { month: "أبريل", communication: 38, social: 25, sensory: 50, motor: 60, cognitive: 45 },
      { month: "مايو",  communication: 44, social: 30, sensory: 55, motor: 63, cognitive: 50 },
      { month: "يونيو", communication: 48, social: 35, sensory: 60, motor: 67, cognitive: 55 },
      { month: "يوليو", communication: 52, social: 38, sensory: 63, motor: 68, cognitive: 58 },
      { month: "أغسطس", communication: 55, social: 40, sensory: 65, motor: 70, cognitive: 60 },
    ],
    notes: "تقدم ملحوظ في مهارات التواصل اللفظي. يحتاج دعماً إضافياً في التفاعل الاجتماعي.",
  },
  {
    id: "child-002",
    name: "لينا بن علي",
    age: 8,
    parentName: "محمد بن علي",
    parentPhone: "0661 234 567",
    diagnosisLevel: "خفيف",
    diagnosisDate: "2025-06-15",
    lastSession: "2026-07-30",
    nextSession: "2026-08-14",
    sessionsCount: 28,
    status: "نشط",
    avatarColor: "#2E8B7E",
    avatarInitial: "ل",
    skills: {
      communication: 80,
      social: 70,
      sensory: 85,
      motor: 90,
      cognitive: 78,
    },
    skillsHistory: [
      { month: "مارس",  communication: 60, social: 50, sensory: 70, motor: 75, cognitive: 60 },
      { month: "أبريل", communication: 65, social: 55, sensory: 74, motor: 80, cognitive: 64 },
      { month: "مايو",  communication: 70, social: 60, sensory: 78, motor: 84, cognitive: 68 },
      { month: "يونيو", communication: 74, social: 64, sensory: 81, motor: 87, cognitive: 72 },
      { month: "يوليو", communication: 77, social: 67, sensory: 83, motor: 88, cognitive: 75 },
      { month: "أغسطس", communication: 80, social: 70, sensory: 85, motor: 90, cognitive: 78 },
    ],
    notes: "أداء ممتاز. مرشحة للانتقال إلى برنامج الدمج المدرسي.",
  },
  {
    id: "child-003",
    name: "يوسف بن علي",
    age: 5,
    parentName: "محمد بن علي",
    parentPhone: "0661 234 567",
    diagnosisLevel: "شديد",
    diagnosisDate: "2026-01-20",
    lastSession: "2026-07-25",
    nextSession: "2026-08-10",
    sessionsCount: 15,
    status: "نشط",
    avatarColor: "#6B4C93",
    avatarInitial: "ي",
    skills: {
      communication: 20,
      social: 15,
      sensory: 30,
      motor: 45,
      cognitive: 25,
    },
    skillsHistory: [
      { month: "أبريل", communication: 10, social: 8, sensory: 18, motor: 35, cognitive: 15 },
      { month: "مايو",  communication: 13, social: 10, sensory: 22, motor: 38, cognitive: 18 },
      { month: "يونيو", communication: 15, social: 11, sensory: 25, motor: 40, cognitive: 20 },
      { month: "يوليو", communication: 18, social: 13, sensory: 28, motor: 43, cognitive: 23 },
      { month: "أغسطس", communication: 20, social: 15, sensory: 30, motor: 45, cognitive: 25 },
    ],
    notes: "حديث الانضمام. يتقدم ببطء — يحتاج مزيداً من التحفيز الحسي والتكرار.",
  },
  {
    id: "patient-004",
    name: "سهام زروقي",
    age: 7,
    parentName: "كمال زروقي",
    parentPhone: "0555 876 543",
    diagnosisLevel: "متوسط",
    diagnosisDate: "2025-11-10",
    lastSession: "2026-08-01",
    nextSession: "2026-08-08",
    sessionsCount: 35,
    status: "نشط",
    avatarColor: "#F5B942",
    avatarInitial: "س",
    skills: {
      communication: 62,
      social: 58,
      sensory: 70,
      motor: 75,
      cognitive: 65,
    },
    skillsHistory: [
      { month: "مارس",  communication: 40, social: 35, sensory: 50, motor: 60, cognitive: 45 },
      { month: "أبريل", communication: 46, social: 40, sensory: 55, motor: 64, cognitive: 50 },
      { month: "مايو",  communication: 52, social: 46, sensory: 61, motor: 68, cognitive: 56 },
      { month: "يونيو", communication: 57, social: 51, sensory: 65, motor: 71, cognitive: 60 },
      { month: "يوليو", communication: 60, social: 55, sensory: 68, motor: 73, cognitive: 63 },
      { month: "أغسطس", communication: 62, social: 58, sensory: 70, motor: 75, cognitive: 65 },
    ],
    notes: "تقدم منتظم في جميع المجالات. العائلة متعاونة جداً مع البرنامج.",
  },
  {
    id: "patient-005",
    name: "رياض حمداوي",
    age: 9,
    parentName: "نوال حمداوي",
    parentPhone: "0770 543 210",
    diagnosisLevel: "خفيف",
    diagnosisDate: "2024-08-05",
    lastSession: "2026-07-29",
    nextSession: "2026-08-12",
    sessionsCount: 60,
    status: "نشط",
    avatarColor: "#1D5B79",
    avatarInitial: "ر",
    skills: {
      communication: 85,
      social: 75,
      sensory: 88,
      motor: 92,
      cognitive: 80,
    },
    skillsHistory: [
      { month: "مارس",  communication: 70, social: 60, sensory: 78, motor: 85, cognitive: 68 },
      { month: "أبريل", communication: 74, social: 63, sensory: 81, motor: 87, cognitive: 71 },
      { month: "مايو",  communication: 77, social: 67, sensory: 84, motor: 89, cognitive: 74 },
      { month: "يونيو", communication: 80, social: 70, sensory: 86, motor: 90, cognitive: 77 },
      { month: "يوليو", communication: 83, social: 73, sensory: 87, motor: 91, cognitive: 79 },
      { month: "أغسطس", communication: 85, social: 75, sensory: 88, motor: 92, cognitive: 80 },
    ],
    notes: "مرحلة متقدمة جداً. يستعد لإتمام البرنامج والانتقال للمدرسة العادية.",
  },
];

export const mockSpecialistAppointments: SpecialistAppointment[] = [
  {
    id: "sapt-001",
    date: "2026-08-04",
    time: "09:00",
    duration: 60,
    patientId: "child-001",
    patientName: "آدم بن علي",
    type: "جلسة علاج",
    status: "قادم",
  },
  {
    id: "sapt-002",
    date: "2026-08-04",
    time: "11:00",
    duration: 45,
    patientId: "patient-004",
    patientName: "سهام زروقي",
    type: "جلسة علاج",
    status: "قادم",
  },
  {
    id: "sapt-003",
    date: "2026-08-04",
    time: "14:00",
    duration: 90,
    patientId: "child-003",
    patientName: "يوسف بن علي",
    type: "تقييم",
    status: "قادم",
    notes: "تقييم ربع سنوي شامل",
  },
  {
    id: "sapt-004",
    date: "2026-08-07",
    time: "10:00",
    duration: 60,
    patientId: "child-001",
    patientName: "آدم بن علي",
    type: "جلسة علاج",
    status: "قادم",
  },
  {
    id: "sapt-005",
    date: "2026-07-28",
    time: "10:00",
    duration: 60,
    patientId: "child-001",
    patientName: "آدم بن علي",
    type: "جلسة علاج",
    status: "مكتمل",
  },
  {
    id: "sapt-006",
    date: "2026-07-25",
    time: "09:30",
    duration: 60,
    patientId: "patient-005",
    patientName: "رياض حمداوي",
    type: "جلسة علاج",
    status: "مكتمل",
  },
];

export const mockAssessments: Assessment[] = [
  {
    id: "ass-001",
    tool: "mchat",
    toolName: "M-CHAT-R",
    patientId: "child-001",
    patientName: "آدم بن علي",
    date: "2025-09-01",
    score: 12,
    maxScore: 20,
    result: "خطر متوسط",
    recommendation: "التحويل إلى تقييم تشخيصي شامل",
  },
  {
    id: "ass-002",
    tool: "cars2",
    toolName: "CARS-2",
    patientId: "child-001",
    patientName: "آدم بن علي",
    date: "2025-09-15",
    score: 34,
    maxScore: 60,
    result: "توحد متوسط",
    recommendation: "برنامج تدخل مكثف",
  },
];

export const mockSpecialistProfile = {
  id: "specialist-001",
  name: "د. سارة كمال",
  speciality: "أخصائية نطق وتواصل",
  email: "sara.kamal@autilinkdz.com",
  phone: "0550 123 456",
  centerName: "مركز الأمل لرعاية التوحد",
  licenseNumber: "ALG-SLT-2018-0042",
  experience: 8,
  patientsCount: 5,
  sessionsThisWeek: 12,
  pendingReports: 3,
};
