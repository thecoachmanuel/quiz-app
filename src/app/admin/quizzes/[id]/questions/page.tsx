"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface QuestionOption {
  text: string;
  is_correct: boolean;
}

interface QuestionItem {
  id: number;
  question: string;
  type: "multiple_choice" | "true_false";
  options: QuestionOption[];
  points: number;
  explanation?: string;
}

const MOCK_QUESTIONS: QuestionItem[] = [
  {
    id: 1,
    question: "What is the capital city of Australia?",
    type: "multiple_choice",
    options: [
      { text: "Sydney", is_correct: false },
      { text: "Canberra", is_correct: true },
      { text: "Melbourne", is_correct: false },
      { text: "Brisbane", is_correct: false },
    ],
    points: 10,
    explanation: "Canberra was chosen as the federal capital in 1908.",
  },
  {
    id: 2,
    question: "The Amazon River is the longest river in the world.",
    type: "true_false",
    options: [
      { text: "True", is_correct: false },
      { text: "False", is_correct: true },
    ],
    points: 10,
    explanation: "The Nile River is traditionally considered the longest.",
  },
  {
    id: 3,
    question: "Which country has the most natural lakes in the world?",
    type: "multiple_choice",
    options: [
      { text: "Canada", is_correct: true },
      { text: "Russia", is_correct: false },
      { text: "United States", is_correct: false },
      { text: "Brazil", is_correct: false },
    ],
    points: 10,
    explanation: "Canada contains more than half of all natural lakes on Earth.",
  },
];

export default function AdminQuizQuestionsPage() {
  const params = useParams();
  const quizId = params?.id;

  const [questions, setQuestions] = useState<QuestionItem[]>(MOCK_QUESTIONS);
  const [modalOpen, setModalOpen] = useState(false);
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionItem | null>(null);

  // New/Edit manual question state
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newType, setNewType] = useState<"multiple_choice" | "true_false">(
    "multiple_choice"
  );
  const [options, setOptions] = useState<QuestionOption[]>([
    { text: "", is_correct: true },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
    { text: "", is_correct: false },
  ]);
  const [points, setPoints] = useState(10);
  const [explanation, setExplanation] = useState("");

  // AI Generator state
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiCount, setAiCount] = useState(5);
  const [aiDifficulty, setAiDifficulty] = useState("medium");
  const [generatingAi, setGeneratingAi] = useState(false);

  const openAddModal = () => {
    setEditingQuestion(null);
    setNewQuestionText("");
    setNewType("multiple_choice");
    setOptions([
      { text: "", is_correct: true },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
      { text: "", is_correct: false },
    ]);
    setPoints(10);
    setExplanation("");
    setModalOpen(true);
  };

  const openEditModal = (q: QuestionItem) => {
    setEditingQuestion(q);
    setNewQuestionText(q.question);
    setNewType(q.type);
    setOptions(q.options);
    setPoints(q.points);
    setExplanation(q.explanation || "");
    setModalOpen(true);
  };

  const handleSaveQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim()) {
      toast.error("Please enter a question");
      return;
    }
    const hasCorrect = options.some((o) => o.is_correct && o.text.trim());
    if (!hasCorrect) {
      toast.error("Please mark at least one correct non-empty option");
      return;
    }

    if (editingQuestion) {
      setQuestions((prev) =>
        prev.map((q) =>
          q.id === editingQuestion.id
            ? {
                ...q,
                question: newQuestionText,
                type: newType,
                options,
                points,
                explanation,
              }
            : q
        )
      );
      toast.success("Question updated successfully");
    } else {
      const newQ: QuestionItem = {
        id: Date.now(),
        question: newQuestionText,
        type: newType,
        options,
        points,
        explanation,
      };
      setQuestions((prev) => [...prev, newQ]);
      toast.success("Question added successfully");
    }
    setModalOpen(false);
  };

  const handleDelete = (id: number) => {
    if (!confirm("Delete this question?")) return;
    setQuestions((prev) => prev.filter((q) => q.id !== id));
    toast.success("Question deleted");
  };

  const handleAiGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratingAi(true);

    setTimeout(() => {
      const generated: QuestionItem[] = [
        {
          id: Date.now() + 1,
          question: `What is the highest mountain peak in Africa?`,
          type: "multiple_choice",
          options: [
            { text: "Mount Kilimanjaro", is_correct: true },
            { text: "Mount Kenya", is_correct: false },
            { text: "Mount Stanley", is_correct: false },
            { text: "Ras Dashen", is_correct: false },
          ],
          points: 10,
          explanation: "Mount Kilimanjaro stands at 5,895 meters above sea level.",
        },
        {
          id: Date.now() + 2,
          question: `Which country features the Maple leaf on its national flag?`,
          type: "multiple_choice",
          options: [
            { text: "Canada", is_correct: true },
            { text: "Norway", is_correct: false },
            { text: "Sweden", is_correct: false },
            { text: "New Zealand", is_correct: false },
          ],
          points: 10,
          explanation: "The stylized red maple leaf flag was adopted in 1965.",
        },
      ];

      setQuestions((prev) => [...prev, ...generated]);
      setGeneratingAi(false);
      setAiModalOpen(false);
      setAiPrompt("");
      toast.success(`Successfully generated and added ${generated.length} questions!`);
    }, 1200);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-[var(--admin-neutral-200)] mb-1">
        <Link
          href="/admin/quizzes"
          className="hover:text-[var(--admin-primary)] transition flex items-center gap-1"
        >
          <i className="ph ph-arrow-left"></i>
          Back to Quizzes
        </Link>
        <span>/</span>
        <span>Quiz #{quizId} Questions</span>
      </div>

      <AdminPageHeader
        title={`Questions List (${questions.length})`}
        buttons={[
          {
            label: "Generate with AI",
            onClick: () => setAiModalOpen(true),
            icon: "ph-fill ph-sparkle",
            variant: "secondary",
          },
          {
            label: "Add Question",
            onClick: openAddModal,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      {/* Questions Stack */}
      <div className="space-y-4">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="admin-white-box p-5 border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] transition hover:shadow-sm"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  #{idx + 1}
                </span>
                <div>
                  <h4 className="text-sm font-semibold text-[var(--admin-neutral-900)] dark:text-white">
                    {q.question}
                  </h4>
                  <div className="flex items-center gap-2 mt-1 text-xs text-[var(--admin-neutral-200)]">
                    <span className="capitalize">{q.type.replace("_", " ")}</span>
                    <span>•</span>
                    <span className="text-amber-500 font-medium">
                      {q.points} Points
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => openEditModal(q)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
                >
                  <i className="ph ph-note-pencil"></i>
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(q.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition text-base"
                >
                  <i className="ph ph-trash"></i>
                </button>
              </div>
            </div>

            {/* Options list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]">
              {q.options.map((opt, oIdx) => (
                <div
                  key={oIdx}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium border ${
                    opt.is_correct
                      ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/30 dark:text-emerald-400"
                      : "bg-[var(--admin-neutral-10)] dark:bg-[var(--admin-neutral-900)] text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-300)] border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)]"
                  }`}
                >
                  <i
                    className={`ph ${
                      opt.is_correct
                        ? "ph-check-circle-fill text-emerald-500 text-sm"
                        : "ph-circle text-[var(--admin-neutral-400)]"
                    }`}
                  ></i>
                  <span className="truncate">{opt.text}</span>
                  {opt.is_correct && (
                    <span className="ml-auto text-[10px] uppercase font-bold text-emerald-600">
                      Correct
                    </span>
                  )}
                </div>
              ))}
            </div>

            {q.explanation && (
              <p className="mt-3 text-xs text-[var(--admin-neutral-300)] italic">
                <strong>Explanation:</strong> {q.explanation}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Manual Question Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-xl p-6 relative max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              {editingQuestion ? "Edit Question" : "Add New Question"}
            </h3>

            <form onSubmit={handleSaveQuestion} className="space-y-4">
              <div>
                <label className="admin-form-label">Question Text *</label>
                <textarea
                  rows={2}
                  required
                  placeholder="e.g. Which planet is closest to the Sun?"
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  className="admin-form-control resize-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Question Type</label>
                  <select
                    value={newType}
                    onChange={(e) => {
                      const val = e.target.value as "multiple_choice" | "true_false";
                      setNewType(val);
                      if (val === "true_false") {
                        setOptions([
                          { text: "True", is_correct: true },
                          { text: "False", is_correct: false },
                        ]);
                      } else {
                        setOptions([
                          { text: "", is_correct: true },
                          { text: "", is_correct: false },
                          { text: "", is_correct: false },
                          { text: "", is_correct: false },
                        ]);
                      }
                    }}
                    className="admin-form-control"
                  >
                    <option value="multiple_choice">Multiple Choice (4 options)</option>
                    <option value="true_false">True / False</option>
                  </select>
                </div>

                <div>
                  <label className="admin-form-label">Points</label>
                  <input
                    type="number"
                    min={1}
                    value={points}
                    onChange={(e) => setPoints(parseInt(e.target.value) || 1)}
                    className="admin-form-control"
                  />
                </div>
              </div>

              {/* Options inputs */}
              <div>
                <label className="admin-form-label mb-2 block">
                  Options & Correct Answer (Select radio for correct answer)
                </label>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correct_option"
                        checked={opt.is_correct}
                        onChange={() => {
                          setOptions((prev) =>
                            prev.map((o, idx) => ({
                              ...o,
                              is_correct: idx === i,
                            }))
                          );
                        }}
                        className="w-4 h-4 text-[var(--admin-primary)] cursor-pointer"
                      />
                      <input
                        type="text"
                        required
                        placeholder={`Option ${i + 1}`}
                        value={opt.text}
                        onChange={(e) => {
                          const val = e.target.value;
                          setOptions((prev) =>
                            prev.map((o, idx) =>
                              idx === i ? { ...o, text: val } : o
                            )
                          );
                        }}
                        className="admin-form-control"
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="admin-form-label">Explanation (Optional)</label>
                <textarea
                  rows={2}
                  placeholder="Shown to the player after answering..."
                  value={explanation}
                  onChange={(e) => setExplanation(e.target.value)}
                  className="admin-form-control resize-none"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  {editingQuestion ? "Update Question" : "Add Question"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AI Generate Questions Modal */}
      {aiModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-lg p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setAiModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-8 h-8 rounded-lg bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-lg">
                <i className="ph-fill ph-sparkle"></i>
              </span>
              <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white">
                Generate Questions with AI
              </h3>
            </div>
            <p className="text-xs text-[var(--admin-neutral-200)] mb-5">
              Powered by OpenAI. Automatically generate trivia questions with 4 choices, correct answer, and explanation.
            </p>

            <form onSubmit={handleAiGenerate} className="space-y-4">
              <div>
                <label className="admin-form-label">Topic / Subject</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. World Capitals, Space Exploration, Premier League"
                  value={aiPrompt}
                  onChange={(e) => setAiPrompt(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="admin-form-label">Number of Questions</label>
                  <select
                    value={aiCount}
                    onChange={(e) => setAiCount(parseInt(e.target.value))}
                    className="admin-form-control"
                  >
                    <option value={2}>2 Questions</option>
                    <option value={5}>5 Questions</option>
                    <option value={10}>10 Questions</option>
                    <option value={15}>15 Questions</option>
                  </select>
                </div>

                <div>
                  <label className="admin-form-label">Difficulty</label>
                  <select
                    value={aiDifficulty}
                    onChange={(e) => setAiDifficulty(e.target.value)}
                    className="admin-form-control"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setAiModalOpen(false)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generatingAi}
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium inline-flex items-center gap-2"
                >
                  {generatingAi ? (
                    <>
                      <i className="ph ph-spinner animate-spin"></i>
                      Generating via AI...
                    </>
                  ) : (
                    <>
                      <i className="ph-fill ph-sparkle"></i>
                      Generate & Add
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
