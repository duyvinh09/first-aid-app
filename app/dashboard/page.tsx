"use client";

import MainNavigation from "@/components/main-navigation";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { useEffect, useState } from "react";

export default function DashboardPage() {
  const [documentViews, setDocumentViews] = useState(0);
  const [detailOpen, setDetailOpen] = useState(false);
  const [detailViews, setDetailViews] = useState<Record<string, number>>({});
  const [reportOpen, setReportOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);

  // Thống kê người dùng mẫu
  const userStats = {
    today: 12,
    thisMonth: 210,
    thisYear: 1850,
    online: 7,
    newUsers: 3,
    mostActiveHour: "20:00 - 21:00",
    returningUsers: 8,
  };

  // 10 ví dụ minh họa báo cáo
  const reportExamples = [
    { id: 1, user: "user01", content: "Báo cáo nội dung sai", date: "2025-11-18" },
    { id: 2, user: "user02", content: "Tài liệu thiếu hình ảnh", date: "2025-11-17" },
    { id: 3, user: "user03", content: "Lỗi hiển thị trên mobile", date: "2025-11-16" },
    { id: 4, user: "user04", content: "Thông tin chưa cập nhật", date: "2025-11-15" },
    { id: 5, user: "user05", content: "Báo cáo spam", date: "2025-11-14" },
    { id: 6, user: "user06", content: "Tài liệu khó hiểu", date: "2025-11-13" },
    { id: 7, user: "user07", content: "Thiếu hướng dẫn chi tiết", date: "2025-11-12" },
    { id: 8, user: "user08", content: "Báo cáo nội dung trùng lặp", date: "2025-11-11" },
    { id: 9, user: "user09", content: "Lỗi font chữ", date: "2025-11-10" },
    { id: 10, user: "user10", content: "Báo cáo sai chính tả", date: "2025-11-09" },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const key = 'totalDocumentViews';
      const count = Number(localStorage.getItem(key) || '0');
      setDocumentViews(count);
      // Lấy chi tiết từng loại tài liệu
      const detailKey = 'documentViewsDetail';
      const detailRaw = localStorage.getItem(detailKey);
      let detail: Record<string, number> = {};
      try {
        if (detailRaw) detail = JSON.parse(detailRaw);
      } catch {}
      setDetailViews(detail);
    }
  }, []);

  // Danh sách tài liệu mẫu (id, tên, màu)
  const documentTypes = [
    { id: "cpr", name: "CPR", color: "bg-blue-100", bar: "bg-blue-500", text: "text-blue-900", label: "text-blue-700" },
    { id: "burns", name: "Burns", color: "bg-orange-100", bar: "bg-orange-500", text: "text-orange-900", label: "text-orange-700" },
    { id: "bleeding", name: "Bleeding", color: "bg-red-100", bar: "bg-red-500", text: "text-red-900", label: "text-red-700" },
    { id: "choking", name: "Choking", color: "bg-yellow-100", bar: "bg-yellow-500", text: "text-yellow-900", label: "text-yellow-700" },
    { id: "fractures", name: "Fractures", color: "bg-green-100", bar: "bg-green-500", text: "text-green-900", label: "text-green-700" },
    { id: "fever", name: "Fever", color: "bg-purple-100", bar: "bg-purple-500", text: "text-purple-900", label: "text-purple-700" },
    { id: "poisoning", name: "Poisoning", color: "bg-pink-100", bar: "bg-pink-500", text: "text-pink-900", label: "text-pink-700" },
    { id: "cuts", name: "Cuts & Wounds", color: "bg-gray-100", bar: "bg-gray-500", text: "text-gray-900", label: "text-gray-700" },
    { id: "shock", name: "Shock", color: "bg-cyan-100", bar: "bg-cyan-500", text: "text-cyan-900", label: "text-cyan-700" },
    { id: "eye-injury", name: "Eye Injury", color: "bg-lime-100", bar: "bg-lime-500", text: "text-lime-900", label: "text-lime-700" },
    { id: "head-injury", name: "Head Injury", color: "bg-teal-100", bar: "bg-teal-500", text: "text-teal-900", label: "text-teal-700" },
    { id: "allergic-reaction", name: "Allergic Reaction", color: "bg-fuchsia-100", bar: "bg-fuchsia-500", text: "text-fuchsia-900", label: "text-fuchsia-700" },
  ];

  return (

    <div className="flex min-h-screen flex-col bg-background">
      <header
        className={`sticky top-0 z-[1000] border-b bg-background transition-all duration-200 ${detailOpen ? 'opacity-40 blur-sm pointer-events-none select-none' : ''}`}
      >
        <div className="container flex h-16 items-center px-4">
          <Link href="/" className="mr-2 rounded-full p-2 hover:bg-muted">
            <ArrowLeft className="h-5 w-5" />
            <span className="sr-only">Back</span>
          </Link>
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
      </header>
      <main className="flex-1">
        <section className="container px-4 py-6 max-w-6xl mx-auto">
          {/* User Statistics */}
          <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Người dùng */}
            <div
              className="rounded-lg border p-0 bg-white cursor-pointer hover:shadow-md transition"
              onClick={() => setUserOpen(true)}
            >
              <div className="h-2 w-full rounded-t-lg bg-blue-500" />
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2 text-blue-700">Người dùng</h2>
                <p className="text-3xl font-bold text-blue-900">1,234</p>
                <p className="text-sm text-blue-600">Tổng số người dùng</p>
                <p className="text-xs text-blue-500 mt-1">Nhấn vào để xem chi tiết</p>
              </div>
            </div>
            {/* Modal chi tiết người dùng */}
            {userOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-4 relative animate-fade-in flex flex-col items-center">
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setUserOpen(false)}
                    aria-label="Đóng"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-bold mb-4 text-center">Thống kê người dùng</h2>
                  <div className="w-full space-y-3">
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-gray-600">Số người sử dụng hôm nay</span>
                      <span className="font-bold text-blue-700">{userStats.today}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-gray-600">Số người sử dụng tháng này</span>
                      <span className="font-bold text-blue-700">{userStats.thisMonth}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-gray-600">Số người sử dụng năm nay</span>
                      <span className="font-bold text-blue-700">{userStats.thisYear}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-gray-600">Đang online</span>
                      <span className="font-bold text-green-600">{userStats.online}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-gray-600">Người dùng mới hôm nay</span>
                      <span className="font-bold text-purple-600">{userStats.newUsers}</span>
                    </div>
                    <div className="flex justify-between items-center border-b pb-2">
                      <span className="text-sm text-gray-600">Giờ hoạt động cao nhất</span>
                      <span className="font-bold text-orange-600">{userStats.mostActiveHour}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Người dùng quay lại hôm nay</span>
                      <span className="font-bold text-cyan-600">{userStats.returningUsers}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {/* Lượt xem tài liệu */}
              <div
                className="rounded-lg border p-0 bg-white cursor-pointer hover:shadow-md transition"
              onClick={() => setDetailOpen((v) => !v)}
            >
              <div className="h-2 w-full rounded-t-lg bg-green-500" />
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2 text-green-700">Lượt xem tài liệu</h2>
                <p className="text-3xl font-bold text-green-900">{documentViews}</p>
                <p className="text-sm text-green-600">Tổng lượt xem</p>
                <p className="text-xs text-green-500 mt-1">Nhấn vào để xem chi tiết</p>
              </div>
            </div>
                      {/* Modal chi tiết lượt xem tài liệu */}
                      {detailOpen && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-4 relative animate-fade-in flex flex-col items-center">
                            <button
                              className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                              onClick={() => setDetailOpen(false)}
                              aria-label="Đóng"
                            >
                              <X className="h-5 w-5" />
                            </button>
                            <h2 className="text-lg font-bold mb-4 text-center">Chi tiết lượt xem tài liệu</h2>
                            <div className="flex flex-row flex-wrap gap-3 w-full justify-center items-stretch">
                              {documentTypes.map((doc) => (
                                <div
                                  key={doc.id}
                                  className="rounded-lg border p-0 bg-white min-w-[120px] max-w-[140px] flex-1"
                                >
                                  <div className="h-2 w-full rounded-t-lg bg-gray-200" />
                                  <div className="p-4">
                                    <h2 className="text-base font-semibold mb-1 text-gray-700">{doc.name}</h2>
                                    <p className="text-2xl font-bold text-gray-900">{detailViews[doc.id] || 0}</p>
                                    <p className="text-xs text-gray-600">Lượt xem</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      )}
            {/* Báo cáo */}
            <div
              className="rounded-lg border p-0 bg-white cursor-pointer hover:shadow-md transition"
              onClick={() => setReportOpen(true)}
            >
              <div className="h-2 w-full rounded-t-lg bg-red-500" />
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-2 text-red-700">Báo cáo</h2>
                <p className="text-3xl font-bold text-red-900">42</p>
                <p className="text-sm text-red-600">Tổng số báo cáo</p>
                <p className="text-xs text-red-500 mt-1">Nhấn vào để xem chi tiết</p>
              </div>
            </div>
            {/* Modal chi tiết báo cáo */}
            {reportOpen && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
                <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-4 relative animate-fade-in flex flex-col items-center">
                  <button
                    className="absolute top-2 right-2 p-2 rounded-full hover:bg-gray-100"
                    onClick={() => setReportOpen(false)}
                    aria-label="Đóng"
                  >
                    <X className="h-5 w-5" />
                  </button>
                  <h2 className="text-lg font-bold mb-4 text-center">Chi tiết báo cáo</h2>
                  <div className="w-full">
                    <table className="min-w-full divide-y divide-muted text-sm">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">Người dùng</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">Nội dung</th>
                          <th className="px-3 py-2 text-left font-medium text-muted-foreground uppercase tracking-wider">Thời gian</th>
                        </tr>
                      </thead>
                      <tbody className="bg-background divide-y divide-muted">
                        {reportExamples.map((r) => (
                          <tr key={r.id}>
                            <td className="px-3 py-2 whitespace-nowrap">{r.id}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{r.user}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{r.content}</td>
                            <td className="px-3 py-2 whitespace-nowrap">{r.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Recent Reports */}
          <div className="mt-8">
            <h2 className="text-xl font-bold mb-4">Báo cáo gần đây</h2>
            <div className="overflow-x-auto rounded-lg border">
              <table className="min-w-full divide-y divide-muted">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Người dùng</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Nội dung</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Thời gian</th>
                  </tr>
                </thead>
                <tbody className="bg-background divide-y divide-muted">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">1</td>
                    <td className="px-6 py-4 whitespace-nowrap">user01</td>
                    <td className="px-6 py-4 whitespace-nowrap">Báo cáo nội dung sai</td>
                    <td className="px-6 py-4 whitespace-nowrap">2025-11-18</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">2</td>
                    <td className="px-6 py-4 whitespace-nowrap">user02</td>
                    <td className="px-6 py-4 whitespace-nowrap">Tài liệu thiếu hình ảnh</td>
                    <td className="px-6 py-4 whitespace-nowrap">2025-11-17</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">3</td>
                    <td className="px-6 py-4 whitespace-nowrap">user03</td>
                    <td className="px-6 py-4 whitespace-nowrap">Lỗi hiển thị trên mobile</td>
                    <td className="px-6 py-4 whitespace-nowrap">2025-11-16</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
      <MainNavigation />
    </div>
  );
}
