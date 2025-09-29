# 🚑 Quick First Aid App

> **Ứng dụng sơ cứu thông minh được phát triển bởi nhóm FireBlaze**

Một ứng dụng web hiện đại giúp cung cấp hướng dẫn sơ cứu nhanh chóng và tìm kiếm hỗ trợ y tế khẩn cấp trong các tình huống nguy hiểm.

## 👥 Nhóm phát triển - Team FireBlaze

- **Đinh Duy Vinh**
- **Phạm Ngọc Vũ**
- **Trần Văn Tú**
- **Nguyễn Văn Tứ**
- **Nguyễn Đắc Quốc Tuấn**
- **Lê Trần Viết Việt**

## 🌟 Tính năng chính

### 📚 Hướng dẫn sơ cứu chi tiết

- Danh sách các tình huống khẩn cấp phổ biến (CPR, bỏng, chảy máu, hóc dị vật, gãy xương, v.v.)
- Hướng dẫn từng bước được chia theo mức độ ưu tiên (Cao, Trung bình, Thấp)
- Giao diện trực quan với icon và mô tả rõ ràng

### 🆘 Hỗ trợ khẩn cấp

- **Gọi khẩn cấp 115** với một chạm
- **Tìm bệnh viện gần nhất** dựa trên vị trí GPS hiện tại
- **Bản đồ tương tác** hiển thị vị trí bệnh viện trong bán kính 4km
- **Chỉ đường tự động** đến bệnh viện qua Google Maps
- Hiển thị khoảng cách và thông tin liên hệ của bệnh viện

### 🤖 Trợ lý AI thông minh

- **Chat bot AI** hỗ trợ tư vấn sơ cứu 24/7
<!-- - **Nhận diện giọng nói** để hỗ trợ trong tình huống khẩn cấp -->
- Câu hỏi gợi ý nhanh cho các tình huống phổ biến
- Tích hợp thông tin vị trí và ngữ cảnh hiện tại

### 🔍 Tìm kiếm thông minh

- Tìm kiếm nhanh hướng dẫn sơ cứu theo từ khóa
- Giao diện thân thiện và dễ sử dụng

### 📱 Giao diện responsive

- Thiết kế mobile-first với Tailwind CSS
- Hỗ trợ đầy đủ trên điện thoại, tablet và desktop nhưng nghiêng về mobile
- Hỗ trợ đa ngôn ngữ (Việt/Anh) để cho người nước ngoài có thể sử dụng

## 🛠 Công nghệ sử dụng

### Frontend

- **Next.js 15** - React framework hiện đại
- **TypeScript** - Type safety và developer experience
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component library
- **Lucide React** - Beautiful icon library

### Bản đồ & Vị trí

- **Google Maps API** - Chỉ đường và geocoding
- **OpenStreetMap API** - Dữ liệu bản đồ mở (open source)
- **Geolocation API** - Xác định vị trí người dùng

### State Management & API

- **Zustand** - State management library
- **React Hook Form** - Form validation
- **Zod** - Schema validation

### Database & Backend

- **MySQL** - Relational database
- **Prisma** - Database ORM
- **API Routes** - Next.js server-side API

## 🚀 Cài đặt và chạy dự án

### Yêu cầu hệ thống

- Node.js 18+
- pnpm (preferred) hoặc npm
- MySQL database

### Cài đặt

1. **Clone repository**

```bash
git clone https://github.com/duyvinh09/first-aid-app.git
cd first-aid-app
```

2. **Cài đặt dependencies**

```bash
pnpm install
# hoặc
npm install
```

3. **Cấu hình database**

```bash
# Tạo file .env.local và cấu hình DATABASE_URL
DATABASE_URL="mysql://username:password@localhost:3306/first_aid_db"
```

4. **Setup database**

```bash
npx prisma generate
npx prisma db push
```

5. **Chạy development server**

```bash
pnpm dev
# hoặc
npm run dev
```

6. **Mở trình duyệt**

```
http://localhost:3000
```

## 📱 Hướng dẫn sử dụng

### 1. Trang chủ

- Xem danh sách các tình huống khẩn cấp phổ biến
- Chọn tình huống để xem hướng dẫn chi tiết
- Truy cập nút "Emergency Help" để gọi cứu hộ

### 2. Hướng dẫn sơ cứu

- Đọc từng bước hướng dẫn chi tiết
- Xem hình ảnh minh họa (nếu có)
- Sử dụng AI chat để hỏi thêm thông tin

### 3. Khẩn cấp

- Gọi 115 trực tiếp
- Xem bản đồ bệnh viện gần nhất
- Nhận chỉ đường đến bệnh viện

### 4. Trợ lý AI

- Click icon chat ở góc phải màn hình
- Gõ câu hỏi hoặc sử dụng voice input
- Nhận tư vấn sơ cứu tức thì

## 🏗 Kiến trúc dự án

```
first-aid-app/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── chat/              # Chat page
│   ├── emergency/         # Emergency assistance
│   ├── guide/             # First aid guides
│   └── search/            # Search functionality
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   ├── ai-chat.tsx       # AI chat component
│   ├── emergency-button.tsx
│   └── leaflet-map.tsx   # Map component
├── hooks/                 # Custom React hooks
├── lib/                   # Utility functions
├── prisma/               # Database schema
└── types/                # TypeScript definitions
```

## 🔧 Scripts có sẵn

```bash
pnpm dev        # Chạy development server
pnpm build      # Build production
pnpm start      # Chạy production server
pnpm lint       # Kiểm tra code quality
```

## 🎯 Tính năng nổi bật

### ⚡ Tốc độ phản hồi

- Server-side rendering với Next.js
- Image optimization tự động
- Code splitting và lazy loading

### 🔒 Bảo mật

- TypeScript cho type safety
- Form validation với Zod
- Sanitized API responses

### ♿ Accessibility

- Keyboard navigation support
- Screen reader friendly
- High contrast support

### 🌐 PWA Ready

- Service worker support
- Offline functionality
- Install as mobile app

## 📞 Hỗ trợ

Nếu gặp vấn đề hoặc có câu hỏi, vui lòng liên hệ team FireBlaze qua:

- GitHub Repository: https://github.com/duyvinh09/first-aid-app
- GitHub Issues: https://github.com/duyvinh09/first-aid-app/issues

## 📄 License

Dự án được phát triển cho mục đích học tập tại **CMU - IS 432 MIS**.

---

**Phát triển với ❤️ bởi Team FireBlaze**

> _"Sơ cứu kịp thời, cứu sống kịp thời"_
