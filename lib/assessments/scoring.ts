// lib/assessments/scoring.ts
// Calcul de score pour chaque outil d'évaluation du spectre autistique
// Basé sur les seuils publics et simplifiés de chaque outil

export interface ScoringResult {
  score: number;
  maxScore: number;
  result: string;
  recommendation: string;
}

// ─── M-CHAT-R (Modified Checklist for Autism in Toddlers, Revised) ────────────
// 20 questions oui/non. Score = nombre de réponses "à risque".
// Seuils : 0-2 = faible risque, 3-7 = risque moyen, 8-20 = risque élevé.

export function calculateMchatR(answers: Record<string, boolean>): ScoringResult {
  // Questions où "Non" = à risque (la majorité des questions)
  const noIsRisk = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20];
  // Questions où "Oui" = à risque
  const yesIsRisk: number[] = [11]; // Q11 : l'enfant marche-t-il sur la pointe des pieds?

  let score = 0;
  const maxScore = 20;

  for (let i = 1; i <= maxScore; i++) {
    const answer = answers[`q${i}`];
    if (yesIsRisk.includes(i)) {
      if (answer === true) score++;
    } else if (noIsRisk.includes(i)) {
      if (answer === false) score++;
    }
  }

  let result: string;
  let recommendation: string;

  if (score <= 2) {
    result = "خطر منخفض";
    recommendation = "متابعة نمو طبيعية. إعادة التقييم عند الحاجة.";
  } else if (score <= 7) {
    result = "خطر متوسط";
    recommendation = "التحويل إلى متخصص لإجراء تقييم تشخيصي شامل. المتابعة المكثفة ضرورية.";
  } else {
    result = "خطر مرتفع";
    recommendation = "التحويل الفوري لتقييم شامل من قِبل فريق متعدد التخصصات.";
  }

  return { score, maxScore, result, recommendation };
}

// ─── CARS-2 (Childhood Autism Rating Scale, 2nd Edition) ─────────────────────
// 15 بنود، كل بند يُسجَّل من 1 إلى 4 (بفارق 0.5).
// مجموع الدرجات : 15 إلى 60.
// < 30 = لا توحد, 30-36.5 = توحد خفيف إلى متوسط, ≥ 37 = توحد شديد.

export function calculateCars2(answers: Record<string, number>): ScoringResult {
  const maxScore = 60;
  let score = 0;

  for (let i = 1; i <= 15; i++) {
    const val = answers[`q${i}`] ?? 1;
    score += Math.min(Math.max(val, 1), 4);
  }

  let result: string;
  let recommendation: string;

  if (score < 30) {
    result = "لا يستوفي معايير التوحد";
    recommendation = "متابعة النمو الطبيعي. استشارة المتخصص إذا ظهرت مخاوف.";
  } else if (score <= 36.5) {
    result = "توحد خفيف إلى متوسط";
    recommendation = "برنامج تدخل مبكر مكثف: علاج نطق، تكامل حسي، دعم اجتماعي.";
  } else {
    result = "توحد شديد";
    recommendation = "تدخل مكثف وفوري مع فريق متعدد التخصصات. دعم أسري مكثف.";
  }

  return { score: Math.round(score), maxScore, result, recommendation };
}

// ─── VB-MAPP (Verbal Behavior Milestones Assessment and Placement Program) ────
// تقييم مهارات اللغة والتواصل.
// Score = مجموع النقاط عبر المراحل (0-170 تقريباً).
// مستوى 1 (0-10), مستوى 2 (11-40), مستوى 3 (41+).

export function calculateVbmapp(answers: Record<string, number>): ScoringResult {
  const maxScore = 170;
  let score = 0;

  for (const val of Object.values(answers)) {
    score += typeof val === "number" ? val : 0;
  }

  score = Math.min(score, maxScore);

  let result: string;
  let recommendation: string;

  if (score <= 10) {
    result = "المرحلة 1 — مستوى مبتدئ";
    recommendation = "برنامج تدريب مكثف على مهارات الطلب والتقليد الأساسية.";
  } else if (score <= 40) {
    result = "المرحلة 2 — مستوى متوسط";
    recommendation = "التركيز على تطوير الطلب والتسمية والاستجابة للأسئلة البسيطة.";
  } else {
    result = "المرحلة 3 — مستوى متقدم";
    recommendation = "دعم الدمج والمهارات الاجتماعية المعقدة والتواصل الوظيفي.";
  }

  return { score, maxScore, result, recommendation };
}

// ─── ADOS-2 (Autism Diagnostic Observation Schedule, 2nd Edition) ─────────────
// تقييم سلوكي مباشر. مجموع درجات كل بند (0-3).
// مجموع المقارن : < 7 = لا توحد, 7-9 = توحد خفيف, ≥ 10 = توحد.

export function calculateAdos2(answers: Record<string, number>): ScoringResult {
  const maxScore = 28;
  let score = 0;

  for (let i = 1; i <= 10; i++) {
    const val = answers[`q${i}`] ?? 0;
    score += Math.min(Math.max(val, 0), 3);
  }

  let result: string;
  let recommendation: string;

  if (score < 7) {
    result = "أقل من حد التوحد";
    recommendation = "متابعة دورية. إعادة التقييم عند ظهور مخاوف جديدة.";
  } else if (score <= 9) {
    result = "تشير إلى طيف التوحد";
    recommendation = "تقييم تشخيصي شامل. تدخل مبكر في التواصل الاجتماعي.";
  } else {
    result = "تشير بقوة إلى التوحد";
    recommendation = "تدخل فوري ومكثف. التشخيص الرسمي وخطة تعليمية فردية.";
  }

  return { score, maxScore, result, recommendation };
}

// ─── Dispatcher ──────────────────────────────────────────────────────────────

export function calculateScore(
  type: "MCHAT_R" | "ADOS2" | "CARS2" | "VB_MAPP",
  answers: Record<string, unknown>
): ScoringResult {
  switch (type) {
    case "MCHAT_R":
      return calculateMchatR(answers as Record<string, boolean>);
    case "CARS2":
      return calculateCars2(answers as Record<string, number>);
    case "VB_MAPP":
      return calculateVbmapp(answers as Record<string, number>);
    case "ADOS2":
      return calculateAdos2(answers as Record<string, number>);
    default:
      throw new Error(`Type d'évaluation non supporté: ${type}`);
  }
}
