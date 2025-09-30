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

type DocumentItem = {
  id: string;
  title: string;
  description: string;
  priority: "High" | "Medium" | "Low";
};

// --- Mock API helpers (thay sau bằng API thật) ---
const mockUsers: User[] = [
  { id: "1", name: "Tu Nguyen", email: "admin@example.com", role: "admin", active: true },
];

async function fetchUsers(): Promise<User[]> {
  await new Promise((r) => setTimeout(r, 250));
  return mockUsers;
}

async function fetchLogs(): Promise<LogLine[]> {
  await new Promise((r) => setTimeout(r, 150));
  return [];
}

// --- Card component ---
function Card({
  title,
  value,
  children,
}: {
  title: string;
  value: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <p className="text-2xl font-bold text-blue-600">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{children}</p>
    </div>
  );
}

// --- Admin Panel UI ---
export default function AdminPanel() {
  const [section, setSection] = useState<
    "dashboard" | "users" | "settings" | "logs" | "documents"
  >("dashboard");
  const [users, setUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [logs, setLogs] = useState<LogLine[]>([]);
  const [emergencyMode, setEmergencyMode] = useState(false);
  const [loginCount, setLoginCount] = useState(0);
  const [siteName, setSiteName] = useState("FIRSTAIDNOW");

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<User>({
    id: "",
    name: "",
    email: "",
    role: "viewer",
    active: true,
  });

  // --- Documents ---
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);
  const [newDoc, setNewDoc] = useState<DocumentItem>({
    id: "",
    title: "",
    description: "",
    priority: "Medium",
  });

  useEffect(() => {
    loadUsers();
    loadLogs();
    loadDocuments();

    // Đếm số lần đăng nhập
    const count = parseInt(localStorage.getItem("loginCount") || "0") + 1;
    setLoginCount(count);
    localStorage.setItem("loginCount", count.toString());

    // Lưu log về thiết bị đăng nhập
    const ua = navigator.userAgent;
    const loginLog: LogLine = {
      id: crypto.randomUUID(),
      time: new Date().toISOString(),
      level: "info",
      message: `Đăng nhập từ thiết bị: ${ua}`,
    };
    try {
      const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]") as LogLine[];
      storedLogs.push(loginLog);
      localStorage.setItem("logs", JSON.stringify(storedLogs));
    } catch (e) {
      console.error("Lỗi parse logs", e);
      localStorage.setItem("logs", JSON.stringify([loginLog]));
    }
    loadLogs();

    const savedName = localStorage.getItem("siteName");
    if (savedName) setSiteName(savedName);
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
    try {
      const storedLogs = JSON.parse(localStorage.getItem("logs") || "[]") as LogLine[];
      setLogs(storedLogs);
    } catch (e) {
      console.error("Lỗi load logs", e);
      setLogs([]);
    }
  }

  function loadDocuments() {
    try {
      const storedDocs = JSON.parse(localStorage.getItem("documents") || "[]") as DocumentItem[];
      setDocuments(storedDocs);
    } catch {
      setDocuments([]);
    }
  }

  function saveDocuments(docs: DocumentItem[]) {
    setDocuments(docs);
    localStorage.setItem("documents", JSON.stringify(docs));
  }

  function toggleEmergency() {
    setEmergencyMode((s) => !s);
  }

  function handleSiteNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newName = e.target.value;
    setSiteName(newName);
    localStorage.setItem("siteName", newName);
  }

  function handleAddUser() {
    const id = crypto.randomUUID();
    const userToAdd = { ...newUser, id };
    setUsers((prev) => [...prev, userToAdd]);
    setNewUser({ id: "", name: "", email: "", role: "viewer", active: true });
  }

  function handleUpdateUser(updated: User) {
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(null);
  }

  function handleDeleteUser(id: string) {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  }

  // --- Document handlers ---
  function handleAddDoc() {
    const id = crypto.randomUUID();
    const docToAdd = { ...newDoc, id };
    const updated = [...documents, docToAdd];
    saveDocuments(updated);
    setNewDoc({ id: "", title: "", description: "", priority: "Medium" });
  }

  function handleUpdateDoc(updated: DocumentItem) {
    const docs = documents.map((d) => (d.id === updated.id ? updated : d));
    saveDocuments(docs);
    setEditingDoc(null);
  }

  function handleDeleteDoc(id: string) {
    saveDocuments(documents.filter((d) => d.id !== id));
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-semibold mb-4">Quản trị hệ thống</h2>
        <nav className="flex flex-col gap-2 text-sm">
          <button onClick={() => setSection("dashboard")} className={`text-left p-2 rounded ${section === "dashboard" ? "bg-gray-100" : "hover:bg-gray-50"}`}>Tổng quan</button>
          <button onClick={() => setSection("users")} className={`text-left p-2 rounded ${section === "users" ? "bg-gray-100" : "hover:bg-gray-50"}`}>Người dùng</button>
          <button onClick={() => setSection("documents")} className={`text-left p-2 rounded ${section === "documents" ? "bg-gray-100" : "hover:bg-gray-50"}`}>Tài liệu</button>
          <button onClick={() => setSection("settings")} className={`text-left p-2 rounded ${section === "settings" ? "bg-gray-100" : "hover:bg-gray-50"}`}>Cấu hình hệ thống</button>
          <button onClick={() => setSection("logs")} className={`text-left p-2 rounded ${section === "logs" ? "bg-gray-100" : "hover:bg-gray-50"}`}>Nhật ký</button>
          <div className="mt-6">
            <button onClick={toggleEmergency} className="w-full px-3 py-2 rounded-md text-white font-semibold" style={{ background: emergencyMode ? "#DC2626" : "#059669" }}>
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
              : section === "documents"
              ? "Quản lý tài liệu"
              : section === "settings"
              ? "Cấu hình hệ thống"
              : "Nhật ký hệ thống"}
          </h1>
        </header>

        <section>
          {/* Dashboard */}
          {section === "dashboard" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <Card title="Người dùng" value={`${users.length}`}>Số lượng người dùng hiện tại</Card>
              <Card title="Tài liệu" value={`${documents.length}`}>Số lượng tài liệu</Card>
              <Card title="Lượt đăng nhập" value={`${loginCount}`}>Số lần người dùng đã đăng nhập vào hệ thống</Card>
              <Card title="Emergency" value={emergencyMode ? "ON" : "OFF"}>{emergencyMode ? "Chế độ khẩn cấp đang bật" : "Bình thường"}</Card>
            </div>
          )}

          {/* Documents */}
          {section === "documents" && (
            <div className="space-y-6">
              {/* Form thêm tài liệu */}
              <div className="p-4 bg-gray-50 rounded">
                <h3 className="font-semibold mb-2">Thêm tài liệu mới</h3>
                <div className="grid grid-cols-2 gap-2">
                  <input type="text" placeholder="Tiêu đề" value={newDoc.title} onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })} className="border px-2 py-1 rounded" />
                  <select value={newDoc.priority} onChange={(e) => setNewDoc({ ...newDoc, priority: e.target.value as DocumentItem["priority"] })} className="border px-2 py-1 rounded">
                    <option value="High">High Priority</option>
                    <option value="Medium">Medium Priority</option>
                    <option value="Low">Low Priority</option>
                  </select>
                  <textarea placeholder="Mô tả" value={newDoc.description} onChange={(e) => setNewDoc({ ...newDoc, description: e.target.value })} className="border px-2 py-1 rounded col-span-2" />
                </div>
                <button onClick={handleAddDoc} className="mt-2 px-3 py-1 bg-blue-600 text-white rounded">Thêm tài liệu</button>
              </div>

              {/* Bảng tài liệu */}
              <div className="bg-white rounded border overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left">Tiêu đề</th>
                      <th className="p-3 text-left">Mô tả</th>
                      <th className="p-3 text-left">Mức ưu tiên</th>
                      <th className="p-3 text-left">Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {documents.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="p-4 text-center">Chưa có tài liệu</td>
                      </tr>
                    ) : (
                      documents.map((doc) => (
                        <tr key={doc.id} className="border-t">
                          <td className="p-3">{doc.title}</td>
                          <td className="p-3">{doc.description}</td>
                          <td className="p-3">{doc.priority}</td>
                          <td className="p-3 flex gap-2">
                            <button onClick={() => setEditingDoc(doc)} className="text-blue-600 hover:underline">Sửa</button>
                            <button onClick={() => handleDeleteDoc(doc.id)} className="text-red-600 hover:underline">Xoá</button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Form chỉnh sửa tài liệu */}
              {editingDoc && (
                <div className="mt-4 p-4 bg-yellow-50 rounded">
                  <h3 className="font-semibold mb-2">Chỉnh sửa tài liệu</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <input type="text" value={editingDoc.title} onChange={(e) => setEditingDoc({ ...editingDoc, title: e.target.value })} className="border px-2 py-1 rounded" />
                    <select value={editingDoc.priority} onChange={(e) => setEditingDoc({ ...editingDoc, priority: e.target.value as DocumentItem["priority"] })} className="border px-2 py-1 rounded">
                      <option value="High">High Priority</option>
                      <option value="Medium">Medium Priority</option>
                      <option value="Low">Low Priority</option>
                    </select>
                    <textarea value={editingDoc.description} onChange={(e) => setEditingDoc({ ...editingDoc, description: e.target.value })} className="border px-2 py-1 rounded col-span-2" />
                  </div>
                  <div className="mt-2 flex gap-2">
                    <button onClick={() => handleUpdateDoc(editingDoc)} className="px-3 py-1 bg-green-600 text-white rounded">Lưu</button>
                    <button onClick={() => setEditingDoc(null)} className="px-3 py-1 bg-gray-400 text-white rounded">Huỷ</button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Settings */}
          {section === "settings" && (
            <div className="text-sm text-gray-600 space-y-4">
              <div>
                <label className="block mb-1 font-medium">Tên ứng dụng:</label>
                <input type="text" value={siteName} onChange={handleSiteNameChange} className="border px-3 py-2 rounded w-full" />
              </div>
              <p>Đăng ký người dùng đã bị vô hiệu hóa.</p>
            </div>
          )}

          {/* Logs */}
          {section === "logs" && (
            <div className="bg-white rounded border p-4 space-y-2 text-sm">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className={`p-2 rounded border ${
                    log.level === "error"
                      ? "border-red-500"
                      : log.level === "warn"
                      ? "border-yellow-500"
                      : "border-gray-300"
                  }`}
                >
                  <strong>{log.level.toUpperCase()}</strong> — {log.time}
                  <div>{log.message}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
