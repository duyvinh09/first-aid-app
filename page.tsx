"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    if (password !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp");
      return;
    }

    // Lấy danh sách user đã có trong localStorage
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // Check trùng email
    const exists = users.find((u: any) => u.email === email);
    if (exists) {
      setError("Email đã tồn tại, vui lòng đăng nhập");
      return;
    }

    // Thêm user mới
    const newUser = { email, password, role: "user" };
    users.push(newUser);
    localStorage.setItem("users", JSON.stringify(users));

    setSuccess("Đăng ký thành công! Bạn có thể đăng nhập ngay.");
    setError("");

    // Sau 1s chuyển qua login
    setTimeout(() => {
      router.push("/login");
    }, 1000);
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleRegister}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Đăng ký</h1>

        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-500 text-sm">{success}</p>}

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

        <div>
          <label className="block text-sm mb-1">Nhập lại mật khẩu</label>
          <input
            type="password"
            className="w-full border px-3 py-2 rounded"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Đăng ký
        </button>
      </form>
    </div>
  );
}
