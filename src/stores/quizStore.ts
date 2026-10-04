/** @format */
"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { QuizType, QuizPaginationApiResponse, QuizCategory, QuizQuestionType } from "@/types/quiz";

export interface QuestionOption {
  text: string;
  is_correct: boolean;
}

export interface QuestionItem {
  id: number;
  question: string;
  type: "multiple_choice" | "true_false";
  options: QuestionOption[];
  points: number;
  explanation?: string;
  order?: number;
}

export interface QuizItem {
  id: number;
  title: string;
  category: string;
  level: string;
  total_questions: number;
  duration_minutes: number;
  reward_coins: number;
  play_count: number;
  status: "published" | "draft";
  image?: string;
  description?: string;
  passing_score?: number;
  entry_fee?: number;
  slug?: string;
}

export interface CategoryItem {
  id: number;
  title: string;
  slug: string;
  icon: string;
  quizzes_count: number;
  status: "active" | "inactive";
}

export interface LevelItem {
  id: number;
  title: string;
  quizzes_count: number;
  min_score: number;
  bonus_multiplier: number;
}

const DEFAULT_CATEGORIES: CategoryItem[] = [
  { id: 1, title: "Geography", slug: "geography", icon: "ph-globe-hemisphere-west", quizzes_count: 24, status: "active" },
  { id: 2, title: "Science", slug: "science", icon: "ph-atom", quizzes_count: 18, status: "active" },
  { id: 3, title: "History", slug: "history", icon: "ph-hourglass", quizzes_count: 15, status: "active" },
  { id: 4, title: "Entertainment", slug: "entertainment", icon: "ph-film-strip", quizzes_count: 29, status: "active" },
  { id: 5, title: "Technology", slug: "technology", icon: "ph-cpu", quizzes_count: 22, status: "active" },
  { id: 6, title: "Sports", slug: "sports", icon: "ph-football", quizzes_count: 31, status: "active" },
];

const DEFAULT_LEVELS: LevelItem[] = [
  { id: 1, title: "Beginner", quizzes_count: 14, min_score: 50, bonus_multiplier: 1.0 },
  { id: 2, title: "Intermediate", quizzes_count: 28, min_score: 65, bonus_multiplier: 1.25 },
  { id: 3, title: "Advanced", quizzes_count: 19, min_score: 75, bonus_multiplier: 1.5 },
  { id: 4, title: "Master", quizzes_count: 8, min_score: 85, bonus_multiplier: 2.0 },
];

const DEFAULT_QUIZZES: QuizItem[] = [
  {
    id: 1,
    title: "World Capitals & Geography Blitz",
    category: "Geography",
    level: "Intermediate",
    total_questions: 15,
    duration_minutes: 5,
    reward_coins: 50,
    play_count: 1420,
    status: "published",
    image: "/quiz-banner.png",
    description: "Test your global geographical knowledge! Can you guess capitals, famous landmarks, and continental borders?",
    slug: "world-capitals-geography-blitz",
  },
  {
    id: 2,
    title: "Mastering Science & Physics",
    category: "Science",
    level: "Advanced",
    total_questions: 20,
    duration_minutes: 10,
    reward_coins: 100,
    play_count: 980,
    status: "published",
    image: "/quiz-banner.png",
    description: "Explore fundamental laws of the universe, quantum mechanics, and everyday physics principles.",
    slug: "mastering-science-physics",
  },
  {
    id: 3,
    title: "Ancient Civilizations & History",
    category: "History",
    level: "Beginner",
    total_questions: 10,
    duration_minutes: 4,
    reward_coins: 30,
    play_count: 2150,
    status: "published",
    image: "/quiz-banner.png",
    description: "Journey back in time to the Roman Empire, Ancient Egypt, Mesopotamia, and Ming Dynasty.",
    slug: "ancient-civilizations-history",
  },
  {
    id: 4,
    title: "Global Cinema & Academy Awards",
    category: "Entertainment",
    level: "Intermediate",
    total_questions: 12,
    duration_minutes: 6,
    reward_coins: 40,
    play_count: 730,
    status: "draft",
    image: "/quiz-banner.png",
    description: "From classic Hollywood to modern blockbusters, test your movie trivia IQ.",
    slug: "global-cinema-academy-awards",
  },
  {
    id: 5,
    title: "Tech Giants & Computer Science",
    category: "Technology",
    level: "Advanced",
    total_questions: 25,
    duration_minutes: 12,
    reward_coins: 150,
    play_count: 1890,
    status: "published",
    image: "/quiz-banner.png",
    description: "Algorithms, silicon pioneers, AI breakthroughs, and legendary software architectures.",
    slug: "tech-giants-computer-science",
  },
  {
    id: 6,
    title: "Premier League & Football Trivia",
    category: "Sports",
    level: "Beginner",
    total_questions: 15,
    duration_minutes: 5,
    reward_coins: 45,
    play_count: 3100,
    status: "published",
    image: "/quiz-banner.png",
    description: "Golden boot winners, historic comebacks, and legendary clubs across the football world.",
    slug: "premier-league-football-trivia",
  },
];

const DEFAULT_QUESTIONS: Record<number, QuestionItem[]> = {
  1: [
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
  ],
  2: [
    {
      id: 101,
      question: "What is the speed of light in vacuum approximately?",
      type: "multiple_choice",
      options: [
        { text: "300,000 km/s", is_correct: true },
        { text: "150,000 km/s", is_correct: false },
        { text: "500,000 km/s", is_correct: false },
        { text: "1,000,000 km/s", is_correct: false },
      ],
      points: 10,
      explanation: "Light travels at roughly 299,792 km per second.",
    },
  ],
  3: [
    {
      id: 201,
      question: "In which year did the Western Roman Empire fall?",
      type: "multiple_choice",
      options: [
        { text: "476 AD", is_correct: true },
        { text: "1453 AD", is_correct: false },
        { text: "312 AD", is_correct: false },
        { text: "800 AD", is_correct: false },
      ],
      points: 10,
      explanation: "Romulus Augustulus was deposed by Odoacer in 476 AD.",
    },
  ],
};

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

interface QuizStoreState {
  quizzes: QuizItem[];
  categories: CategoryItem[];
  levels: LevelItem[];
  questions: Record<number, QuestionItem[]>;

  // Quiz actions
  addQuiz: (quiz: Omit<QuizItem, "id"> & { id?: number }) => QuizItem;
  updateQuiz: (id: number, data: Partial<QuizItem>) => void;
  deleteQuiz: (id: number) => void;
  toggleQuizStatus: (id: number) => void;
  setQuizzes: (quizzes: QuizItem[]) => void;

  // Category actions
  addCategory: (cat: Omit<CategoryItem, "id"> & { id?: number }) => CategoryItem;
  updateCategory: (id: number, data: Partial<CategoryItem>) => void;
  deleteCategory: (id: number) => void;

  // Level actions
  addLevel: (lvl: Omit<LevelItem, "id"> & { id?: number }) => LevelItem;
  updateLevel: (id: number, data: Partial<LevelItem>) => void;
  deleteLevel: (id: number) => void;

  // Questions actions
  getQuestionsForQuiz: (quizId: number) => QuestionItem[];
  addQuestion: (quizId: number, question: Omit<QuestionItem, "id"> & { id?: number }) => QuestionItem;
  updateQuestion: (quizId: number, questionId: number, data: Partial<QuestionItem>) => void;
  deleteQuestion: (quizId: number, questionId: number) => void;

  // Frontend helpers
  getFrontendQuizzes: (params?: { page?: number; per_page?: number; search?: string; category?: string }) => QuizPaginationApiResponse;
  getFrontendQuizDetails: (slugOrId: string | number) => QuizType | undefined;
  getFrontendQuizQuestions: (slugOrId: string | number) => QuizQuestionType[];
}

export const useQuizStore = create<QuizStoreState>()(
  persist(
    (set, get) => ({
      quizzes: DEFAULT_QUIZZES,
      categories: DEFAULT_CATEGORIES,
      levels: DEFAULT_LEVELS,
      questions: DEFAULT_QUESTIONS,

      addQuiz: (quizData) => {
        const id = quizData.id || Date.now();
        const slug = quizData.slug || generateSlug(quizData.title);
        const newQuiz: QuizItem = {
          ...quizData,
          id,
          slug,
          total_questions: quizData.total_questions ?? 0,
          duration_minutes: quizData.duration_minutes ?? 5,
          reward_coins: quizData.reward_coins ?? 50,
          play_count: quizData.play_count ?? 0,
          status: quizData.status ?? "published",
        };
        set((state) => ({
          quizzes: [newQuiz, ...state.quizzes],
        }));
        return newQuiz;
      },

      updateQuiz: (id, data) => {
        set((state) => ({
          quizzes: state.quizzes.map((q) => {
            if (q.id === id) {
              const updated = { ...q, ...data };
              if (data.title && !data.slug) {
                updated.slug = generateSlug(data.title);
              }
              return updated;
            }
            return q;
          }),
        }));
      },

      deleteQuiz: (id) => {
        set((state) => {
          const newQuestions = { ...state.questions };
          delete newQuestions[id];
          return {
            quizzes: state.quizzes.filter((q) => q.id !== id),
            questions: newQuestions,
          };
        });
      },

      toggleQuizStatus: (id) => {
        set((state) => ({
          quizzes: state.quizzes.map((q) =>
            q.id === id
              ? { ...q, status: q.status === "published" ? "draft" : "published" }
              : q
          ),
        }));
      },

      setQuizzes: (quizzes) => set({ quizzes }),

      addCategory: (catData) => {
        const id = catData.id || Date.now();
        const slug = catData.slug || generateSlug(catData.title);
        const newCat: CategoryItem = {
          ...catData,
          id,
          slug,
          quizzes_count: catData.quizzes_count ?? 0,
          status: catData.status ?? "active",
        };
        set((state) => ({
          categories: [...state.categories, newCat],
        }));
        return newCat;
      },

      updateCategory: (id, data) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...data } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addLevel: (lvlData) => {
        const id = lvlData.id || Date.now();
        const newLvl: LevelItem = {
          ...lvlData,
          id,
          quizzes_count: lvlData.quizzes_count ?? 0,
          min_score: lvlData.min_score ?? 60,
          bonus_multiplier: lvlData.bonus_multiplier ?? 1.0,
        };
        set((state) => ({
          levels: [...state.levels, newLvl],
        }));
        return newLvl;
      },

      updateLevel: (id, data) => {
        set((state) => ({
          levels: state.levels.map((l) => (l.id === id ? { ...l, ...data } : l)),
        }));
      },

      deleteLevel: (id) => {
        set((state) => ({
          levels: state.levels.filter((l) => l.id !== id),
        }));
      },

      getQuestionsForQuiz: (quizId) => {
        return get().questions[quizId] || [];
      },

      addQuestion: (quizId, qData) => {
        const id = qData.id || Date.now();
        const newQ: QuestionItem = {
          ...qData,
          id,
          points: qData.points ?? 10,
          order: (get().questions[quizId]?.length || 0) + 1,
        };
        set((state) => {
          const list = state.questions[quizId] || [];
          const updatedList = [...list, newQ];
          return {
            questions: {
              ...state.questions,
              [quizId]: updatedList,
            },
            quizzes: state.quizzes.map((q) =>
              q.id === quizId ? { ...q, total_questions: updatedList.length } : q
            ),
          };
        });
        return newQ;
      },

      updateQuestion: (quizId, questionId, data) => {
        set((state) => {
          const list = state.questions[quizId] || [];
          return {
            questions: {
              ...state.questions,
              [quizId]: list.map((q) => (q.id === questionId ? { ...q, ...data } : q)),
            },
          };
        });
      },

      deleteQuestion: (quizId, questionId) => {
        set((state) => {
          const list = state.questions[quizId] || [];
          const updatedList = list.filter((q) => q.id !== questionId);
          return {
            questions: {
              ...state.questions,
              [quizId]: updatedList,
            },
            quizzes: state.quizzes.map((q) =>
              q.id === quizId ? { ...q, total_questions: updatedList.length } : q
            ),
          };
        });
      },

      getFrontendQuizzes: (params) => {
        const { quizzes } = get();
        const page = params?.page || 1;
        const per_page = params?.per_page || 9;
        const search = (params?.search || "").toLowerCase().trim();
        const category = (params?.category || "").toLowerCase().trim();

        // Only published quizzes show on the main site
        let filtered = quizzes.filter((q) => q.status === "published");

        if (category && category !== "all") {
          filtered = filtered.filter(
            (q) => q.category.toLowerCase() === category || generateSlug(q.category) === category
          );
        }

        if (search) {
          filtered = filtered.filter(
            (q) =>
              q.title.toLowerCase().includes(search) ||
              q.category.toLowerCase().includes(search) ||
              q.level.toLowerCase().includes(search)
          );
        }

        const total = filtered.length;
        const start = (page - 1) * per_page;
        const paginated = filtered.slice(start, start + per_page);

        const data: QuizType[] = paginated.map((q) => toFrontendQuiz(q, get().questions[q.id]?.length || q.total_questions));

        return {
          current_page: page,
          data,
          first_page_url: "",
          from: start + 1,
          last_page: Math.max(1, Math.ceil(total / per_page)),
          last_page_url: "",
          links: [],
          next_page_url: null,
          path: "",
          per_page,
          prev_page_url: null,
          to: Math.min(start + per_page, total),
          total,
        };
      },

      getFrontendQuizDetails: (slugOrId) => {
        const { quizzes, questions } = get();
        const quiz = quizzes.find(
          (q) =>
            q.id.toString() === slugOrId.toString() ||
            q.slug === slugOrId ||
            generateSlug(q.title) === slugOrId
        );
        if (!quiz) return undefined;
        return toFrontendQuiz(quiz, questions[quiz.id]?.length || quiz.total_questions);
      },

      getFrontendQuizQuestions: (slugOrId) => {
        const { quizzes, questions } = get();
        const quiz = quizzes.find(
          (q) =>
            q.id.toString() === slugOrId.toString() ||
            q.slug === slugOrId ||
            generateSlug(q.title) === slugOrId
        );
        if (!quiz) return [];
        const rawQs = questions[quiz.id] || [];
        return rawQs.map((q, idx) => ({
          id: q.id,
          quiz_id: quiz.id,
          question: q.question,
          type: q.type,
          points: q.points,
          explanation: q.explanation || "",
          order: idx + 1,
          time_limit: 30,
          answers: q.options.map((opt, optIdx) => ({
            id: optIdx + 1,
            question_id: q.id,
            answer: opt.text,
            is_correct: opt.is_correct ? 1 : 0,
          })),
        })) as any;
      },
    }),
    {
      name: "quizix-admin-quizzes",
    }
  )
);

export function toFrontendQuiz(q: QuizItem, questionsCount: number): QuizType {
  const slug = q.slug || generateSlug(q.title);
  const levelLower = (q.level || "intermediate").toLowerCase();

  return {
    id: q.id,
    image: q.image || "/quiz-banner.png",
    banner_image: q.image || "/quiz-banner.png",
    has_level: false,
    category_id: 1,
    quiz_level: levelLower,
    quiz_level_name: q.level || "Intermediate",
    is_free: (q.entry_fee ?? 0) <= 0,
    point_to_pass: q.passing_score ?? 70,
    status_name: q.status,
    status: q.status === "published" ? "active" : "inactive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    category: {
      id: 1,
      title: q.category,
      slug: generateSlug(q.category),
      icon: "ph-globe",
      created_at: "",
      updated_at: "",
    },
    translation: {
      id: q.id,
      quiz_id: q.id,
      locale: "en",
      title: q.title,
      tags: [q.category, q.level],
      slug: slug,
      description:
        q.description ||
        `Test your knowledge in ${q.title}! Earn up to ${q.reward_coins} coins and climb the global leaderboards.`,
    },
    taken_status: "pending",
    is_favorite: false,
    questions_count: questionsCount,
    questions_sum_time_limit: (q.duration_minutes || 5) * 60,
    user_quizzes_count: q.play_count || 0,
  };
}
