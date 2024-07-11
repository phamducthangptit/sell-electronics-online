import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './HomePage';
import DangNhap from './Account/DangNhap';
import DangKi from './Account/DangKi';
import QuenMatKhau from './Account/QuenMatKhau';
import QuanLiNhanVien from './QuanLiNhanVien/QuanLiNhanVien'
import QuanLiDoanhThu from './QuanLiDoanhThu/QuanLiDoanhThu'
import DoiMatKhau from './Account/DoiMatKhau'
import QuanLiNhaSanXuat from './QuanLiNhaSanXuat/QuanLiNhaSanXuat'
import QuanLiLoaiSanPham from './QuanLiLoaiSanPham/QuanLiLoaiSanPham'
import QuanLiSanPham from './QuanLiSanPham/QuanLiSanPham'
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
          <Route path='quan-li-doanh-thu' element={<QuanLiDoanhThu />} />
          <Route path='quan-li-nha-san-xuat' element={<QuanLiNhaSanXuat />} />
          <Route path='quan-li-loai-san-pham' element={<QuanLiLoaiSanPham />} />
          <Route path='quan-li-san-pham' element={<QuanLiSanPham />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Sell />)
