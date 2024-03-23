# Hướng dẫn Truy cập Ứng dụng Node.js

## Yêu cầu

1. Node.js: Đảm bảo bạn đã cài đặt Node.js trên máy tính của mình. Bạn có thể tải Node.js từ trang web chính thức của Node.js: [nodejs.org](https://nodejs.org/).

2. XAMPP (hoặc bất kỳ hệ thống quản lý cơ sở dữ liệu nào khác): Ứng dụng của bạn sử dụng XAMPP làm cơ sở dữ liệu. Bạn cần cài đặt và khởi động XAMPP trước khi chạy ứng dụng.

## Hướng dẫn

1. **Tải xuống mã nguồn của ứng dụng**:
   - Tải mã nguồn của ứng dụng từ repository của bạn hoặc từ nơi bạn lưu trữ mã nguồn.

2. **Cài đặt các phụ thuộc của dự án**:
   - Mở Terminal hoặc Command Prompt.
   - Di chuyển đến thư mục của dự án.
   - Chạy lệnh sau để cài đặt các phụ thuộc của dự án:
     ```
     npm install
     ```

3. **Khởi động XAMPP và import cơ sở dữ liệu**:
   - Khởi động XAMPP và đảm bảo MySQL đã được bật.
   - Sử dụng công cụ quản lý cơ sở dữ liệu (ví dụ: phpMyAdmin) để import file db.sql từ thư mục public vào cơ sở dữ liệu của bạn.

4. **Chạy ứng dụng**:
   - Trong Terminal hoặc Command Prompt, chạy lệnh sau để khởi động ứng dụng:
     ```
     node app.js
     ```

5. **Truy cập ứng dụng**:
   - Mở trình duyệt web và nhập địa chỉ sau vào thanh địa chỉ:
     ```
     http://localhost:3000
     ```
   - Bây giờ bạn đã có thể truy cập vào ứng dụng của mình và bắt đầu sử dụng nó.

Nếu có bất kỳ vấn đề gì trong quá trình cài đặt hoặc chạy ứng dụng, đừng ngần ngại liên hệ với nhà phát triển của ứng dụng để được hỗ trợ.
