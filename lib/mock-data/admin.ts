// lib/mock-data/admin.ts

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "parent" | "specialist" | "admin" | "center_admin";
  roleLabel: string;
  status: "نشط" | "غير نشط" | "معلق";
  joinDate: string;
  lastLogin: string;
  centerId?: string;
  centerName?: string;
  wilaya: string;
}

export interface Center {
  id: string;
  name: string;
  director: string;
  email: string;
  phone: string;
  wilaya: string;
  address: string;
  specialistsCount: number;
  childrenCount: number;
  plan: "أساسي" | "متوسط" | "مميز";
  planPrice: number;
  status: "معتمد" | "في انتظار الاعتماد" | "موقوف";
  joinDate: string;
  paymentStatus: "مدفوع" | "متأخر" | "معلق";
  nextPaymentDate: string;
}

export interface Complaint {
  id: string;
  userId: string;
  userName: string;
  userRole: string;
  subject: string;
  description: string;
  date: string;
  status: "نشط" | "معالج" | "مغلق";
  priority: "عالية" | "متوسطة" | "منخفضة";
  assignedTo?: string;
  resolution?: string;
}

export interface AdminStats {
  totalCenters: number;
  totalUsers: number;
  totalChildren: number;
  totalSessions: number;
  totalParents: number;
  totalSpecialists: number;
  activeSubscriptions: number;
  monthlyRevenue: number;
  growthData: {
    month: string;
    users: number;
    children: number;
    sessions: number;
  }[];
}

export const mockAdminStats: AdminStats = {
  totalCenters: 28,
  totalUsers: 1_247,
  totalChildren: 834,
  totalSessions: 12_430,
  totalParents: 890,
  totalSpecialists: 127,
  activeSubscriptions: 312,
  monthlyRevenue: 4_580_000,
  growthData: [
    { month: "يناير",   users: 780,   children: 520,  sessions: 7_200 },
    { month: "فبراير",  users: 850,   children: 570,  sessions: 7_800 },
    { month: "مارس",   users: 920,   children: 615,  sessions: 8_500 },
    { month: "أبريل",  users: 990,   children: 660,  sessions: 9_200 },
    { month: "مايو",   users: 1_060, children: 710,  sessions: 10_100 },
    { month: "يونيو",  users: 1_130, children: 760,  sessions: 11_000 },
    { month: "يوليو",  users: 1_190, children: 800,  sessions: 11_700 },
    { month: "أغسطس", users: 1_247, children: 834,  sessions: 12_430 },
  ],
};

export const mockAdminUsers: AdminUser[] = [
  {
    id: "user-001",
    name: "محمد بن علي",
    email: "mohammed.benali@gmail.com",
    role: "parent",
    roleLabel: "ولي أمر",
    status: "نشط",
    joinDate: "2026-01-15",
    lastLogin: "2026-08-04",
    wilaya: "الجزائر",
  },
  {
    id: "user-002",
    name: "د. سارة كمال",
    email: "sara.kamal@autilinkdz.com",
    role: "specialist",
    roleLabel: "أخصائية",
    status: "نشط",
    joinDate: "2025-09-01",
    lastLogin: "2026-08-04",
    centerId: "center-001",
    centerName: "مركز الأمل",
    wilaya: "الجزائر",
  },
  {
    id: "user-003",
    name: "كمال زروقي",
    email: "kamal.zerrouki@gmail.com",
    role: "parent",
    roleLabel: "ولي أمر",
    status: "نشط",
    joinDate: "2025-11-20",
    lastLogin: "2026-08-03",
    wilaya: "وهران",
  },
  {
    id: "user-004",
    name: "د. كريم منصور",
    email: "karim.mansour@centre-nour.dz",
    role: "specialist",
    roleLabel: "طبيب نفسي",
    status: "نشط",
    joinDate: "2025-08-15",
    lastLogin: "2026-08-04",
    centerId: "center-001",
    centerName: "مركز الأمل",
    wilaya: "الجزائر",
  },
  {
    id: "user-005",
    name: "أمينة بوزيد",
    email: "amina.bouzid@outlook.com",
    role: "parent",
    roleLabel: "ولي أمر",
    status: "معلق",
    joinDate: "2026-06-10",
    lastLogin: "2026-07-20",
    wilaya: "قسنطينة",
  },
  {
    id: "user-006",
    name: "زهير معلم",
    email: "zohir.moualem@center-hope.dz",
    role: "center_admin",
    roleLabel: "مدير مركز",
    status: "نشط",
    joinDate: "2025-06-01",
    lastLogin: "2026-08-04",
    centerId: "center-002",
    centerName: "مركز النور",
    wilaya: "عنابة",
  },
  {
    id: "user-007",
    name: "نوال حمداوي",
    email: "noual.hamdaoui@gmail.com",
    role: "parent",
    roleLabel: "ولي أمر",
    status: "نشط",
    joinDate: "2024-08-20",
    lastLogin: "2026-08-02",
    wilaya: "وهران",
  },
  {
    id: "user-008",
    name: "د. لطيفة عرابي",
    email: "latifa.arabi@centre-iqraa.dz",
    role: "specialist",
    roleLabel: "معالجة نفسية",
    status: "غير نشط",
    joinDate: "2025-10-05",
    lastLogin: "2026-05-18",
    centerId: "center-003",
    centerName: "مركز إقرأ",
    wilaya: "سطيف",
  },
];

export const mockCenters: Center[] = [
  {
    id: "center-001",
    name: "مركز الأمل لرعاية التوحد",
    director: "د. فريد حاج",
    email: "contact@centre-amal.dz",
    phone: "021 45 67 89",
    wilaya: "الجزائر",
    address: "حي السعادة، بئر خادم، الجزائر العاصمة",
    specialistsCount: 12,
    childrenCount: 87,
    plan: "مميز",
    planPrice: 35_000,
    status: "معتمد",
    joinDate: "2025-06-01",
    paymentStatus: "مدفوع",
    nextPaymentDate: "2026-09-01",
  },
  {
    id: "center-002",
    name: "مركز النور للتوحد والإعاقة",
    director: "زهير معلم",
    email: "contact@centre-nour.dz",
    phone: "038 22 11 33",
    wilaya: "عنابة",
    address: "شارع العربي بن مهيدي، عنابة",
    specialistsCount: 8,
    childrenCount: 45,
    plan: "متوسط",
    planPrice: 18_000,
    status: "معتمد",
    joinDate: "2025-08-15",
    paymentStatus: "مدفوع",
    nextPaymentDate: "2026-09-15",
  },
  {
    id: "center-003",
    name: "مركز إقرأ لتأهيل ذوي الاحتياجات الخاصة",
    director: "أ. سامية بلقاسم",
    email: "info@centre-iqraa.dz",
    phone: "036 75 44 22",
    wilaya: "سطيف",
    address: "حي 1000 سكن، سطيف",
    specialistsCount: 5,
    childrenCount: 28,
    plan: "أساسي",
    planPrice: 8_000,
    status: "معتمد",
    joinDate: "2026-01-20",
    paymentStatus: "مدفوع",
    nextPaymentDate: "2026-09-20",
  },
  {
    id: "center-004",
    name: "مركز الرعاية المتكاملة — وهران",
    director: "د. رضا بلعباس",
    email: "raya-oran@gmail.com",
    phone: "041 33 55 77",
    wilaya: "وهران",
    address: "حي المنزه، وهران",
    specialistsCount: 3,
    childrenCount: 18,
    plan: "أساسي",
    planPrice: 8_000,
    status: "في انتظار الاعتماد",
    joinDate: "2026-07-15",
    paymentStatus: "معلق",
    nextPaymentDate: "2026-09-01",
  },
  {
    id: "center-005",
    name: "مؤسسة التضامن والرعاية — قسنطينة",
    director: "أ. منير قاسمي",
    email: "solidarite-constantine@outlook.com",
    phone: "031 67 89 01",
    wilaya: "قسنطينة",
    address: "شارع الخوارزمي، قسنطينة",
    specialistsCount: 6,
    childrenCount: 0,
    plan: "متوسط",
    planPrice: 18_000,
    status: "موقوف",
    joinDate: "2025-04-10",
    paymentStatus: "متأخر",
    nextPaymentDate: "2026-07-10",
  },
];

export const mockComplaints: Complaint[] = [
  {
    id: "cmp-001",
    userId: "user-001",
    userName: "محمد بن علي",
    userRole: "ولي أمر",
    subject: "مشكلة في الوصول إلى الملف الصحي للطفل",
    description: "منذ ثلاثة أيام لا أستطيع الاطلاع على ملف آدم الصحي. تظهر رسالة خطأ في كل مرة.",
    date: "2026-08-02",
    status: "نشط",
    priority: "عالية",
    assignedTo: "فريق الدعم التقني",
  },
  {
    id: "cmp-002",
    userId: "user-003",
    userName: "كمال زروقي",
    userRole: "ولي أمر",
    subject: "تأخر في إرسال التقرير الشهري",
    description: "لم أستلم تقرير شهر يوليو حتى الآن. التواصل مع الأخصائية صعب عبر المنصة.",
    date: "2026-08-01",
    status: "معالج",
    priority: "متوسطة",
    assignedTo: "د. كريم منصور",
    resolution: "تم التواصل مع الأخصائية وإرسال التقرير عبر البريد الإلكتروني كحل مؤقت.",
  },
  {
    id: "cmp-003",
    userId: "user-004",
    userName: "د. كريم منصور",
    userRole: "أخصائي",
    subject: "بطء في تحميل الملفات الثقيلة",
    description: "تقارير الـ PDF تستغرق وقتاً طويلاً جداً في الرفع. الحد الأقصى للحجم يبدو صغيراً.",
    date: "2026-07-29",
    status: "نشط",
    priority: "متوسطة",
    assignedTo: "فريق الدعم التقني",
  },
  {
    id: "cmp-004",
    userId: "user-005",
    userName: "أمينة بوزيد",
    userRole: "ولي أمر",
    subject: "صعوبة في إتمام عملية الدفع",
    description: "جربت أكثر من مرة إتمام الدفع ببطاقة CIB ولم تنجح العملية.",
    date: "2026-07-25",
    status: "معالج",
    priority: "عالية",
    assignedTo: "فريق المدفوعات",
    resolution: "تم تحديث بوابة الدفع وإضافة دعم CIB. الحساب تم تفعيله يدوياً.",
  },
  {
    id: "cmp-005",
    userId: "user-007",
    userName: "نوال حمداوي",
    userRole: "ولي أمر",
    subject: "اقتراح إضافة خاصية الإشعارات الفورية",
    description: "أتمنى إضافة إشعارات فورية عند وصول تقارير أو رسائل جديدة من الأخصائي.",
    date: "2026-07-20",
    status: "مغلق",
    priority: "منخفضة",
    resolution: "تم رفع الطلب لفريق التطوير ضمن خارطة الطريق للربع القادم.",
  },
];
