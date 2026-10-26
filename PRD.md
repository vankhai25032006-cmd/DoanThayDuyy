# 📱 TÀI LIỆU YÊU CẦU SẢN PHẨM (PRD - PRODUCT REQUIREMENT DOCUMENT)
## DỰ ÁN: WEBSITE THƯƠNG MẠI ĐIỆN TỬ BÁN ĐỒ CÔNG NGHỆ - TECHSTORE

---

## 1. TỔNG QUAN DỰ ÁN (PROJECT OVERVIEW)

* **Tên ứng dụng:** TechStore - Hệ thống bán lẻ thiết bị công nghệ trực tuyến.
* **Mục tiêu dự án:** Xây dựng ứng dụng Web Thương mại Điện tử hiện đại, tối ưu trải nghiệm người dùng (UX/UI), cung cấp đầy đủ các tính năng mua sắm, thanh toán linh hoạt, chăm sóc khách hàng tự động và quản trị doanh thu dành cho môn Lập trình Web.
* **Đối tượng người dùng:** 
  * Khách hàng cá nhân tìm mua các sản phẩm công nghệ (Điện thoại, Laptop, Phụ kiện).
  * Quản trị viên (Admin) quản lý cửa hàng, theo dõi đơn hàng và doanh thu.

---

## 2. CÔNG NGHỆ SỬ DỤNG (TECH STACK)

* **Front-end Framework:** React.js (Vite)
* **Styling & UI:** Tailwind CSS, Lucide React Icons
* **Kiến trúc dữ liệu:** RESTful API (DummyJSON API kết hợp `Promise.all` xử lý bất đồng bộ), React State Management, LocalStorage.
* **Tích hợp dịch vụ:** VietQR API (Tạo mã QR thanh toán ngân hàng tự động).

---

## 3. DANH SÁCH CHI TIẾT CÁC CHỨC NĂNG (FEATURE SPECIFICATIONS)

### 3.1. Giao diện & Trải nghiệm Người dùng (UI/UX)
* **Thanh Header & Tìm kiếm:**
  * Khung tìm kiếm thời gian thực (Real-time Search) hỗ trợ gợi ý nhanh danh sách sản phẩm khớp với từ khóa.
  * Tích hợp thuộc tính `translate="no"` và `notranslate` ngăn chặn lỗi vỡ giao diện do trình duyệt tự động dịch.
  * Hiển thị Badge số lượng sản phẩm động trong Giỏ hàng.
* **Chế độ Tối/Sáng (Dark/Light Mode):** Chuyển đổi giao diện linh hoạt giữa nền sáng và nền tối chỉ với 1 cú click.
* **Phân loại Danh mục (Category Navigation):** Lọc nhanh các danh mục công nghệ cốt lõi: *Tất cả đồ công nghệ, Điện thoại (Smartphones), Laptops & Máy tính, Phụ kiện công nghệ*.
* **Sắp xếp Sản phẩm (Sorting):** Sắp xếp danh sách sản phẩm theo giá *Từ thấp đến cao* hoặc *Từ cao đến thấp*.

### 3.2. Quản lý Sản phẩm & Xem Chi tiết
* **Tích hợp API Động:** Tải tự động hàng chục sản phẩm công nghệ chất lượng cao từ API bên ngoài, tự động quy đổi tỉ giá USD sang VNĐ.
* **Thẻ Sản phẩm (Product Card):** Hiển thị hình ảnh phóng to khi hover, tên sản phẩm, giá bán, giá cũ gạch chân và Badge nhãn (*Bán chạy, Mới*).
* **Modal Chi tiết Sản phẩm:** Bấm vào bất kỳ sản phẩm nào để mở cửa sổ Pop-up xem thông tin chi tiết, chính sách bảo hành 12 tháng, đổi trả 1-1 và nút thêm vào giỏ.

### 3.3. Giỏ hàng & Mã Giảm Giá (Cart & Voucher System)
* **Quản lý Giỏ hàng:** Thêm sản phẩm, tăng/giảm số lượng hoặc xóa sản phẩm ngay trong khung drawer giỏ hàng trượt từ bên phải màn hình.
* **Áp dụng Mã giảm giá:** Tích hợp kiểm tra mã Voucher hợp lệ:
  * `TECH10`: Giảm 10% trên tổng giá trị đơn hàng.
  * `FREESHIP`: Giảm trực tiếp 50.000 VNĐ tiền vận chuyển.
* **Tự động tính toán:** Cập nhật ngay lập tức tổng tiền thanh toán sau khi trừ giảm giá.

### 3.4. Quy trình Thanh toán Đa dạng (Flexible Checkout System)
* **Nhập thông tin giao hàng:** Họ tên, Số điện thoại và Địa chỉ nhận hàng.
* **Tùy chọn Phương thức Thanh toán:**
  1. **Thanh toán Tiền mặt (COD):** Thanh toán trực tiếp khi nhận hàng.
  2. **Chuyển khoản QR Code (VietQR):** Tự động render mã QR ngân hàng VietQR theo thời gian thực, tích hợp chính xác số tiền cần trả và nội dung chuyển khoản theo mã đơn hàng.

### 3.5. Tính năng Khách hàng & Gamification (Đổi mới)
* **Quản lý Đơn hàng Cá nhân (My Orders):** Khách hàng xem lại lịch sử các đơn hàng đã đặt, theo dõi trạng thái (*Giao thành công, Chờ duyệt trả hàng, Đã hoàn tiền*) và phương thức thanh toán đã chọn.
* **Yêu cầu Trả hàng / Hoàn tiền (Returns & Refunds):** Khách hàng có thể gửi yêu cầu trả hàng kèm lý do trực tiếp từ danh sách đơn hàng của mình.
* **Ví Mã Vòng Quay May Mắn (Lucky Wheel):** 
  * Mỗi đơn hàng hoàn tất sẽ tự động cấp 1 Mã quay thưởng duy nhất (VD: `LUCKY-xxxx`).
  * Nút Vòng quay may mắn góc dưới màn hình mở ra minigame quay trúng thưởng iPhone/Voucher dành cho khách hàng có mã hợp lệ.

### 3.6. Bảng Quản trị Admin (Admin Dashboard)
* **Thống kê Doanh thu Thực tế:** 
  * Cập nhật tức thì TỔNG DOANH THU, TỔNG ĐƠN HÀNG và TỔNG SẢN PHẨM ĐÃ BÁN.
  * Tự động trừ lại doanh thu khi Admin duyệt các đơn trả hàng/hoàn tiền.
* **Quản lý Đơn hàng & Duyệt Trả hàng:** Admin theo dõi toàn bộ danh sách đơn đặt, xem lý do khách hàng xin trả hàng và bấm nút "Duyệt hoàn tiền".

### 3.7. Trợ lý Ôn tuyến Tự động (AI Chatbot Assistant)
* **Khung Chat Hỗ trợ Trực tuyến:** Nằm ở góc dưới bên phải màn hình, thiết kế dạng Widget mượt mà.
* **Gợi ý Câu hỏi Nhanh:** Các nút bấm nhanh *📱 Điện thoại, 💻 Laptop, 🎁 Mã giảm giá, 🛡️ Bảo hành*.
* **Xử lý Ngôn ngữ Tự động:** Chatbot phân tích từ khóa tin nhắn của khách hàng để đưa ra câu trả lời tư vấn chính xác về sản phẩm, chính sách bảo hành và mã ưu đãi.

---

## 4. QUY TRÌNH NGHIỆP VỤ CHÍNH (KEY USER FLOWS)

1. **Khách mua hàng:** Chọn sản phẩm $\rightarrow$ Xem chi tiết $\rightarrow$ Thêm vào giỏ $\rightarrow$ Nhập Voucher $\rightarrow$ Chọn Thanh toán (COD / QR) $\rightarrow$ Nhận Mã Vòng Quay.
2. **Khách trả hàng:** Vào "Đơn Hàng Của Tôi" $\rightarrow$ Bấm "Yêu cầu Trả hàng" $\rightarrow$ Nhập lý do $\rightarrow$ Chờ Admin duyệt.
3. **Admin xử lý:** Mở "Báo Cáo Admin" $\rightarrow$ Kiểm tra mục Quản lý Đơn $\rightarrow$ Bấm "Duyệt hoàn tiền" $\rightarrow$ Hệ thống cập nhật lại Doanh thu thực.

---
*Tài liệu được biên soạn phục vụ cho đợt Báo cáo Đồ án Môn Lập trình Web - TechStore 2026.*