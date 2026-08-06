// lib/mock-data/children.ts
// Données mockées : enfants avec profils complets

export interface Child {
  id: string;
  name: string;
  age: number;
  birthDate: string;
  pin: string; // PIN à 4 chiffres (simulé côté client)
  avatarColor: string;
  avatarInitial: string;
  parentId: string;
  specialistName: string;
  centerName: string;
  diagnosisLevel: "خفيف" | "متوسط" | "شديد";
  joinDate: string;
  stars: number;
  streakDays: number;
  lastActivity: string;
  stats: {
    mood: number; // 1-5
    sleep: number; // heures
    tantrums: number;
    newWords: number;
    exercises: number;
    appointments: number;
  };
  weeklyMood: number[]; // 7 jours
  weeklySleep: number[]; // 7 jours
}

export const mockChildren: Child[] = [
  {
    id: "child-001",
    name: "آدم بن علي",
    age: 6,
    birthDate: "2019-03-15",
    pin: "1234",
    avatarColor: "#E97F6B",
    avatarInitial: "آ",
    parentId: "parent-001",
    specialistName: "د. سارة كمال",
    centerName: "مركز الأمل لرعاية التوحد — الجزائر العاصمة",
    diagnosisLevel: "متوسط",
    joinDate: "2025-09-01",
    stars: 47,
    streakDays: 12,
    lastActivity: "قبل ساعتين",
    stats: {
      mood: 4,
      sleep: 8,
      tantrums: 1,
      newWords: 3,
      exercises: 5,
      appointments: 2,
    },
    weeklyMood: [3, 4, 3, 5, 4, 4, 3],
    weeklySleep: [7, 8, 6, 9, 8, 7, 8],
  },
  {
    id: "child-002",
    name: "لينا بن علي",
    age: 8,
    birthDate: "2017-07-22",
    pin: "5678",
    avatarColor: "#2E8B7E",
    avatarInitial: "ل",
    parentId: "parent-001",
    specialistName: "د. كريم منصور",
    centerName: "مركز الأمل لرعاية التوحد — الجزائر العاصمة",
    diagnosisLevel: "خفيف",
    joinDate: "2025-06-15",
    stars: 83,
    streakDays: 28,
    lastActivity: "اليوم الصباح",
    stats: {
      mood: 5,
      sleep: 9,
      tantrums: 0,
      newWords: 7,
      exercises: 8,
      appointments: 1,
    },
    weeklyMood: [4, 5, 5, 4, 5, 5, 4],
    weeklySleep: [9, 8, 9, 9, 8, 9, 9],
  },
  {
    id: "child-003",
    name: "يوسف بن علي",
    age: 5,
    birthDate: "2020-11-10",
    pin: "9999",
    avatarColor: "#6B4C93",
    avatarInitial: "ي",
    parentId: "parent-001",
    specialistName: "د. سارة كمال",
    centerName: "مركز الأمل لرعاية التوحد — الجزائر العاصمة",
    diagnosisLevel: "شديد",
    joinDate: "2026-01-20",
    stars: 12,
    streakDays: 3,
    lastActivity: "أمس المساء",
    stats: {
      mood: 3,
      sleep: 7,
      tantrums: 3,
      newWords: 1,
      exercises: 3,
      appointments: 3,
    },
    weeklyMood: [2, 3, 3, 2, 4, 3, 3],
    weeklySleep: [6, 7, 7, 6, 8, 7, 7],
  },
];

export function getChildById(id: string): Child | undefined {
  return mockChildren.find((c) => c.id === id);
}
