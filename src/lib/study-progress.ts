import { firstLesson, type LessonQuestion } from "@/content/lessons/primeiros-passos";
import { RequestError } from "@/lib/http";

export const pilotLessonId = "primeiros-passos-v1";
export const studyQuestions: readonly LessonQuestion[] = [
  firstLesson.preparation.diagnostic,
  ...firstLesson.game.missions,
  ...firstLesson.retrievalQuestions,
  firstLesson.transferQuestion
];

export type StudyAnswer = {
  questionId: string;
  selectedOptionId: string;
  attempt: number;
  usedHint: boolean;
  consultedText: boolean;
};

export type StudySummary = {
  firstAttemptCorrect: number;
  totalQuestions: number;
  retryCorrect: number;
  assistedCorrect: number;
  guidedFirstAttemptCorrect: number;
  guidedTotal: number;
  retrievalFirstAttemptCorrect: number;
  retrievalTotal: number;
  transferCorrect: boolean;
  transferFirstAttemptCorrect: boolean;
};

export type SavedStudyProgress = StudySummary & {
  lessonId: typeof pilotLessonId;
  completed: boolean;
  completedAt: string | null;
  nextReviewAt: string | null;
  reviewDates: string[];
  updatedAt: string;
};

const questionById = new Map(studyQuestions.map((question) => [question.id, question]));

/** Same-session practice only: this summary does not measure delayed retention. */
export function calculateStudySummary(answers: readonly StudyAnswer[]): StudySummary {
  const scored = studyQuestions.filter((question) => question.kind !== "diagnostic");
  const correctAnswers = scored.map((question) => ({
    question,
    answer: answers.find((answer) => answer.questionId === question.id
      && answer.selectedOptionId === question.correctOptionId)
  })).filter(({ answer }) => Boolean(answer));
  const unaidedFirst = (answer: StudyAnswer | undefined) => Boolean(answer
    && answer.attempt === 1 && !answer.usedHint && !answer.consultedText);
  const transfer = correctAnswers.find(({ question }) => question.kind === "transfer");
  return {
    firstAttemptCorrect: correctAnswers.filter(({ answer }) => answer?.attempt === 1).length,
    totalQuestions: scored.length,
    retryCorrect: correctAnswers.filter(({ answer }) => answer && answer.attempt > 1).length,
    assistedCorrect: correctAnswers.filter(({ answer }) => answer && (answer.attempt > 1 || answer.usedHint || answer.consultedText)).length,
    guidedFirstAttemptCorrect: correctAnswers.filter(({ question, answer }) => question.kind === "guided" && answer?.attempt === 1).length,
    guidedTotal: scored.filter((question) => question.kind === "guided").length,
    retrievalFirstAttemptCorrect: correctAnswers.filter(({ question, answer }) => question.kind === "retrieval" && unaidedFirst(answer)).length,
    retrievalTotal: scored.filter((question) => question.kind === "retrieval").length,
    transferCorrect: Boolean(transfer),
    transferFirstAttemptCorrect: unaidedFirst(transfer?.answer)
  };
}

export function validateStudySubmission(body: Record<string, unknown>) {
  if (Object.keys(body).sort().join(",") !== "answers,completed,lessonId"
    || body.lessonId !== pilotLessonId || typeof body.completed !== "boolean"
    || !Array.isArray(body.answers) || body.answers.length > 55) {
    throw new RequestError(422, "O progresso deve identificar esta aula, suas respostas e sua conclusão.");
  }
  const answers: StudyAnswer[] = [];
  const previous = new Map<string, StudyAnswer>();
  for (const value of body.answers) {
    if (!value || typeof value !== "object" || Array.isArray(value)
      || Object.keys(value).sort().join(",") !== "attempt,consultedText,questionId,selectedOptionId,usedHint") {
      throw new RequestError(422, "Uma resposta contém campos inválidos.");
    }
    const answer = value as StudyAnswer;
    const question = questionById.get(answer.questionId);
    const prior = previous.get(answer.questionId);
    if (!question || !question.options.some((option) => option.id === answer.selectedOptionId)
      || !Number.isInteger(answer.attempt) || answer.attempt < 1 || answer.attempt > 5
      || typeof answer.usedHint !== "boolean" || typeof answer.consultedText !== "boolean"
      || answer.attempt !== (prior?.attempt ?? 0) + 1
      || prior?.selectedOptionId === question.correctOptionId
      || (prior?.usedHint && !answer.usedHint) || (prior?.consultedText && !answer.consultedText)) {
      throw new RequestError(422, "Confira a sequência de tentativas e as alternativas desta aula.");
    }
    const safe = { questionId: answer.questionId, selectedOptionId: answer.selectedOptionId,
      attempt: answer.attempt, usedHint: answer.usedHint, consultedText: answer.consultedText };
    answers.push(safe);
    previous.set(answer.questionId, safe);
  }
  if (body.completed && studyQuestions.some((question) => question.kind !== "diagnostic"
    && previous.get(question.id)?.selectedOptionId !== question.correctOptionId)) {
    throw new RequestError(422, "Conclua as seis missões, a retomada e a aplicação antes de encerrar a aula.");
  }
  return { lessonId: pilotLessonId, answers, completed: body.completed, summary: calculateStudySummary(answers) };
}
