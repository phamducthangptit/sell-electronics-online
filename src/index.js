import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import HomePage from './HomePage';
import DangNhap from './DangNhap';
import DangKi from './DangKi';
import QuenMatKhau from './QuenMatKhau';
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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<Sell />)
