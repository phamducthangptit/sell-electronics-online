import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Header from "../Header";
import Footer from "../Footer";
import NavBar from "../NavBar";
import Popup from "./Popup";
import ReactStars from "react-rating-stars-component";

const ProductDetail = () => {
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const location = useLocation();
  const [thumbnails, setThumbnails] = useState([]);
  const [details, setDetails] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("details");
  const [reviews, setReviews] = useState([]);
  const [description, setDescription] = useState(null);
  const [cartCountTmp, setCartCountTmp] = useState(null);
  const token = localStorage.getItem("token");
  const userName = localStorage.getItem("username");
  const [isPopup, setPopupOpen] = useState(false);
  const [response, setResponse] = useState(null);
  const [countSales, setCountSales] = useState();
  const [activeReview, setActiveReview] = useState(false);
  const [reviewText, setReviewText] = useState(""); // State to hold the review text
  const [showReviewBox, setShowReviewBox] = useState(false); // State to control review box visibility
  const [rating, setRating] = useState(5);
  const [orderId, setOrderId] = useState();
  const [nameProduct, setNameProduct] = useState();
  const [price, setPrice] = useState();
  const [stock, setStock] = useState();

  const handleQuantityChange = (amount) => {
    setQuantity((prevQuantity) => Math.max(1, prevQuantity + amount));
  };

  useEffect(() => {
    if (location.state && location.state.product) {
      setProduct(location.state.product);
      setNameProduct(location.state.product.name);
      setSelectedImage(location.state.product.image); // Set the default selected image
      setActiveReview(location.state.product.activeReview);
      setOrderId(location.state.product.orderId);
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
              setThumbnails(data.image);
              setDetails(data.listDetail);
              setReviews(data.listReview);
              setCountSales(data.countSales);
              setDescription(data.description);
              setNameProduct(data.name);
              setPrice(data.price);
              setStock(data.stock);
              console.log(data);
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

  const handleOpenReviewBox = () => {
    setShowReviewBox(true);
  };
  const formatCurrency = (value) => {
    const numberValue = parseFloat(value);
    return numberValue
      .toLocaleString("vi-VN", { style: "currency", currency: "VND" })
      .replace("₫", "VNĐ");
  };

  const handleReviewSubmit = (productId) => {
    fetch(`api/product-service/guest/review/add-review`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userName: userName,
        productId: productId,
        ratting: rating,
        comment: reviewText,
        orderId: orderId,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
            setReviews([...reviews, data]);
            setActiveReview(false);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
    setReviewText("");
    setShowReviewBox(false);
    setRating(5);
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
              alt={nameProduct}
              className="w-[550px] h-auto"
            />
          </div>
          <div className="flex mt-4 space-x-2">
            {thumbnails.map((thumbnail, index) => (
              <img
                key={index}
                src={thumbnail}
                alt={`thumbnail-${index}`}
                className={`w-20 h-20 cursor-pointer border-2 p-1 ${
                  selectedImage === thumbnail
                    ? "border-blue-500"
                    : "border-gray-300"
                }`}
                onClick={() => setSelectedImage(thumbnail)}
              />
            ))}
          </div>
        </div>
        <div className="md:w-1/2 md:pl-6 mr-8">
          <h1 className="text-2xl font-bold">{nameProduct}</h1>
          <div className="flex items-center mt-2">
            <span className="text-gray-600">{reviews.length} Đánh giá</span>
            <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded">
              Còn {product.stock || stock} sản phẩm
            </span>
            <span className="ml-2 px-2 py-1 bg-green-200 text-green-800 rounded">
              Lượt bán: {countSales}
            </span>
          </div>
          <p className="text-3xl font-bold mt-4 text-red-600">
            {product.price || (price && formatCurrency(price))}
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
            className={`px-4 py-2 ${
              activeTab === "details"
                ? "bg-blue-500 text-white rounded-t-lg"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("details")}
          >
            Mô tả sản phẩm
          </button>
          <button
            className={`px-4 py-2 ml-2 ${
              activeTab === "reviews"
                ? "bg-blue-500 text-white rounded-t-lg"
                : "bg-gray-100 text-gray-700"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Đánh giá ({reviews.length})
          </button>
        </div>
        <div className="p-4 border border-gray-300 rounded-b-lg">
          {activeTab === "details" && (
            <div>
              <p>{description}</p>
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
              {activeReview && (
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 mt-4 rounded"
                  onClick={handleOpenReviewBox}
                >
                  Viết đánh giá
                </button>
              )}
              {showReviewBox && (
                <div className="mt-4">
                  <div className="mt-2">
                    <ReactStars
                      count={5}
                      onChange={setRating}
                      size={24}
                      activeColor="#ffd700"
                      value={rating}
                    />
                  </div>
                  <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full h-32 border border-gray-300 rounded p-2"
                    placeholder="Nhập đánh giá của bạn..."
                  ></textarea>

                  <button
                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-2 rounded"
                    onClick={() => handleReviewSubmit(product.productId)}
                  >
                    Gửi đánh giá
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <Popup
        message={response && response.value}
        isPopup={isPopup}
        setPopupOpen={setPopupOpen}
      />
    </div>
  );
};

export default ProductDetail;
