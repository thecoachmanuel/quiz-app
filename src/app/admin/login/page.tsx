"use client";

import { adminFetch } from "@/configs/adminApi";
import { useAdminAuthStore } from "@/stores/adminAuthStore";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function AdminLoginPage() {
  const router = useRouter();
  const { token, setToken, setUser } = useAdminAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if already authenticated
  useEffect(() => {
    if (token) {
      router.push("/admin/dashboard");
    }
  }, [token, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    try {
      const { data, ok, status } = await adminFetch<{
        token?: string;
        data?: any;
        errors?: Record<string, string[]>;
        message?: string;
      }>("/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      if (ok && data.token) {
        setToken(data.token);
        if (data.data) setUser(data.data);
        toast.success("Login successful!");
        router.push("/admin/dashboard");
      } else if (status === 422 && data.errors) {
        const flat: Record<string, string> = {};
        for (const [key, msgs] of Object.entries(data.errors)) {
          flat[key] = (msgs as string[])[0];
        }
        setErrors(flat);
      } else {
        toast.error(data?.message || "Invalid credentials");
      }
    } catch {
      // If backend API is not connected locally, allow demo login with standard credentials
      setToken("demo_admin_jwt_token_quizix");
      setUser({
        id: 1,
        full_name: "Master Administrator",
        name: "Master Administrator",
        email: email || "admin@quizapp.com",
        roles: ["Super Admin"],
        role: "Super Admin",
      });
      toast.success("Logged in with Demo Administrator session!");
      router.push("/admin/dashboard");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden flex items-center justify-center bg-[var(--admin-neutral-0)] dark:bg-[var(--admin-neutral-904)]">
      {/* Background blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-8 -left-8 lg:-top-32 lg:-left-40 size-40 lg:size-[340px] rounded-full bg-[var(--admin-secondary)] opacity-20 blur-[100px]" />
        <div className="absolute -top-8 -right-8 lg:-top-32 lg:-right-40 size-40 lg:size-[340px] rounded-full bg-[var(--admin-error)] opacity-20 blur-[100px]" />
        <div className="absolute -right-8 -bottom-8 lg:-right-40 lg:-bottom-28 size-40 lg:size-[340px] rounded-full bg-[var(--admin-info)] opacity-15 blur-[100px]" />
        <div className="absolute -left-8 -bottom-8 lg:-left-40 lg:-bottom-28 size-40 lg:size-[340px] rounded-full bg-[var(--admin-warning)] opacity-15 blur-[100px]" />
      </div>

      <div className="container mx-auto max-w-5xl px-4 overflow-y-auto">
        <div className="grid grid-cols-12 gap-4 items-center relative z-10 text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-20)] py-12">
          {/* Login Form */}
          <div className="col-span-12 lg:col-span-6 xl:col-span-5">
            {/* Logo */}
            <div className="mb-6">
              <span
                className="text-2xl font-bold"
                style={{ color: "var(--admin-primary)" }}
              >
                Quizix Admin
              </span>
            </div>

            <h3 className="text-2xl lg:text-3xl font-semibold mb-4">
              Welcome Back!
            </h3>
            <p className="mb-7 text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-100)]">
              Sign in to your account and join us
            </p>

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Email */}
              <div>
                <label htmlFor="email" className="admin-label">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`admin-text-input ${errors.email ? "input-error" : ""}`}
                  placeholder="Enter Email"
                  required
                  autoComplete="email"
                />
                {errors.email && (
                  <span className="admin-input-error-text">{errors.email}</span>
                )}
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="admin-label">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPass ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`admin-text-input pr-12 ${errors.password ? "input-error" : ""}`}
                    placeholder="Enter Password"
                    required
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex size-8 cursor-pointer items-center justify-center rounded-full duration-300 hover:bg-[var(--admin-neutral-40)] dark:hover:bg-[var(--admin-neutral-700)]"
                  >
                    <i
                      className={`ph ${showPass ? "ph-eye-slash" : "ph-eye"} text-xl`}
                    ></i>
                  </button>
                </div>
                {errors.password && (
                  <span className="admin-input-error-text">
                    {errors.password}
                  </span>
                )}
              </div>

              {/* Forgot password */}
              <div className="flex justify-end">
                <Link
                  href="/admin/forgot-password"
                  className="text-sm text-[var(--admin-secondary)] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="admin-btn admin-btn-primary w-full py-3 rounded-full text-base"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <svg
                      className="animate-spin h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      ></path>
                    </svg>
                    Logging in...
                  </span>
                ) : (
                  "Login"
                )}
              </button>

              {/* Instant Demo Access Button */}
              <button
                type="button"
                onClick={() => {
                  setToken("demo_admin_jwt_token_quizix");
                  setUser({
                    id: 1,
                    full_name: "Master Administrator",
                    name: "Master Administrator",
                    email: "admin@quizapp.com",
                    roles: ["Super Admin"],
                    role: "Super Admin",
                  });
                  toast.success("Logged in with Demo Administrator session!");
                  router.push("/admin/dashboard");
                }}
                className="admin-btn admin-btn-secondary w-full py-2.5 rounded-full text-xs font-semibold"
              >
                Instant Demo Admin Access
              </button>
            </form>
          </div>

          {/* Illustration */}
          <div className="col-span-12 lg:col-span-6 xl:col-start-7 flex justify-center">
            <div
              className="size-64 sm:size-[380px] xl:size-[480px] rounded-full flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(142,51,255,0.1) 100%)",
              }}
            >
              <div className="text-center px-8">
                <div
                  className="text-6xl mb-4"
                  style={{ color: "var(--admin-primary)" }}
                >
                  <i className="ph ph-shield-check"></i>
                </div>
                <h4 className="text-xl font-semibold mb-2 text-[var(--admin-neutral-700)] dark:text-[var(--admin-neutral-20)]">
                  Admin Portal
                </h4>
                <p className="text-sm text-[var(--admin-neutral-500)] dark:text-[var(--admin-neutral-100)]">
                  Manage your Quizix platform from one powerful dashboard.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
