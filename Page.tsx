  "use client";

  import { useState } from "react";
  import { useRouter } from "next/navigation";
  import md5 from "md5";
  import { ADMIN_ACCOUNT } from "@/lib/auth";// ✅ dùng để xác thực email nếu muốn


  export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    function handleLogin(e: React.FormEvent) {
      e.preventDefault();

      // Mã hóa mật khẩu người dùng nhập
      const hashed = md5(password);

      // So sánh với tài khoản admin đã cấu hình
      const isAdmin =
        email.trim().toLowerCase() === ADMIN_ACCOUNT.email.toLowerCase() &&
        hashed === ADMIN_ACCOUNT.password;

      if (isAdmin) {
        localStorage.setItem("user", JSON.stringify({ email, role: "admin" }));
        router.push("/admin");
      } else {
        setError("Sai email hoặc mật khẩu. Chỉ quản trị viên mới được phép truy cập.");
      }
    }

    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm space-y-4 mt-6"
        >
          <h1 className="text-xl font-bold text-center">Đăng nhập quản trị</h1>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full border px-3 py-2 rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Mật khẩu</label>
            <input
              type="password"
              className="w-full border px-3 py-2 rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
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
