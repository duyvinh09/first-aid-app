type NotificationItem = {
  id: string
  title: string
  content: string
  isRead: boolean
  createdAt: string
  type: 'message' | 'system' | 'alert'
  url?: string
}

const INITIAL: NotificationItem[] = [
  {
    id: 'n-1',
    title: 'Bộ Y tế: Hướng dẫn phòng chống dịch mới cập nhật',
    content: 'Bộ Y tế vừa công bố hướng dẫn cập nhật về phòng chống dịch, bao gồm khuyến cáo hành vi và cập nhật tiêm chủng.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    type: 'alert',
    url: 'https://moh.gov.vn/news/huong-dan-phong-chong-dich-2025'
  },
  {
    id: 'n-2',
    title: 'Thông tin: Cập nhật chỉ số sức khoẻ cộng đồng',
    content: 'Bản tin tuần: chỉ số sức khoẻ cộng đồng ghi nhận những thay đổi đáng chú ý, xem báo cáo chi tiết.',
    isRead: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    type: 'system',
    url: 'https://moh.gov.vn/news/bao-cao-suc-khoe-cong-dong'
  },
  {
    id: 'n-3',
    title: 'Kết quả xét nghiệm: hướng dẫn đọc kết quả',
    content: 'Hướng dẫn đọc kết quả xét nghiệm và những điểm cần lưu ý khi thông báo cho bệnh nhân.',
    isRead: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    type: 'message',
    url: 'https://moh.gov.vn/news/huong-dan-doc-ket-qua-xet-nghiem'
  }
]

let STORE: NotificationItem[] = INITIAL.slice()

export function getAllNotifications() {
  return STORE
}

export function addNotification(item: NotificationItem) {
  STORE = [item, ...STORE]
  return item
}

export function updateNotification(id: string, patch: Partial<NotificationItem>) {
  STORE = STORE.map((n) => (n.id === id ? { ...n, ...patch } : n))
  return STORE.find((n) => n.id === id) || null
}
