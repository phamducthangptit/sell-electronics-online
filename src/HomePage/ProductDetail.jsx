import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import Popup from "./Popup";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const [thumbnails, setThumbnials] = useState([]);
  const [details, setDetails] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [cartCountTmp, setCartCountTmp] = useState(null);
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const [isPopup, setPopupOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [countSales, setCountSales] = useState();

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
      setSelectedImage(location.state.product.image); // Set the default selected image

      /// call api
      fetch(
        `api/product-service/guest/product/get-product-detail?id=${location.state.product.productId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
        .then((res) => {
          if (res.status === 200) {
            res.json().then((data) => {
              setThumbnials(data.image);
              setDetails(data.listDetail);
              setReviews(data.listReview);
              setCountSales(data.countSales);
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  }, [location.state]);

  useEffect(() => {
    callAPIGetCartCount();
  }, []);

  const handleClickThemSanPhamVaoGH = () => {
    if (token) {
      fetch(`api/product-service/guest/cart/add-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: userName,
          productId: product.productId,
          quantity: quantity,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            callAPIGetCartCount();
          }
          res.json().then((data) => {
            console.log(data);
            setResponse(data);
            setPopupOpen(true);
          });
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    } else {
      const newResponse = { value: "Bạn cần đăng nhập để mua hàng!" };
      setResponse(newResponse);
      setPopupOpen(true);
      console.log("abc");
    }
  };
  const callAPIGetCartCount = () => {
    fetch(`api/product-service/guest/cart/count-product?username=${userName}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setCartCountTmp(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto">
      <Header cartCount={cartCountTmp && cartCountTmp.value} />
      <NavBar />
      <div className="flex flex-col md:flex-row pt-6">
        <div className="md:w-1/2 pl-10 pr-10">
          <div className="border-2 border-gray-300 p-2">
            <img
              src={selectedImage}
              alt={product.name}
              className="w-[550px] h-auto"
            />
          </div>
          <div className="flex mt-4 space-x-2">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`thumbnail-${index}`}
                className={`w-20 h-20 cursor-pointer border-2 p-1 ${selectedImage === thumbnail ? "border-blue-500" : "border-gray-300"}`}
                onClick={() => setSelectedImage(thumbnail)}
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:pl-6 mr-8">
          <h1 className="text-2xl font-bold">{product.name}</h1>
          <div className="flex items-center mt-2">
            <span className="text-gray-600">{reviews.length} Đánh giá</span>
            <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded">
              Còn {product.stock} sản phẩm
            </span>
            <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded">
              Lượt bán: {countSales}
            </span>
          </div>
          <p className="text-3xl font-bold mt-4 text-red-600">
            {product.price}
          </p>
          <ul className="list-disc ml-6 mt-4 text-gray-700">
            {details.map((detail, index) => (
              <li key={index}>
                {detail.name}: {detail.value}
              </li>
            ))}
          </ul>

          <div className="mt-6 flex items-center">
            <div className="flex items-center border border-gray-300 rounded bg-gray-100">
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                readOnly
                className="w-12 text-center border-none bg-gray-100"
              />
              <button
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded ml-12 mr-12 flex-1"
              onClick={handleClickThemSanPhamVaoGH}
            >
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>

      <div className="m-6">
        <div className="flex border-b border-gray-300">
          <button
            className={`px-4 py-2 ${activeTab === "details" ? "bg-blue-500 text-white rounded-t-lg" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("details")}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={`px-4 py-2 ml-2 ${activeTab === "reviews" ? "bg-blue-500 text-white rounded-t-lg" : "bg-gray-100 text-gray-700"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá ({reviews.length})
          </button>
        </div>
        <div className="p-4 border border-gray-300 rounded-b-lg">
          {activeTab === "details" && (
            <div>
              <p>{product.description}</p>
            </div>
          )}
          {activeTab === "reviews" && (
            <div>
              {reviews.map((review, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 mb-4">
                  <div className="flex items-center">
                    <span className="text-gray-600">{review.username}</span>
                    <span className="ml-2 text-yellow-500">
                      {Array.from({ length: review.rating }).map((_, index) => (
                        <span key={index}>&#9733;</span>
                      ))}
                    </span>
                    <span className="ml-2 text-gray-600">
                      {review.createAt}
                    </span>
                  </div>
                  <p className="mt-2">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Popup
        show={isPopup}
        onClose={() => setPopupOpen(false)}
        object={response}
      />
      <Footer />
    </div>
  );
};

export default ProductDetail;
