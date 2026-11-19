# ShopMini

Ứng dụng cửa hàng mini xây dựng bằng React + TypeScript (Vite). State toàn cục được quản lý bằng Context API và Redux Toolkit.

## 1. Cách chạy dự án

Yêu cầu: Node.js 18 trở lên.

    npm install
    npm run dev

Mở trình duyệt tại http://localhost:5173

Các lệnh khác:

- `npm run build`: kiểm tra kiểu TypeScript và build bản chạy thật.
- `npm run preview`: chạy thử bản đã build.

Tài khoản thử nghiệm: nhập tên đăng nhập bất kỳ, mật khẩu là `123456`.

## 2. Các trang

- `/` : Trang chủ. Lưới sản phẩm 1 cột (điện thoại), 2 cột (tablet), 4 cột (desktop), có ô tìm kiếm theo tên.
- `/products/:id` : Chi tiết sản phẩm. Vào thẳng đường dẫn này vẫn tự tải dữ liệu.
- `/cart` : Giỏ hàng. Tăng giảm số lượng, xoá từng món, xoá cả giỏ.
- `/login` : Đăng nhập giả lập, đăng nhập xong quay lại trang trước đó.
- `/checkout` : Thanh toán. Đây là protected route.
- Các đường dẫn khác: trang 404.

## 3. Dữ liệu nào để ở đâu và vì sao

### useState (state cục bộ)

- Từ khoá tìm kiếm ở HomePage. Chỉ một trang dùng, không cần chia sẻ, rời trang là bỏ.
- Nội dung ô nhập username, password và thông báo lỗi ở LoginPage. Đây là dữ liệu tạm của một form.
- Cờ `ordered` ở CheckoutPage. Chỉ dùng để đổi giao diện sang thông báo đặt hàng thành công.

### Context API (state toàn cục đơn giản, ít thay đổi)

- Theme sáng/tối (ThemeContext). Nhiều nơi cần đọc nhưng logic chỉ là một giá trị và một hàm đổi, nên Context là đủ, dùng Redux sẽ thừa.
- Người dùng đăng nhập (AuthContext). Header, ProtectedRoute, LoginPage và CheckoutPage đều cần, nhưng ít thay đổi và không phụ thuộc dữ liệu khác.

### Redux Toolkit (state toàn cục phức tạp)

- Danh sách sản phẩm và trạng thái tải loading, succeeded, failed (productsSlice). Đây là dữ liệu bất đồng bộ lấy từ API, dùng chung ở Trang chủ và Chi tiết. `createAsyncThunk` xử lý gọn 3 trạng thái.
- Giỏ hàng (cartSlice). Nhiều component đọc và ghi (Header, ProductCard, Chi tiết, Giỏ hàng, Thanh toán), có nhiều thao tác cập nhật và dữ liệu dẫn xuất (tổng số lượng, tổng tiền tính bằng selector). Reducer tập trung giúp dễ kiểm soát và gỡ lỗi.

### Quy tắc chung

- Chỉ một component dùng: `useState`.
- Dùng toàn cục, đơn giản, ít thay đổi: Context.
- Dùng toàn cục, nhiều thao tác hoặc bất đồng bộ: Redux Toolkit.

## 4. Cấu trúc thư mục

    src/
      app/            store.ts, hooks.ts
      features/       products/productsSlice.ts, cart/cartSlice.ts
      contexts/       ThemeContext.tsx, AuthContext.tsx
      components/     Header.tsx, ProductCard.tsx, ProtectedRoute.tsx
      layouts/        MainLayout.tsx
      pages/          HomePage, ProductDetailPage, CartPage,
                      LoginPage, CheckoutPage, NotFoundPage
      types/          index.ts (Product, CartItem, User)
      App.tsx         khai báo Routes
      main.tsx        bọc Provider, ThemeProvider, AuthProvider, BrowserRouter

## 5. Điểm đáng chú ý

- Protected route: `ProtectedRoute` kiểm tra `useAuth().user`. Nếu chưa đăng nhập sẽ chuyển sang `/login` và gửi kèm trang đang muốn vào. Sau khi đăng nhập, `LoginPage` đọc thông tin đó và chuyển về đúng trang.
- Nút "Đặt hàng" gọi `clearCart()` rồi hiện thông báo thành công.
- Theme, user và giỏ hàng được lưu vào `localStorage` để không mất khi tải lại trang.
- TypeScript chế độ `strict`, không dùng `any`. Hook Redux có kiểu sẵn (`useAppDispatch`, `useAppSelector`).