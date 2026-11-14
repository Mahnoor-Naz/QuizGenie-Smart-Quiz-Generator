// services/evaluationService.js
export function evaluateAnswers(questions, submittedAnswers) {
  // NAYA FIX: Backend par strict validation
  // Agar user ne saare answers nahi bheje, toh error throw karein
  if (submittedAnswers.length !== questions.length) {
    const err = new Error(`Incomplete answers. Expected ${questions.length}, got ${submittedAnswers.length}`);
    err.status = 400;
    throw err;
  }

  const map = new Map(
    submittedAnswers.map((a) => [Number(a.questionId), a.selectedIndex])
  );

  const results = questions.map((q) => {
    const selectedIndex = map.has(q.id) ? map.get(q.id) : null;
    return {
      questionId: q.id,
      text: q.text,
      options: q.options,
      selectedIndex,
      correctIndex: q.correctIndex,
      isCorrect: selectedIndex === q.correctIndex,
      explanation: q.explanation || "",
    };
  });

  const score = results.filter((r) => r.isCorrect).length;
  const total = results.length;
  const percentage = total === 0 ? 0 : Math.round((score / total) * 100);

  return { score, total, percentage, results };
}