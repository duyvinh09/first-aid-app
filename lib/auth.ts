import md5 from "md5";

export const ADMIN_ACCOUNT = {
  email: "admin@example.com",
  password: md5("123456"), // 🔐 Mã hóa ngay khi khởi tạo
};
