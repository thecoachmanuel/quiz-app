"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader, { TabButton } from "@/components/admin/AdminPageHeader";
import { adminFetch } from "@/configs/adminApi";
import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface QuizItem {
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
}

const MOCK_QUIZZES: QuizItem[] = [
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
  },
];

export default function AdminQuizzesPage() {
  const [quizzes, setQuizzes] = useState<QuizItem[]>(MOCK_QUIZZES);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await adminFetch("/quizzes");
      if (res && res.data && Array.isArray(res.data)) {
        setQuizzes(res.data);
      }
    } catch {
      setQuizzes(MOCK_QUIZZES);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = (id: number) => {
    setQuizzes((prev) =>
      prev.map((q) => {
        if (q.id === id) {
          const next = q.status === "published" ? "draft" : "published";
          toast.success(
            `Quiz "${q.title}" ${next === "published" ? "published" : "set to draft"}`
          );
          return { ...q, status: next };
        }
        return q;
      })
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this quiz?")) return;
    setQuizzes((prev) => prev.filter((q) => q.id !== id));
    toast.success("Quiz deleted successfully");
  };

  const tabs: TabButton[] = [
    { label: "All Quizzes", key: "all", count: quizzes.length },
    {
      label: "Published",
      key: "published",
      count: quizzes.filter((q) => q.status === "published").length,
    },
    {
      label: "Draft",
      key: "draft",
      count: quizzes.filter((q) => q.status === "draft").length,
    },
  ];

  const filteredQuizzes = quizzes.filter((q) => {
    if (activeTab === "published" && q.status !== "published") return false;
    if (activeTab === "draft" && q.status !== "draft") return false;
    if (search.trim()) {
      const query = search.toLowerCase();
      return (
        q.title.toLowerCase().includes(query) ||
        q.category.toLowerCase().includes(query) ||
        q.level.toLowerCase().includes(query)
      );
    }
    return true;
  });

  const columns = [
    {
      key: "quiz",
      label: "Quiz",
      render: (row: QuizItem) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center font-bold text-base shrink-0">
            <i className="ph ph-question-mark"></i>
          </div>
          <div>
            <Link
              href={`/admin/quizzes/${row.id}/edit`}
              className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white hover:text-[var(--admin-primary)] transition line-clamp-1"
            >
              {row.title}
            </Link>
            <div className="flex items-center gap-2 mt-0.5 text-xs text-[var(--admin-neutral-200)]">
              <span>{row.category}</span>
              <span>•</span>
              <span className="capitalize">{row.level}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "questions",
      label: "Questions",
      render: (row: QuizItem) => (
        <Link
          href={`/admin/quizzes/${row.id}/questions`}
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/20 transition"
        >
          <i className="ph ph-list-dashes"></i>
          {row.total_questions} Questions
        </Link>
      ),
    },
    {
      key: "duration",
      label: "Duration",
      render: (row: QuizItem) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.duration_minutes} mins
        </span>
      ),
    },
    {
      key: "reward",
      label: "Reward Coins",
      render: (row: QuizItem) => (
        <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
          <i className="ph-fill ph-coins"></i>
          <span>{row.reward_coins}</span>
        </div>
      ),
    },
    {
      key: "played",
      label: "Plays",
      render: (row: QuizItem) => (
        <span className="text-xs font-medium text-[var(--admin-neutral-400)]">
          {row.play_count.toLocaleString()}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: QuizItem) => (
        <button
          type="button"
          onClick={() => toggleStatus(row.id)}
          className={`admin-badge cursor-pointer ${
            row.status === "published"
              ? "admin-badge-success"
              : "admin-badge-warning"
          }`}
        >
          {row.status === "published" ? "Published" : "Draft"}
        </button>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: QuizItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <Link
            href={`/admin/quizzes/${row.id}/questions`}
            title="Manage Questions"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-[var(--admin-primary)] hover:bg-[var(--admin-primary)]/10 transition text-base"
          >
            <i className="ph ph-list-numbers"></i>
          </Link>
          <Link
            href={`/admin/quizzes/${row.id}/edit`}
            title="Edit Quiz"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
          >
            <i className="ph ph-note-pencil"></i>
          </Link>
          <button
            type="button"
            title="Delete Quiz"
            onClick={() => handleDelete(row.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition text-base"
          >
            <i className="ph ph-trash"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Quizzes"
        tabButtons={tabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        search={search}
        onSearch={setSearch}
        searchPlaceholder="Search quizzes by title or category..."
        buttons={[
          {
            label: "Categories",
            href: "/admin/quizzes/categories",
            icon: "ph ph-folders",
            variant: "secondary",
          },
          {
            label: "Levels",
            href: "/admin/quizzes/levels",
            icon: "ph ph-gauge",
            variant: "secondary",
          },
          {
            label: "Create Quiz",
            href: "/admin/quizzes/create",
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable
        columns={columns}
        data={filteredQuizzes}
        loading={loading}
        emptyText="No quizzes found"
      />
    </div>
  );
}
