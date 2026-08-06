// lib/mock-data/parents.ts

export interface DailyLogEntry {
  id: string;
  date: string;
  time: string;
  childId: string;
  childName: string;
  mood: number;
  sleep: number;
  tantrums: number;
  newWords: string[];
  notes: string;
  exercises: string[];
}

export interface Report {
  id: string;
  date: string;
  childId: string;
  childName: string;
  specialistName: string;
  type: "تقرير شهري" | "تقرير تقييم" | "تقرير متابعة";
  summary: string;
  recommendations: string;
  fileName: string;
}

export interface Appointment {
  id: string;
  date: string;
  time: string;
  childId: string;
  childName: string;
  specialistName: string;
  type: "جلسة علاج" | "تقييم" | "استشارة";
  status: "قادم" | "مكتمل" | "ملغى";
  location: string;
  notes?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: "parent" | "specialist" | "admin";
  content: string;
  timestamp: string;
  read: boolean;
}

export interface Conversation {
  id: string;
  participantName: string;
  participantRole: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  messages: Message[];
}

export interface ParentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  wilaya: string;
  address: string;
  subscription: {
    plan: "اشتراك فردي";
    price: number;
    currency: "DA";
    status: "نشط" | "منتهي" | "معلق";
    startDate: string;
    endDate: string;
    autoRenew: boolean;
  };
}

export const mockParentProfile: ParentProfile = {
  id: "parent-001",
  name: "محمد بن علي",
  email: "mohammed.benali@gmail.com",
  phone: "0661 234 567",
  wilaya: "الجزائر",
  address: "حي السعادة، الأبيار، الجزائر العاصمة",
  subscription: {
    plan: "اشتراك فردي",
    price: 800,
    currency: "DA",
    status: "نشط",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    autoRenew: true,
  },
};

export const mockDailyLog: DailyLogEntry[] = [
  {
    id: "log-001",
    date: "2026-08-04",
    time: "08:30",
    childId: "child-001",
    childName: "آدم بن علي",
    mood: 4,
    sleep: 8,
    tantrums: 1,
    newWords: ["شكراً", "ماء"],
    notes: "آدم كان في مزاج جيد اليوم. تناول إفطاره كاملاً وشارك في اللعب مع أخته لمدة 20 دقيقة.",
    exercises: ["تمرين التنفس", "تمرين التواصل البصري"],
  },
  {
    id: "log-002",
    date: "2026-08-03",
    time: "09:15",
    childId: "child-001",
    childName: "آدم بن علي",
    mood: 3,
    sleep: 7,
    tantrums: 2,
    newWords: ["لا"],
    notes: "يوم صعب قليلاً. كان هناك نوبتا غضب بسبب تغيير الروتين. حاولنا تطبيق استراتيجية التهدئة.",
    exercises: ["تمرين التنفس"],
  },
  {
    id: "log-003",
    date: "2026-08-02",
    time: "10:00",
    childId: "child-002",
    childName: "لينا بن علي",
    mood: 5,
    sleep: 9,
    tantrums: 0,
    newWords: ["أريد", "العب", "جميل"],
    notes: "يوم ممتاز للينا. أتقنت كلمات جديدة وأبدت اهتماماً كبيراً بالقراءة.",
    exercises: ["تمرين النطق", "تمرين التواصل الاجتماعي", "قراءة قصة"],
  },
  {
    id: "log-004",
    date: "2026-08-01",
    time: "11:30",
    childId: "child-001",
    childName: "آدم بن علي",
    mood: 4,
    sleep: 8,
    tantrums: 0,
    newWords: ["أحبك", "بابا"],
    notes: "جلسة ممتعة مع الأخصائية. آدم نطق بكلمة 'أحبك' لأول مرة وهذا إنجاز كبير جداً!",
    exercises: ["جلسة مع الأخصائية", "تمرين النطق"],
  },
];

export const mockReports: Report[] = [
  {
    id: "rep-001",
    date: "2026-07-31",
    childId: "child-001",
    childName: "آدم بن علي",
    specialistName: "د. سارة كمال",
    type: "تقرير شهري",
    summary: "تحسن ملحوظ في مهارات التواصل اللفظي خلال شهر يوليو. آدم نطق بـ 12 كلمة جديدة وأظهر تحسناً في التفاعل الاجتماعي.",
    recommendations: "الاستمرار في جلسات النطق مرتين أسبوعياً. تعزيز اللعب التشاركي مع الأقران.",
    fileName: "تقرير_آدم_يوليو_2026.pdf",
  },
  {
    id: "rep-002",
    date: "2026-07-15",
    childId: "child-001",
    childName: "آدم بن علي",
    specialistName: "د. سارة كمال",
    type: "تقرير تقييم",
    summary: "تقييم نصف سنوي — مستوى التطور في المهارات الحركية والاجتماعية والتواصلية.",
    recommendations: "إضافة تمارين التكامل الحسي إلى البرنامج اليومي.",
    fileName: "تقييم_آدم_منتصف_2026.pdf",
  },
  {
    id: "rep-003",
    date: "2026-06-30",
    childId: "child-002",
    childName: "لينا بن علي",
    specialistName: "د. كريم منصور",
    type: "تقرير شهري",
    summary: "أداء استثنائي لـ لينا خلال شهر يونيو. تمكنت من بناء جمل كاملة والتعبير عن احتياجاتها بوضوح.",
    recommendations: "التدرج نحو التواصل مع زملاء الصف. الانتقال التدريجي إلى الفصل الدمجي.",
    fileName: "تقرير_لينا_يونيو_2026.pdf",
  },
];

export const mockAppointments: Appointment[] = [
  {
    id: "apt-001",
    date: "2026-08-07",
    time: "10:00",
    childId: "child-001",
    childName: "آدم بن علي",
    specialistName: "د. سارة كمال",
    type: "جلسة علاج",
    status: "قادم",
    location: "مركز الأمل — غرفة 3",
  },
  {
    id: "apt-002",
    date: "2026-08-14",
    time: "14:30",
    childId: "child-002",
    childName: "لينا بن علي",
    specialistName: "د. كريم منصور",
    type: "جلسة علاج",
    status: "قادم",
    location: "مركز الأمل — غرفة 5",
  },
  {
    id: "apt-003",
    date: "2026-08-10",
    time: "09:00",
    childId: "child-001",
    childName: "آدم بن علي",
    specialistName: "د. سارة كمال",
    type: "تقييم",
    status: "قادم",
    location: "مركز الأمل — غرفة التقييم",
    notes: "تقييم ربع سنوي — إحضار التقارير السابقة",
  },
  {
    id: "apt-004",
    date: "2026-07-28",
    time: "11:00",
    childId: "child-001",
    childName: "آدم بن علي",
    specialistName: "د. سارة كمال",
    type: "جلسة علاج",
    status: "مكتمل",
    location: "مركز الأمل — غرفة 3",
  },
  {
    id: "apt-005",
    date: "2026-07-21",
    time: "15:00",
    childId: "child-003",
    childName: "يوسف بن علي",
    specialistName: "د. سارة كمال",
    type: "استشارة",
    status: "مكتمل",
    location: "عن بُعد (فيديو)",
  },
];

export const mockConversations: Conversation[] = [
  {
    id: "conv-001",
    participantName: "د. سارة كمال",
    participantRole: "أخصائية نطق",
    avatar: "س",
    lastMessage: "بارك الله فيكم، لاحظت تقدماً ملحوظاً في جلسة اليوم.",
    lastMessageTime: "11:45",
    unreadCount: 2,
    messages: [
      {
        id: "msg-001",
        senderId: "specialist-001",
        senderName: "د. سارة كمال",
        senderRole: "specialist",
        content: "السلام عليكم، كيف كان آدم هذا الأسبوع؟",
        timestamp: "2026-08-03 09:00",
        read: true,
      },
      {
        id: "msg-002",
        senderId: "parent-001",
        senderName: "محمد بن علي",
        senderRole: "parent",
        content: "وعليكم السلام دكتورة، الحمد لله كان في تحسن، نطق بكلمتين جديدتين هذا الأسبوع.",
        timestamp: "2026-08-03 09:30",
        read: true,
      },
      {
        id: "msg-003",
        senderId: "specialist-001",
        senderName: "د. سارة كمال",
        senderRole: "specialist",
        content: "ممتاز! هذا تقدم رائع. أنصح بتكرار التمارين الصوتية يومياً.",
        timestamp: "2026-08-04 10:00",
        read: true,
      },
      {
        id: "msg-004",
        senderId: "specialist-001",
        senderName: "د. سارة كمال",
        senderRole: "specialist",
        content: "بارك الله فيكم، لاحظت تقدماً ملحوظاً في جلسة اليوم.",
        timestamp: "2026-08-04 11:45",
        read: false,
      },
    ],
  },
  {
    id: "conv-002",
    participantName: "د. كريم منصور",
    participantRole: "طبيب نفسي",
    avatar: "ك",
    lastMessage: "موعدكم القادم يوم الخميس الساعة 14:30",
    lastMessageTime: "أمس",
    unreadCount: 0,
    messages: [
      {
        id: "msg-005",
        senderId: "specialist-002",
        senderName: "د. كريم منصور",
        senderRole: "specialist",
        content: "موعدكم القادم يوم الخميس الساعة 14:30، هل يناسبكم ذلك؟",
        timestamp: "2026-08-03 14:00",
        read: true,
      },
      {
        id: "msg-006",
        senderId: "parent-001",
        senderName: "محمد بن علي",
        senderRole: "parent",
        content: "نعم دكتور، سنكون حاضرين إن شاء الله.",
        timestamp: "2026-08-03 15:00",
        read: true,
      },
    ],
  },
  {
    id: "conv-003",
    participantName: "إدارة مركز الأمل",
    participantRole: "إدارة المركز",
    avatar: "إ",
    lastMessage: "تم تأكيد تجديد اشتراككم للشهر القادم.",
    lastMessageTime: "2026-07-30",
    unreadCount: 0,
    messages: [
      {
        id: "msg-007",
        senderId: "admin-001",
        senderName: "إدارة مركز الأمل",
        senderRole: "admin",
        content: "تم تأكيد تجديد اشتراككم للشهر القادم. شكراً لثقتكم بنا.",
        timestamp: "2026-07-30 10:00",
        read: true,
      },
    ],
  },
];
