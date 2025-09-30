"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthButtons from "@/components/AuthButtons"; // nút Đăng nhập/Đăng ký

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  function handleLogout() {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  }

  return (
    <nav className="flex justify-between items-center px-6 py-3 bg-blue-600 text-white">
      <h1
        className="text-lg font-bold cursor-pointer"
        onClick={() => router.push("/")}
      >
        Quick First Aid
      </h1>

      {/* Nếu chưa đăng nhập → hiện 2 nút Đăng nhập/Đăng ký */}
      {!user && <AuthButtons />}

      {/* Nếu đã đăng nhập → hiện Xin chào + Đăng xuất */}
      {user && (
        <div className="flex items-center gap-4">
          <span>
            Xin chào,{" "}
            <strong>
              {user.role === "admin" ? "Quản trị viên" : user.email}
            </strong>
          </span>

          {/* Nếu là admin → thêm nút đến /admin */}
          {user.role === "admin" && (
            <button
              onClick={() => router.push("/admin")}
              className="px-4 py-2 bg-yellow-500 rounded-full hover:bg-yellow-600 transition"
            >
              Quản trị
            </button>
          )}

          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 rounded-full hover:bg-red-700 transition"
          >
            Đăng xuất
          </button>
        </div>
      )}
    </nav>
  );
}
