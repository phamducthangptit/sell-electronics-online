import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './HomePage/HomePage';
import DangNhap from './Account/DangNhap';
import DangKi from './Account/DangKi';
import QuenMatKhau from './Account/QuenMatKhau';
import QuanLiNhanVien from './QuanLiNhanVien/QuanLiNhanVien';
import QuanLiDoanhThu from './QuanLiDoanhThu/QuanLiDoanhThu';
import DoiMatKhau from './Account/DoiMatKhau';
import QuanLiNhaSanXuat from './QuanLiNhaSanXuat/QuanLiNhaSanXuat';
import QuanLiLoaiSanPham from './QuanLiLoaiSanPham/QuanLiLoaiSanPham';
import QuanLiSanPham from './QuanLiSanPham/QuanLiSanPham';
import ThemSanPham from "./QuanLiSanPham/ThemSanPham";
import ChinhSuaSanPham from "./QuanLiSanPham/ChinhSuaSanPham";
import ProductDetail from './HomePage/ProductDetail';
import GioHang from "./DonHang_Khach/GioHang";
import DonHang from "./DonHang_Khach/DonHang";
import XacNhanDonHang from "./DonHang_Khach/XacNhanDonHang";
import DonHangDetail from "./DonHang_Khach/DonHangDetail";
import QuanLiDonHang from './QuanLiDonHang/QuanLiDonHang';
import ReturnPayment from "./DonHang_Khach/ReturnPayment";
import QuanLiKhachHang from './QuanLiKhachHang/QuanLiKhachHang';
import ThongKeDonHang from './QuanLiDoanhThu/ThongKeDonHang';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

export default function Sell() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" >
          <Route index element={<HomePage />} />
          <Route path="dang-nhap" element={<DangNhap />} />
          <Route path="dang-ki" element={<DangKi />} />
          <Route path="quen-mat-khau" element={<QuenMatKhau />} />
          <Route path="doi-mat-khau" element={<DoiMatKhau />} />
          <Route path='quan-li-nhan-vien' element={<QuanLiNhanVien />} />
          <Route path='thong-ke-doanh-thu' element={<QuanLiDoanhThu />} />
          <Route path='quan-li-nha-san-xuat' element={<QuanLiNhaSanXuat />} />
          <Route path='quan-li-loai-san-pham' element={<QuanLiLoaiSanPham />} />
          <Route path='quan-li-san-pham' element={<QuanLiSanPham />} />
          <Route path='them-san-pham' element={<ThemSanPham />} />
          <Route path='chinh-sua-san-pham' element={<ChinhSuaSanPham />} />
          <Route path='chi-tiet-san-pham' element={<ProductDetail />} />
          <Route path='gio-hang' element={<GioHang />} />
          <Route path='don-hang' element={<DonHang />} />
          <Route path='xac-nhan-don-hang' element={<XacNhanDonHang />} />
          <Route path='chi-tiet-don-hang' element={<DonHangDetail />} />
          <Route path='quan-li-don-hang' element={<QuanLiDonHang />} />
          <Route path='return-payment' element={<ReturnPayment />} />
          <Route path='quan-li-khach-hang' element={<QuanLiKhachHang />} />
          <Route path='thong-ke-don-hang' element={<ThongKeDonHang />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Sell />)
