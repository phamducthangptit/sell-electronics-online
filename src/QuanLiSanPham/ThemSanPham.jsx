import { useEffect, useState } from "react";
import Header from "../Header";
import NavBar from "../NavBar";
import storage from "../FirebaseImage/Config"; // Ensure this is correct path to your Firebase config
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"; // Import necessary methods from firebase/storage
import down from "../image/down.png";

export default function ThemSanPham() {
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

  useEffect(() => {
    fetch(`api/product-service/category/get-all-category`, {
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
            setSelectedCategory(data[0].categoryId);
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);

  useEffect(() => {
    fetch(`api/product-service/manufacturer/get-all-manufacturer`, {
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
            setSelectedManufacturer(data[0].manufacturerId);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  }, [token]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const newImages = [...images, ...selectedFiles];

    const newPreviews = [
      ...imagePreviews,
      ...selectedFiles.map((file) => URL.createObjectURL(file)),
    ];

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleDelete = (index) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);

    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  useEffect(() => {
    console.log(selectedCategory);
    fetch(
      `api/product-service/category/get-category-detail?category-id=${selectedCategory}`,
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
              value: "", // Set initial value to empty string
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
    // if (!images.length) return;

    // console.log(formDataAttributes);

    const urls = [];

    for (let i = 0; i < images.length; i++) {
      const image = images[i];
      const imageRef = ref(storage, `images/${image.name}`); // Create a reference to the file in storage
      await uploadBytes(imageRef, image); // Upload the file to the reference
      const url = await getDownloadURL(imageRef); // Get the download URL
      urls.push(url);
    }

    fetch(`api/product-service/product/add-new-product`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
        images: urls,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          res.json().then((data) => {
            console.log(data);
          });
        }
      })
      .catch((error) => {
        console.error("Lỗi khi gọi API:", error);
      });
  };

  const handleChangeAttribute = (index, value) => {
    setAttributes((prevAttributes) => {
      const updatedAttributes = [...prevAttributes];

      // Kiểm tra xem phần tử tại index đã tồn tại trong mảng chưa
      if (!updatedAttributes[index]) {
        // Nếu chưa tồn tại, bạn có thể tạo mới nó
        updatedAttributes[index] = {
          detailId: categoryDetailData[index]?.detailId || null,
          name: categoryDetailData[index]?.name || "",
          value: value,
        };
      } else {
        // Nếu đã tồn tại, chỉ cập nhật giá trị value
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
        {/* Cột cho ảnh */}
        <div className="w-1/2 p-4">
          <input type="file" onChange={handleFileChange} multiple />
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
                />{" "}
              </div>
            ))}
          </div>
        </div>
        {/* Cột cho thông tin sản phẩm */}
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
              onChange={(e) => setProductName(e.target.value)}
              required
            />
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-700">
                  <img
                    src={down}
                    alt="Arrow Down"
                    className="w-5 h-5 mx-auto"
                  />
                </div>
              </div>
            </div>
            <div className="w-1/2 pl-2 relative">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="manufacturer"
              >
                Hãng sản xuất
              </label>
              <div className="relative">
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="manufacturer"
                  value={selectedManufacturer}
                  onChange={(e) => setSelectedManufacturer(e.target.value)}
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
                <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-700">
                  <img
                    src={down}
                    alt="Arrow Down"
                    className="w-5 h-5 mx-auto"
                  />
                </div>
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
                Giá bán
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="price"
                type="number"
                placeholder="Nhập giá bán"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
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
                onChange={(e) => setQuantity(e.target.value)}
              />
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
              placeholder="Nhập mô tả sản phẩm"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
            />
          </div>
          <button
            onClick={handleSave}
            type="button"
            className="bg-blue-500 text-white px-4 py-2 mt-4"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
