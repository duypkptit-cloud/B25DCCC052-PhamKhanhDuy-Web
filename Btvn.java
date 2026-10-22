import java.util.Locale;
public class Btvn {
    public static void main(String[] args) {
        SanPham banPhim = new SanPham("SP01", "Bàn phím cơ", 450000, 20);
        SanPham chuot = new SanPham("SP02", "Chuột không dây", 200000, 50);
        SanPham taiNghe = new SanPham("SP03", "Tai nghe");
        taiNghe.setDonGia(350000);
        taiNghe.setSoLuongTon(10);

        System.out.println("===== DANH SÁCH SẢN PHẨM =====");
        banPhim.hienThi();
        chuot.hienThi();
        taiNghe.hienThi();
        DonHang don1 = new DonHang("An", banPhim, 2);
        DonHang don2 = new DonHang("Bình", chuot, 5);
        DonHang don3 = new DonHang("Chi", taiNghe, 0);
        System.out.println();
        System.out.println("===== DANH SÁCH ĐƠN HÀNG =====");
        System.out.println(String.format("%-7s%-18s%3s%12s",
                "Khách", "Sản phẩm", "SL", "Thành tiền"));
        don1.inDonHang();
        don2.inDonHang();
        don3.inDonHang();
    }
}

class SanPham {
    private String maSP;
    private String tenSP;
    private double donGia;
    private int soLuongTon;
    public SanPham() {
        this("", "");
    }
    public SanPham(String maSP, String tenSP) {
        this.maSP = maSP;
        this.tenSP = tenSP;
    }
    public SanPham(String maSP, String tenSP, double donGia, int soLuongTon) {
        this(maSP, tenSP);
        this.donGia = donGia;
        this.soLuongTon = soLuongTon;
    }

    public String getTenSP() { return tenSP; }
    public double getDonGia() { return donGia; }
    public void setDonGia(double donGia) { this.donGia = donGia; }
    public int getSoLuongTon() { return soLuongTon; }
    public void setSoLuongTon(int soLuongTon) { this.soLuongTon = soLuongTon; }

    public static String dinhDangTien(double tien) {
        return String.format(Locale.US, "%,.0f", tien).replace(',', '.');
    }

    public void hienThi() {
        System.out.println(String.format("%-6s%-18s%8s  tồn %d",
                maSP, tenSP, dinhDangTien(donGia), soLuongTon));
    }
}

class DonHang {
    private String tenKhach;
    private SanPham sanPham;
    private int soLuong;
    public DonHang(String tenKhach, SanPham sanPham, int soLuong) {
        this.tenKhach = tenKhach;
        this.sanPham = sanPham;
        if (soLuong < 1) {
            this.soLuong = 1;
        } else {
            this.soLuong = soLuong;
        }
    }

    public double tinhThanhTien() {
        double tien = sanPham.getDonGia() * soLuong;
        if (soLuong >= 5) {
            tien = tien * 0.9;
        }
        return tien;
    }

    public void inDonHang() {
        System.out.println(String.format("%-7s%-18s%3d%12s",
                tenKhach, sanPham.getTenSP(), soLuong,
                SanPham.dinhDangTien(tinhThanhTien())));
        if (soLuong >= 5) {
            System.out.println("       (đã giảm 10%)");
        }
    }
}