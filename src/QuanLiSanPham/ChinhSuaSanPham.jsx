import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import storage from "../FirebaseImage/Config"; // Ensure this is correct path to your Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary methods from firebase/storage
import down from "../image/down.png";
import { useLocation, useNavigate } from "react-router-dom";
import uploadImage from "../image/uploadfile.png";

export default function ChinhSuaSanPham() {
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [productName, setProductName] = useState("");
  const [categoryData, setCategoryData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState();
  const [manufacturerData, setManufacturerData] = useState([]);
  const [selectedManufacturer, setSelectedManufacturer] = useState();
  const [productDescription, setProductDescription] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const token = localStorage.getItem("token");
  const [categoryDetailData, setCategoryDetailData] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [productDetail, setProductDetail] = useState(null);
  const [fillName, setFillName] = useState(true);
  const [fillPrice, setFillPrice] = useState(true);
  const [fillStock, setFillStock] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setProductDetail(location.state.productDetail);
    console.log(location.state.productDetail);
  }, [location.state]);

  useEffect(() => {
    if (productDetail) {
      setProductName(productDetail.name);
      setProductDescription(productDetail.description);
      setPrice(productDetail.price);
      setQuantity(productDetail.stock);
      setSelectedCategory(productDetail.categoryId);
      setSelectedManufacturer(productDetail.manufacturerId);

      if (productDetail.listDetail) {
        setAttributes(
          productDetail.listDetail.map((detail) => ({
            detailId: detail.detailId,
            name: detail.name,
            value: detail.value,
          }))
        );
      }

      if (productDetail.image) {
        setImagePreviews(productDetail.image);
        setImages(productDetail.image);
      }
    }
  }, [productDetail]);

  useEffect(() => {
    fetch(`api/product-service/employee/category/get-all-category`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setCategoryData(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);

  useEffect(() => {
    fetch(`api/product-service/employee/manufacturer/get-all-manufacturer`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            setManufacturerData(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files).map((file) => {
      file._isNew = true; // Đánh dấu ảnh mới
      return file;
    });
    const newImages = [...images, ...selectedFiles];
    const newPreviews = [
      ...imagePreviews,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ];

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleDelete = (index) => {
    const newImages = [];
    const newPreviews = [];

    for (let i = 0; i < images.length; i++) {
      if (i !== index) {
        newImages.push(images[i]);
        newPreviews.push(imagePreviews[i]);
      } else {
        URL.revokeObjectURL(imagePreviews[i]);
      }
    }
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  useEffect(() => {
    fetch(
      `api/product-service/employee/category/get-category-detail?category-id=${selectedCategory}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            const initialAttributes = data.map((detail) => ({
              detailId: detail.detailId,
              name: detail.name,
              value:
                attributes.find(
                  (attr) =>
                    attr.detailId === detail.detailId &&
                    productDetail.categoryId === selectedCategory
                )?.value || "",
            }));
            setAttributes(initialAttributes);
            setCategoryDetailData(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [selectedCategory, token]);

  const handleSave = async () => {
    if (productName !== "") setFillName(true);
    else setFillName(false);

    if (price !== "") setFillPrice(true);
    else setFillPrice(false);

    if (quantity !== "") setFillStock(true);
    else setFillStock(false);
    if (productName !== "" && price !== "" && quantity !== "") {
      const urls = [];

      // Lấy URLs từ productDetail.image và so sánh với imagePreviews để xác định các URL cũ cần giữ lại
      const oldUrls = productDetail.image || [];
      const remainingUrls = oldUrls.filter((url) =>
        imagePreviews.includes(url)
      );

      // Lọc ra các ảnh mới dựa trên thuộc tính `_isNew`
      const newImages = images.filter((image) => image._isNew);

      // Tải lên các ảnh mới vào Firebase và lấy URL
      for (let i = 0; i < newImages.length; i++) {
        const image = newImages[i];
        const imageRef = ref(storage, `images/product/${image.name}`);
        await uploadBytes(imageRef, image);
        const url = await getDownloadURL(imageRef);
        urls.push(url);
      }

      // Kết hợp URLs mới với những URLs cũ còn tồn tại
      const updatedUrls = [...remainingUrls, ...urls];

      console.log(updatedUrls);
      const formData = {
        productId: productDetail.productId,
        name: productName,
        images: updatedUrls,
        description: productDescription,
        price: price,
        stock: quantity,
        categoryId: selectedCategory,
        manufacturerId: selectedManufacturer,
        productDetails: attributes.map((attr) => ({
          detailId: attr.detailId,
          name: attr.name,
          value: attr.value,
        })),
      };
      console.log(formData);
      fetch(`api/product-service/employee/product/update-product`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId: productDetail.productId,
          name: productName,
          description: productDescription,
          price: price,
          stock: quantity,
          categoryId: selectedCategory,
          manufacturerId: selectedManufacturer,
          productDetails: attributes.map((attr) => ({
            detailId: attr.detailId,
            name: attr.name,
            value: attr.value,
          })),
          images: updatedUrls,
        }),
      })
        .then((res) => {
          if (res.status === 200) {
            navigate("/quan-li-san-pham", {
              state: { selectedCategory: selectedCategory },
            });
          }
        })
        .catch((error) => {
          console.error("Lỗi khi gọi API:", error);
        });
    }
  };

  const handleChangeAttribute = (index, value) => {
    setAttributes((prevAttributes) => {
      const updatedAttributes = [...prevAttributes];

      if (!updatedAttributes[index]) {
        updatedAttributes[index] = {
          detailId: categoryDetailData[index]?.detailId || null,
          name: categoryDetailData[index]?.name || "",
          value: value,
        };
      } else {
        updatedAttributes[index].value = value;
      }

      return updatedAttributes;
    });
  };

  return (
    <div>
      <Header />
      <NavBar />
      <div className="flex">
        <div className="w-1/2 p-4 flex flex-col items-center">
          <div className="flex flex-wrap">
            {imagePreviews.map((preview, index) => (
              <div
                key={index}
                className="relative m-2 border border-gray-300 rounded-lg p-2"
              >
                <button
                  onClick={() => handleDelete(index)}
                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                >
                  &times;
                </button>
                <img
                  src={preview}
                  alt="Preview"
                  className="w-[320px] h-[320px] rounded-lg"
                />
              </div>
            ))}
          </div>
          <label
            htmlFor="file-upload"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded inline-flex items-center mt-4"
          >
            Tải lên ảnh
            <img
              src={uploadImage}
              alt="upload"
              className="ml-2 w-8 h-8 pointer-events-none"
            />
            <input
              id="file-upload"
              type="file"
              onChange={handleFileChange}
              multiple
              className="hidden"
            />
          </label>
        </div>

        <div className="w-1/2 p-4">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="productName"
            >
              Tên sản phẩm
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productName"
              type="text"
              placeholder="Nhập tên sản phẩm"
              value={productName}
              onChange={(e) => {
                setProductName(e.target.value);
                if (e.target.value.trim() !== "") setFillName(true);
                else setFillName(false);
              }}
              required
            />
            {!fillName && (
              <h2 className="text-red-500">Vui lòng nhập tên sản phẩm</h2>
            )}
          </div>
          <div className="flex mb-4">
            <div className="w-1/2 pr-2 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productType"
              >
                Loại sản phẩm
              </label>
              <div className="relative">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8"
                  id="productType"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                  }}
                >
                  {categoryData.map((category) => (
                    <option
                      key={category.categoryId}
                      value={category.categoryId}
                    >
                      {category.name}
                    </option>
                  ))}
                </select>
                <img
                  src={down}
                  alt="dropdown"
                  className="absolute right-2 top-2 w-4 h-4 pointer-events-none"
                />
              </div>
            </div>
            <div className="w-1/2 pl-2 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="manufacturer"
              >
                Nhà sản xuất
              </label>
              <div className="relative">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline pr-8"
                  id="manufacturer"
                  value={selectedManufacturer}
                  onChange={(e) => {
                    setSelectedManufacturer(e.target.value);
                  }}
                >
                  {manufacturerData.map((manufacturer) => (
                    <option
                      key={manufacturer.manufacturerId}
                      value={manufacturer.manufacturerId}
                    >
                      {manufacturer.name}
                    </option>
                  ))}
                </select>
                <img
                  src={down}
                  alt="dropdown"
                  className="absolute right-2 top-2 w-4 h-4 pointer-events-none"
                />
              </div>
            </div>
          </div>
          <div className="border-4 p-4 rounded-lg">
            <h3 className="text-center text-lg font-bold mb-4">
              Thông số sản phẩm
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categoryDetailData.map((categoryDetail, index) => (
                <div key={index} className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor={`attribute-${categoryDetail.detailId}`}
                  >
                    {categoryDetail.name}
                  </label>
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id={`attribute-${categoryDetail.detailId}`}
                    type="text"
                    placeholder={`Nhập thông số ${categoryDetail.name}`}
                    value={attributes[index]?.value || ""}
                    onChange={(e) =>
                      handleChangeAttribute(index, e.target.value)
                    }
                  />
                  <input
                    type="hidden"
                    value={categoryDetail.detailId}
                    name="detailId"
                  />
                  <input
                    type="hidden"
                    value={categoryDetail.name}
                    name="name"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="flex mb-4">
            <div className="w-1/2 pr-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="price"
              >
                Giá
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="Nhập giá"
                value={price}
                onChange={(e) => {
                  setPrice(e.target.value);
                  if (e.target.value !== "") setFillPrice(true);
                  else setFillPrice(false);
                }}
                required
              />
              {!fillPrice && (
                <h2 className="text-red-500">Vui lòng giá sản phẩm</h2>
              )}
            </div>
            <div className="w-1/2 pl-2">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="quantity"
              >
                Số lượng
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="quantity"
                type="number"
                placeholder="Nhập số lượng"
                value={quantity}
                onChange={(e) => {
                  setQuantity(e.target.value);
                  if (e.target.value !== "") setFillStock(true);
                  else setFillStock(false);
                }}
                required
              />
              {!fillStock && (
                <h2 className="text-red-500">Vui lòng số lượng</h2>
              )}
            </div>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="productDescription"
            >
              Mô tả sản phẩm
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="productDescription"
              rows="5"
              placeholder="Nhập mô tả sản phẩm"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="button"
            onClick={handleSave}
          >
            Lưu sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
