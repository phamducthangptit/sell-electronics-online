import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function NavBar() {
  const [role, setRole] = useState(null);
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const meuItemGuest = [
    { name: "Trang chủ", link: "/" },
    { name: "Đơn hàng", link: "/don-hang" },
  ];
  const meuItemAdmin = [
    { name: "Quản lí nhân viên", link: "/quan-li-nhan-vien" },
    { name: "Thống kê doanh thu", link: "/thong-ke-doanh-thu" },
    { name: "Thống kê đơn hàng", link: "/thong-ke-don-hang" },
  ];
  const meuItemEmployee = [
    { name: "Quản lí đơn hàng", link: "/quan-li-don-hang" },
    { name: "Quản lí sản phẩm", link: "/quan-li-san-pham" },
    { name: "Quản lí loại sản phẩm", link: "/quan-li-loai-san-pham" },
    { name: "Quản lí nhà sản xuất", link: "/quan-li-nha-san-xuat" },
    { name: "Quản lí khách hàng", link: "/quan-li-khach-hang" },
  ];
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp < currentTime) {
          // Token đã hết hạn
          localStorage.removeItem("token");
        } else {
          setRole(decoded.role);
          // console.log(decoded);
        }
      } catch (error) {
        console.error("Invalid token:", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const handleTabClick = (link) => {
    setActiveTab(link);
  };
  return (
    <div>
      <nav className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4"></div>
            {role === "ADMIN" && (
              <ul className="flex items-center space-x-8">
                {meuItemAdmin.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={
                        activeTab === item.link
                          ? "text-blue-600 font-semibold"
                          : ""
                      }
                      onClick={() => handleTabClick(item.link)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {role === "EMPLOYEE" && (
              <ul className="flex items-center space-x-8">
                {meuItemEmployee.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={
                        activeTab === item.link
                          ? "text-blue-600 font-semibold"
                          : ""
                      }
                      onClick={() => handleTabClick(item.link)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {role === "GUEST" && (
              <ul className="flex items-center space-x-8">
                {meuItemGuest.map((item, index) => (
                  <li key={index}>
                    <Link
                      to={item.link}
                      className={
                        activeTab === item.link
                          ? "text-blue-600 font-semibold"
                          : ""
                      }
                      onClick={() => handleTabClick(item.link)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="flex items-center space-x-4"></div>
          </div>
        </div>
      </nav>
    </div>
  );
}
