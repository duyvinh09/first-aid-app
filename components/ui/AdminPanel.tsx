"use client";

import React, { useEffect, useState } from "react";

type User = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "editor" | "viewer";
  active: boolean;
};

type LogLine = {
  id: string;
  time: string;
  level: "info" | "warn" | "error";
  message: string;
};

// --- Mock API helpers (thay sau bằng API thật) ---
const mockUsers: User[] = [
  { id: "1", name: "Tu Nguyen", email: "nguyenvantu@123", role: "admin", active: true },
  { id: "2", name: "Tuan Tran", email: "tuan@456", role: "editor", active: true },
  { id: "3", name: "Jack", email: "jack@789", role: "viewer", active: false },
];

async function fetchUsers(): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 250));
  return mockUsers;
}

async function saveUser(u: Partial<User> & { id?: string }): Promise<User> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    id: u.id ?? String(Math.random()),
    name: u.name ?? "(no name)",
    email: u.email ?? "",
    role: (u.role as any) ?? "viewer",
    active: u.active ?? true,
  } as User;
}

async function fetchLogs(): Promise<LogLine[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [
    { id: "L1", time: new Date().toISOString(), level: "info", message: "Server started" },
    { id: "L2", time: new Date().toISOString(), level: "warn", message: "High memory usage" },
  ];
}

// --- Admin Panel UI ---
export default function AdminPanel() {
  const [section, setSection] = useState<"dashboard" | "users" | "settings" | "logs">("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
    loadLogs();
  }, []);

  async function loadUsers() {
    setLoadingUsers(true);
    try {
      const u = await fetchUsers();
      setUsers(u);
    } finally {
      setLoadingUsers(false);
    }
  }

  async function loadLogs() {
    const l = await fetchLogs();
    setLogs(l);
  }

  async function handleAddUser() {
    setSaving(true);
    try {
      const newUser = await saveUser({ name: "New User", email: "new@example.com", role: "viewer" });
      setUsers((s) => [newUser, ...s]);
    } finally {
      setSaving(false);
    }
  }

  async function toggleEmergency() {
    setEmergencyMode((s) => !s);
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Quản trị hệ thống</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <button
            onClick={() => setSection("dashboard")}
            className={`text-left p-2 rounded ${section === "dashboard" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            Tổng quan
          </button>
          <button
            onClick={() => setSection("users")}
            className={`text-left p-2 rounded ${section === "users" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            Người dùng
          </button>
          <button
            onClick={() => setSection("settings")}
            className={`text-left p-2 rounded ${section === "settings" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            Cấu hình hệ thống
          </button>
          <button
            onClick={() => setSection("logs")}
            className={`text-left p-2 rounded ${section === "logs" ? "bg-gray-100" : "hover:bg-gray-50"}`}
          >
            Nhật ký
          </button>

          <div className="mt-6">
            <button
              onClick={toggleEmergency}
              className="w-full px-3 py-2 rounded-md text-white font-semibold"
              style={{ background: emergencyMode ? "#DC2626" : "#059669" }}
            >
              {emergencyMode ? "EMERGENCY: ON" : "EMERGENCY: OFF"}
            </button>
          </div>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 p-6">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">
            {section === "dashboard"
              ? "Tổng quan"
              : section === "users"
              ? "Quản lý người dùng"
              : section === "settings"
              ? "Cấu hình hệ thống"
              : "Nhật ký hệ thống"}
          </h1>
          <div className="flex gap-2">
            <button onClick={loadUsers} className="px-3 py-2 bg-white border rounded">
              Refresh
            </button>
            <button onClick={() => loadLogs()} className="px-3 py-2 bg-white border rounded">
              Load Logs
            </button>
          </div>
        </header>

        <section>
          {section === "dashboard" && (
            <div className="grid grid-cols-3 gap-4">
              <Card title="Người dùng" value={`${users.length}`}>
                Số lượng người dùng hiện tại
              </Card>
              <Card title="Điểm cảnh báo" value={`${logs.filter((l) => l.level !== "info").length}`}>
                Số bản ghi cảnh báo / lỗi
              </Card>
              <Card title="Emergency" value={emergencyMode ? "ON" : "OFF"}>
                {emergencyMode ? "Chế độ khẩn cấp đang bật" : "Bình thường"}
              </Card>
            </div>
          )}

          {section === "users" && (
            <div>
              <div className="flex justify-between items-center mb-4">
                <div className="text-sm text-gray-600">
                  Quản lý danh sách người dùng — thêm, sửa, vô hiệu hóa.
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handleAddUser}
                    className="px-3 py-2 bg-blue-600 text-white rounded"
                  >
                    Thêm người dùng
                  </button>
                  <button onClick={loadUsers} className="px-3 py-2 border rounded">
                    Tải lại
                  </button>
                </div>
              </div>

              <div className="bg-white rounded border overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Tên</th>
                      <th className="p-3 text-left">Email</th>
                      <th className="p-3 text-left">Role</th>
                      <th className="p-3 text-left">Active</th>
                      <th className="p-3">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingUsers ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          Loading...
                        </td>
                      </tr>
                    ) : users.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-4 text-center">
                          Không có người dùng
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-t">
                          <td className="p-3">{u.name}</td>
                          <td className="p-3">{u.email}</td>
                          <td className="p-3">{u.role}</td>
                          <td className="p-3">{u.active ? "Yes" : "No"}</td>
                          <td className="p-3 flex gap-2 justify-center">
                            <button
                              onClick={() => editUserPrompt(u)}
                              className="px-2 py-1 border rounded"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => toggleActive(u.id)}
                              className="px-2 py-1 border rounded"
                            >
                              Toggle
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {section === "settings" && <SettingsPanel />}

          {section === "logs" && (
            <div>
              <div className="mb-3 text-sm text-gray-600">
                Nhật ký hệ thống (gần đây nhất lên đầu). Bạn có thể thêm chức năng lọc / export.
              </div>
              <div className="bg-white border rounded max-h-96 overflow-y-auto p-2 text-xs font-mono">
                {logs.map((l) => (
                  <div
                    key={l.id}
                    className={`p-2 mb-1 rounded ${
                      l.level === "error"
                        ? "bg-red-50"
                        : l.level === "warn"
                        ? "bg-yellow-50"
                        : "bg-gray-50"
                    }`}
                  >
                    <div className="text-[11px] text-gray-500">
                      {new Date(l.time).toLocaleString()}
                    </div>
                    <div className="font-medium">
                      [{l.level.toUpperCase()}] {l.message}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  );

  // --- small helpers ---
  function editUserPrompt(u: User) {
    const name = prompt("Tên:", u.name) ?? u.name;
    const email = prompt("Email:", u.email) ?? u.email;
    const role =
      (prompt("Role (admin/editor/viewer):", u.role) as "admin" | "viewer" | "viewer") ?? u.role;
    setSaving(true);
    saveUser({ id: u.id, name, email, role })
      .then((updated) => setUsers((s) => s.map((x) => (x.id === updated.id ? updated : x))))
      .finally(() => setSaving(false));
  }

  function toggleActive(id: string) {
    setUsers((s) => s.map((u) => (u.id === id ? { ...u, active: !u.active } : u)));
  }
}

function Card({ title, value, children }: { title: string; value: string; children?: React.ReactNode }) {
  return (
    <div className="bg-white border rounded p-4">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-2">{value}</div>
      {children && <div className="mt-2 text-sm text-gray-600">{children}</div>}
    </div>
  );
}

function SettingsPanel() {
  const [siteName, setSiteName] = useState("First Aid App");
  const [allowRegistrations, setAllowRegistrations] = useState(true);
  const [saving, setSaving] = useState(false);

  async function handleSave(e?: React.FormEvent) {
    e?.preventDefault();
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    alert("Saved settings (replace alert with better UI)");
  }

  return (
    <form onSubmit={handleSave} className="bg-white p-4 border rounded max-w-2xl">
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Tên ứng dụng</label>
        <input
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          className="w-full border rounded px-3 py-2"
        />
      </div>

      <div className="mb-4 flex items-center gap-3">
        <input
          id="reg"
          type="checkbox"
          checked={allowRegistrations}
          onChange={(e) => setAllowRegistrations(e.target.checked)}
        />
        <label htmlFor="reg" className="text-sm">
          Cho phép đăng ký người dùng mới
        </label>
      </div>

      <div className="flex gap-2">
        <button disabled={saving} type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
          Lưu
        </button>
        <button
          type="button"
          onClick={() => {
            setSiteName("First Aid App");
            setAllowRegistrations(true);
          }}
          className="px-4 py-2 border rounded"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
