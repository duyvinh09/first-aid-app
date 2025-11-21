"use client";

import { useRouter } from "next/navigation";

export default function AuthButtons() {
  const router = useRouter();

  return (
    <div className="flex gap-4 justify-center mt-6">
      <button
        onClick={() => router.push("/login")}
        className="px-6 py-2 bg-blue-500 text-white rounded-full transition hover:bg-blue-700"
      >
        Đăng nhập
      </button>
      <button
        onClick={() => router.push("/register")}
        className="px-6 py-2 bg-blue-500 text-white rounded-full transition hover:bg-blue-700"
      >
        Đăng ký
      </button>
    </div>
  );
}
