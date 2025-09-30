"use client";

import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex justify-center mt-6">
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-2 bg-blue-600 text-white rounded-full transition hover:bg-blue-700"
      >
        Đăng nhập quản trị
      </button>
    </div>
  );
}
