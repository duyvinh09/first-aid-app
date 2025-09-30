"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthButtons from "@/components/AuthButtons"; // 📌 gọi 2 nút

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();

    // 🔑 Tài khoản admin cố định
    const adminEmail = "admin@example.com";
    const adminPassword = "123456";

    if (email === adminEmail && password === adminPassword) {
      localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
      router.push("/admin");
      return;
    }

    // 🔑 Check danh sách user thường trong localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const found = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (found) {
      localStorage.setItem("user", JSON.stringify({ email, role: "user" }));
      router.push("/");
    } else {
      setError("Sai email hoặc mật khẩu");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      {/* 📌 2 nút điều hướng */}
    
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4 mt-6"
      >
        <h1 className="text-xl font-bold text-center">Đăng nhập</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <div>
          <label className="block text-sm mb-1">Email</label>
          <input
            type="email"
            className="w-full border px-3 py-2 rounded"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Mật khẩu</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Đăng nhập
        </button>
      </form>
    </div>
  );
}
