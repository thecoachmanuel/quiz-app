"use client";

import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface Gateway {
  id: string;
  name: string;
  logo: string;
  status: "active" | "inactive";
  test_mode: boolean;
  currencies: string[];
}

const INITIAL_GATEWAYS: Gateway[] = [
  {
    id: "stripe",
    name: "Stripe",
    logo: "ph-credit-card",
    status: "active",
    test_mode: true,
    currencies: ["USD", "EUR", "GBP", "CAD"],
  },
  {
    id: "paypal",
    name: "PayPal",
    logo: "ph-paypal-logo",
    status: "active",
    test_mode: true,
    currencies: ["USD", "EUR", "AUD"],
  },
  {
    id: "braintree",
    name: "Braintree",
    logo: "ph-bank",
    status: "active",
    test_mode: true,
    currencies: ["USD"],
  },
  {
    id: "razorpay",
    name: "Razorpay",
    logo: "ph-currency-inr",
    status: "inactive",
    test_mode: true,
    currencies: ["INR", "USD"],
  },
];

export default function PaymentGatewaysPage() {
  const [gateways, setGateways] = useState<Gateway[]>(INITIAL_GATEWAYS);
  const [editing, setEditing] = useState<Gateway | null>(null);

  const toggleStatus = (id: string) => {
    setGateways((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          const next = g.status === "active" ? "inactive" : "active";
          toast.success(`${g.name} is now ${next}`);
          return { ...g, status: next };
        }
        return g;
      })
    );
  };

  return (
    <div className="space-y-6">
      <AdminPageHeader title="Payment Gateways" />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {gateways.map((g) => (
          <div
            key={g.id}
            className="admin-white-box p-5 flex flex-col justify-between border border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] transition hover:shadow-xs"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] flex items-center justify-center text-2xl font-bold">
                  <i className={`ph ${g.logo}`}></i>
                </div>
                <button
                  type="button"
                  onClick={() => toggleStatus(g.id)}
                  className={`admin-badge cursor-pointer ${
                    g.status === "active"
                      ? "admin-badge-success"
                      : "admin-badge-warning"
                  }`}
                >
                  {g.status === "active" ? "Active" : "Inactive"}
                </button>
              </div>

              <h4 className="font-bold text-base text-[var(--admin-neutral-900)] dark:text-white">
                {g.name}
              </h4>
              <p className="text-xs text-[var(--admin-neutral-200)] mt-1">
                Supported: {g.currencies.join(", ")}
              </p>
            </div>

            <div className="mt-5 pt-4 border-t border-[var(--admin-neutral-30)] dark:border-[var(--admin-neutral-700)] flex items-center justify-between">
              <span className="text-[11px] font-semibold text-amber-500">
                {g.test_mode ? "Sandbox / Test" : "Live Production"}
              </span>
              <button
                type="button"
                onClick={() => setEditing(g)}
                className="admin-btn-secondary text-xs py-1.5 px-3 rounded-md font-medium"
              >
                Configure
              </button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setEditing(null)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              Configure {editing.name}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                toast.success(`${editing.name} credentials saved!`);
                setEditing(null);
              }}
              className="space-y-4"
            >
              <div>
                <label className="admin-form-label">Publishable / Client Key</label>
                <input
                  type="text"
                  required
                  placeholder="pk_test_..."
                  defaultValue="pk_test_51Mz007...EXAMPLE"
                  className="admin-form-control font-mono text-xs"
                />
              </div>

              <div>
                <label className="admin-form-label">Secret Key</label>
                <input
                  type="password"
                  required
                  placeholder="sk_test_..."
                  defaultValue="sk_test_51Mz007...EXAMPLE"
                  className="admin-form-control font-mono text-xs"
                />
              </div>

              <div>
                <label className="admin-form-label">Webhook Secret</label>
                <input
                  type="password"
                  placeholder="whsec_..."
                  defaultValue="whsec_12345...EXAMPLE"
                  className="admin-form-control font-mono text-xs"
                />
              </div>

              <div className="flex gap-2 justify-end pt-3">
                <button
                  type="button"
                  onClick={() => setEditing(null)}
                  className="admin-btn-secondary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn-primary text-xs py-2 px-4 rounded-lg font-medium"
                >
                  Save Gateway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
