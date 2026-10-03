"use client";

import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminPageHeader from "@/components/admin/AdminPageHeader";
import Link from "next/link";
import { useState } from "react";
import toast from "react-hot-toast";

interface RoleItem {
  id: number;
  name: string;
  users_count: number;
  permissions: string[];
}

const INITIAL_ROLES: RoleItem[] = [
  {
    id: 1,
    name: "Super Admin",
    users_count: 1,
    permissions: [
      "Manage Users",
      "Manage Quizzes",
      "Manage Contests",
      "Manage Finance",
      "System Settings",
    ],
  },
  {
    id: 2,
    name: "Content Editor",
    users_count: 2,
    permissions: ["Manage Quizzes", "Manage Contests", "Manage Games"],
  },
  {
    id: 3,
    name: "Support Agent",
    users_count: 1,
    permissions: ["Manage Users", "Support Tickets", "Contacts"],
  },
];

const ALL_PERMISSIONS = [
  "Manage Users",
  "Send Notifications",
  "Manage Quizzes",
  "Manage Contests",
  "Manage Games",
  "Manage Finance & Withdrawals",
  "Support Tickets",
  "System Settings",
  "Manage Admin Staff",
];

export default function AdminRolesPage() {
  const [roles, setRoles] = useState<RoleItem[]>(INITIAL_ROLES);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<RoleItem | null>(null);
  const [name, setName] = useState("");
  const [selectedPerms, setSelectedPerms] = useState<string[]>([]);

  const openAdd = () => {
    setEditing(null);
    setName("");
    setSelectedPerms(["Manage Quizzes"]);
    setModalOpen(true);
  };

  const openEdit = (role: RoleItem) => {
    setEditing(role);
    setName(role.name);
    setSelectedPerms(role.permissions);
    setModalOpen(true);
  };

  const togglePerm = (perm: string) => {
    setSelectedPerms((prev) =>
      prev.includes(perm) ? prev.filter((p) => p !== perm) : [...prev, perm]
    );
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editing) {
      setRoles((prev) =>
        prev.map((r) =>
          r.id === editing.id
            ? { ...r, name, permissions: selectedPerms }
            : r
        )
      );
      toast.success("Role updated");
    } else {
      const newRole: RoleItem = {
        id: Date.now(),
        name,
        users_count: 0,
        permissions: selectedPerms,
      };
      setRoles((prev) => [...prev, newRole]);
      toast.success("Role created");
    }
    setModalOpen(false);
  };

  const columns = [
    {
      key: "name",
      label: "Role Name",
      render: (row: RoleItem) => (
        <span className="font-bold text-sm text-[var(--admin-neutral-900)] dark:text-white">
          {row.name}
        </span>
      ),
    },
    {
      key: "users",
      label: "Assigned Users",
      render: (row: RoleItem) => (
        <span className="text-xs text-[var(--admin-neutral-400)]">
          {row.users_count} Users
        </span>
      ),
    },
    {
      key: "permissions",
      label: "Granted Permissions",
      render: (row: RoleItem) => (
        <div className="flex flex-wrap gap-1 max-w-md">
          {row.permissions.map((p, i) => (
            <span
              key={i}
              className="text-[10px] px-2 py-0.5 rounded font-medium bg-[var(--admin-neutral-20)] dark:bg-[var(--admin-neutral-800)] text-[var(--admin-neutral-600)] dark:text-[var(--admin-neutral-300)]"
            >
              {p}
            </span>
          ))}
        </div>
      ),
    },
    {
      key: "actions",
      label: "Actions",
      render: (row: RoleItem) => (
        <div className="flex items-center gap-1.5 justify-end">
          <button
            type="button"
            onClick={() => openEdit(row)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-[var(--admin-neutral-400)] hover:text-blue-500 hover:bg-blue-500/10 transition text-base"
          >
            <i className="ph ph-note-pencil"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 text-xs text-[var(--admin-neutral-200)] mb-1">
        <Link
          href="/admin/admins"
          className="hover:text-[var(--admin-primary)] transition flex items-center gap-1"
        >
          <i className="ph ph-arrow-left"></i>
          Back to Admin Users
        </Link>
        <span>/</span>
        <span>Roles</span>
      </div>

      <AdminPageHeader
        title="Admin Roles & Permissions"
        buttons={[
          {
            label: "Create Role",
            onClick: openAdd,
            icon: "ph ph-plus-circle",
            variant: "primary",
          },
        ]}
      />

      <AdminDataTable columns={columns} data={roles} emptyText="No roles found" />

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
              {editing ? "Edit Role" : "Create New Role"}
            </h3>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="admin-form-label">Role Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Finance Manager"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="admin-form-control"
                />
              </div>

              <div>
                <label className="admin-form-label mb-2 block">
                  Permissions Granted
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {ALL_PERMISSIONS.map((perm) => (
                    <label
                      key={perm}
                      className="flex items-center gap-2 text-xs text-[var(--admin-neutral-600)] dark:text-[var(--admin-neutral-200)] cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={selectedPerms.includes(perm)}
                        onChange={() => togglePerm(perm)}
                        className="rounded text-[var(--admin-primary)]"
                      />
                      <span>{perm}</span>
                    </label>
                  ))}
                </div>
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
                  {editing ? "Save Changes" : "Create Role"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
