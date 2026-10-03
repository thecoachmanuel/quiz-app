"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import { useState } from "react";
import toast from "react-hot-toast";

interface AdminStaff {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
  created_at: string;
}

const INITIAL_ADMINS: AdminStaff[] = [
  {
    id: 1,
    name: "Master Admin",
    email: "admin@softivus.com",
    role: "Super Admin",
    status: "active",
    created_at: "2024-01-01",
  },
  {
    id: 2,
    name: "Sarah Editor",
    email: "editor@softivus.com",
    role: "Content Editor",
    status: "active",
    created_at: "2024-01-15",
  },
  {
    id: 3,
    name: "Leo Support",
    email: "support@softivus.com",
    role: "Support Agent",
    status: "active",
    created_at: "2024-02-01",
  },
];

export default function AdminStaffPage() {
  const [admins, setAdmins] = useState<AdminStaff[]>(INITIAL_ADMINS);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminStaff | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Content Editor");

  const openAdd = () => {
    setEditing(null);
    setName("");
    setEmail("");
    setPassword("");
    setRole("Content Editor");
    setModalOpen(true);
  };

  const openEdit = (staff: AdminStaff) => {
    setEditing(staff);
    setName(staff.name);
    setEmail(staff.email);
    setPassword("");
    setRole(staff.role);
    setModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    if (editing) {
      setAdmins((prev) =>
        prev.map((a) =>
          a.id === editing.id ? { ...a, name, email, role } : a
        )
      );
      toast.success("Admin user updated");
    } else {
      const newAdmin: AdminStaff = {
        id: Date.now(),
        name,
        email,
        role,
        status: "active",
        created_at: new Date().toISOString().split("T")[0],
      };
      setAdmins((prev) => [...prev, newAdmin]);
      toast.success("Admin user added");
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: "name",
      label: "Name & Email",
      render: (row: AdminStaff) => (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[var(--admin-primary)]/10 text-[var(--admin-primary)] font-bold flex items-center justify-center text-xs uppercase">
            {row.name.substring(0, 2)}
          </div>
          <div>
            <span className="font-semibold text-sm text-[var(--admin-neutral-900)] dark:text-white">
              {row.name}
            </span>
            <p className="text-xs text-[var(--admin-neutral-200)]">{row.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      label: "Assigned Role",
      render: (row: AdminStaff) => (
        <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-[var(--admin-primary)]/10 text-[var(--admin-primary)]">
          {row.role}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (row: AdminStaff) => (
        <span
          className={`admin-badge ${
            row.status === "active"
              ? "admin-badge-success"
              : "admin-badge-warning"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "date",
      label: "Created",
      render: (row: AdminStaff) => (
        <span className="text-xs text-[var(--admin-neutral-200)]">
          {row.created_at}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: AdminStaff) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
          >
            <i className="ph ph-note-pencil"></i>
          </button>
          {row.id !== 1 && (
            <button
              type="button"
              onClick={() => {
                if (confirm("Delete this admin user?")) {
                  setAdmins((prev) => prev.filter((a) => a.id !== row.id));
                  toast.success("Admin user deleted");
                }
              }}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-red-500 hover:bg-red-500/10 transition text-base"
            >
              <i className="ph ph-trash"></i>
            </button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Admin Staff Users"
        buttons={[
          {
            label: "Roles & Permissions",
            href: "/admin/admins/roles",
            icon: "ph ph-shield-check",
            variant: "secondary",
          },
          {
            label: "Add Admin User",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={admins} emptyText="No staff found" />

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs">
          <div className="admin-white-box w-full max-w-md p-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-[var(--admin-neutral-400)] hover:text-red-500 transition text-xl"
            >
              <i className="ph ph-x"></i>
            </button>
            <h3 className="text-lg font-bold text-[var(--admin-neutral-900)] dark:text-white mb-4">
              {editing ? "Edit Admin Staff" : "Add Admin Staff"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. John Administrator"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="admin@quizix.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">
                  {editing ? "Password (Leave blank to keep current)" : "Password *"}
                </label>
                <input
                  type="password"
                  required={!editing}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="admin-form-control"
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Content Editor">Content Editor</option>
                  <option value="Moderator">Moderator</option>
                  <option value="Support Agent">Support Agent</option>
                </select>
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
                  {editing ? "Update User" : "Create User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
