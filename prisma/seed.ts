// prisma/seed.ts
import { db } from "../lib/db";
import { hashPassword } from "../lib/auth/password";

async function main() {
  console.log("🌱 Starting seed database...");

  // Clear existing data
  await db.complaint.deleteMany();
  await db.gameScore.deleteMany();
  await db.message.deleteMany();
  await db.appointment.deleteMany();
  await db.assessment.deleteMany();
  await db.report.deleteMany();
  await db.child.deleteMany();
  await db.individualSubscription.deleteMany();
  await db.subscription.deleteMany();
  await db.user.deleteMany();
  await db.center.deleteMany();

  const defaultPasswordHash = await hashPassword("password123");
  const defaultPinHash = await hashPassword("1234");
  const pin5678Hash = await hashPassword("5678");

  // 1. Create Admin
  const admin = await db.user.create({
    data: {
      name: "مدير النظام",
      email: "admin@gmail.com",
      password: await hashPassword("admin1234"),
      role: "ADMIN",
      phone: "0550 000 000",
      wilaya: "الجزائر",
    },
  });
  console.log("✅ Admin created:", admin.email);

  // 2. Create Centers
  const center1 = await db.center.create({
    data: {
      name: "مركز الأمل لرعاية التوحد",
      director: "د. فريد حاج",
      email: "contact@centre-amal.dz",
      phone: "021 45 67 89",
      wilaya: "الجزائر",
      address: "حي السعادة، بئر خادم، الجزائر العاصمة",
      status: "ACTIVE",
      subscription: {
        create: {
          plan: "PREMIUM",
          price: 35000,
          startDate: new Date("2025-06-01"),
          endDate: new Date("2026-09-01"),
          status: "ACTIVE",
        },
      },
    },
  });

  const center2 = await db.center.create({
    data: {
      name: "مركز النور للتوحد والإعاقة",
      director: "زهير معلم",
      email: "contact@centre-nour.dz",
      phone: "038 22 11 33",
      wilaya: "عنابة",
      address: "شارع العربي بن مهيدي، عنابة",
      status: "ACTIVE",
      subscription: {
        create: {
          plan: "STANDARD",
          price: 18000,
          startDate: new Date("2025-08-15"),
          endDate: new Date("2026-09-15"),
          status: "ACTIVE",
        },
      },
    },
  });
  console.log("✅ Centers created");

  // 3. Create Specialists
  const spec1 = await db.user.create({
    data: {
      name: "د. سارة كمال",
      email: "sara.kamal@autilinkdz.com",
      password: defaultPasswordHash,
      role: "SPECIALIST",
      speciality: "أخصائية نطق وتواصل",
      phone: "0550 123 456",
      licenseNumber: "ALG-SLT-2018-0042",
      experience: 8,
      wilaya: "الجزائر",
      centerId: center1.id,
    },
  });

  const spec2 = await db.user.create({
    data: {
      name: "د. كريم منصور",
      email: "karim.mansour@centre-nour.dz",
      password: defaultPasswordHash,
      role: "SPECIALIST",
      speciality: "طبيب نفسي للأطفال",
      phone: "0551 987 654",
      licenseNumber: "ALG-PSY-2019-0115",
      experience: 6,
      wilaya: "الجزائر",
      centerId: center1.id,
    },
  });
  console.log("✅ Specialists created");

  // 4. Create Parent & Individual Subscription
  const parent1 = await db.user.create({
    data: {
      name: "محمد بن علي",
      email: "mohammed.benali@gmail.com",
      password: defaultPasswordHash,
      role: "PARENT",
      phone: "0661 234 567",
      wilaya: "الجزائر",
      address: "حي السعادة، الأبيار، الجزائر العاصمة",
    },
  });

  await db.individualSubscription.create({
    data: {
      parentId: parent1.id,
      price: 800,
      startDate: new Date("2026-01-01"),
      endDate: new Date("2026-12-31"),
      status: "ACTIVE",
    },
  });

  const parent2 = await db.user.create({
    data: {
      name: "كمال زروقي",
      email: "kamal.zerrouki@gmail.com",
      password: defaultPasswordHash,
      role: "PARENT",
      phone: "0555 876 543",
      wilaya: "وهران",
    },
  });
  console.log("✅ Parents created");

  // 5. Create Children
  const child1 = await db.child.create({
    data: {
      id: "child-001",
      name: "آدم بن علي",
      birthDate: new Date("2019-03-15"),
      autismLevel: "MOYEN",
      pinCode: defaultPinHash, // 1234
      avatarColor: "#E97F6B",
      avatarInitial: "آ",
      parentId: parent1.id,
      specialistId: spec1.id,
    },
  });

  const child2 = await db.child.create({
    data: {
      id: "child-002",
      name: "لينا بن علي",
      birthDate: new Date("2017-07-22"),
      autismLevel: "LEGER",
      pinCode: pin5678Hash, // 5678
      avatarColor: "#2E8B7E",
      avatarInitial: "ل",
      parentId: parent1.id,
      specialistId: spec2.id,
    },
  });

  const child3 = await db.child.create({
    data: {
      id: "child-003",
      name: "سهام زروقي",
      birthDate: new Date("2018-11-10"),
      autismLevel: "MOYEN",
      pinCode: defaultPinHash,
      avatarColor: "#F5B942",
      avatarInitial: "س",
      parentId: parent2.id,
      specialistId: spec1.id,
    },
  });
  console.log("✅ Children created");

  // 6. Reports
  await db.report.createMany({
    data: [
      {
        childId: child1.id,
        authorId: parent1.id,
        mood: 4,
        sleepHours: 8,
        tantrums: 1,
        newWords: JSON.stringify(["شكراً", "ماء"]),
        exercises: JSON.stringify(["تمرين التنفس", "تمرين التواصل البصري"]),
        notes: "آدم كان في مزاج جيد اليوم. تناول إفطاره كاملاً.",
        type: "DAILY",
      },
      {
        childId: child1.id,
        authorId: spec1.id,
        notes: "[الحالة العامة]: جيد\n[ملاحظات التواصل]: تحسن ملحوظ في مهارات التواصل اللفظي والنطق المباشر.\n[التفاعل الاجتماعي]: يتفاعل بشكل ممتاز مع الأقران في الجلسة الجماعية.\n[السلوك]: انخفاض نوبات الغضب واستجابة سريعة للتعليمات.\n[ملخص التقدم]: استجابة ممتازة لجلسات التخاطب والتواصل البصري.\n[التوصيات]: الاستمرار في التمارين المنزلية اليومية ومتابعة الخطة العلاجية.",
        type: "CLINICAL",
      },
      {
        childId: child1.id,
        authorId: spec1.id,
        notes: "[الحالة العامة]: ممتاز\n[ملاحظات التواصل]: اكتساب 5 كلمات جديدة وتكرار الجمل البسيطة.\n[ملخص التقدم]: إنجاز أهداف التقييم السلوكي لشهر جويلية بنجاح.\n[التوصيات]: الانتقال للمرحلة الثانية من برنامج التواصل البديل (PECS).",
        type: "MONTHLY",
      },
      {
        childId: child2.id,
        authorId: spec2.id,
        notes: "[الحالة العامة]: جيد جداً\n[ملاحظات التواصل]: تطور ملموس في الفهم السمعي والتركيز مع الأخصائي النفسي.\n[السلوك]: تحسن الاستجابة عند التقييم النفسي والطلب المباشر.\n[التوصيات]: تعزيز الأنشطة التفاعلية في البيت وتكرار تمارين الانتباه.",
        type: "ASSESSMENT",
      },
    ],
  });

  // 7. Appointments
  await db.appointment.createMany({
    data: [
      {
        childId: child1.id,
        specialistId: spec1.id,
        date: new Date("2026-08-10"),
        time: "10:00",
        type: "SESSION",
        status: "CONFIRMED",
        location: "مركز الأمل — غرفة 3",
        notes: "جلسة نطق وتواصل",
      },
      {
        childId: child2.id,
        specialistId: spec2.id,
        date: new Date("2026-08-14"),
        time: "14:30",
        type: "SESSION",
        status: "PENDING",
        location: "مركز الأمل — غرفة 5",
      },
    ],
  });

  // 8. Assessments
  await db.assessment.create({
    data: {
      childId: child1.id,
      authorId: spec1.id,
      type: "MCHAT_R",
      answers: JSON.stringify({ q1: true, q2: false, q3: false, q4: true }),
      score: 12,
      maxScore: 20,
      result: "خطر متوسط",
      recommendation: "التحويل إلى تقييم تشخيصي شامل.",
    },
  });

  // 9. Messages
  await db.message.createMany({
    data: [
      {
        senderId: spec1.id,
        receiverId: parent1.id,
        childId: child1.id,
        content: "السلام عليكم، كيف كان آدم هذا الأسبوع؟",
        read: true,
      },
      {
        senderId: parent1.id,
        receiverId: spec1.id,
        childId: child1.id,
        content: "وعليكم السلام دكتورة، الحمد لله كان في تحسن، نطق بكلمتين جديدتين.",
        read: true,
      },
    ],
  });

  // 10. Complaints
  await db.complaint.create({
    data: {
      fromEmail: "mohammed.benali@gmail.com",
      fromName: "محمد بن علي",
      fromRole: "ولي أمر",
      subject: "مشكلة في الوصول إلى الملف الصحي",
      message: "منذ يومين يظهر خطأ عند فتح تقارير التقييم.",
      priority: "HIGH",
      status: "OPEN",
    },
  });

  // 11. Game scores
  await db.gameScore.createMany({
    data: [
      { childId: child1.id, gameType: "COLORS", stars: 3 },
      { childId: child1.id, gameType: "SHAPES", stars: 2 },
    ],
  });

  console.log("🎉 Seed finished successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
