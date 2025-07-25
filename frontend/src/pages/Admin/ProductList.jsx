import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from "../../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast } from "react-toastify";
import AdminMenu from "./AdminMenu";

const ProductList = () => {
  const [image, setImage] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");
  const [brand, setBrand] = useState("");
  const [stock, setStock] = useState(0);
  const [imageUrl, setImageUrl] = useState(null);
  const navigate = useNavigate();

  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  
  const handleSubmit = async (e) => {
    e.preventDefault();
   
    try {
      const productData = new FormData();
      productData.append("image", image);
      productData.append("name", name);
      productData.append("description", description);
      productData.append("price", price);
      productData.append("category", category);
      productData.append("quantity", quantity);
      productData.append("brand", brand);
      productData.append("countInStock", stock);

      const { data } = await createProduct(productData);

      if (data.error) {
        toast.error("Product create failed. Try Again.");
      } else {
        toast.success(`${data.name} is created`);
        navigate("/admin/allproductslist");
      }
    } catch (error) {
      console.error(error);
      toast.error("Product create failed. Try Again.");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);

    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
   <div className="container mx-auto px-20 py-8">
    <div className="flex flex-col md:flex-row gap-6">
        <AdminMenu />

        <div className="md:w-3/4 bg-[#1a1a1a] p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Create Product</h2>

        {imageUrl && (
            <div className="mb-4 text-center">
            <img
                src={imageUrl}
                alt="product"
                className="mx-auto max-h-[200px] rounded"
            />
            </div>
        )}

        <div className="mb-6">
            <label className="block w-full cursor-pointer text-center bg-gray-800 text-white font-bold py-4 px-6 rounded-lg hover:bg-gray-700">
            {image ? image.name : "Upload Image"}
            <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
            />
            </label>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
                <label className="block text-white mb-1">Name</label>
                <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded bg-[#101011] text-white border"
                />
            </div>

            <div>
                <label className="block text-white mb-1">Price</label>
                <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full p-3 rounded bg-[#101011] text-white border"
                />
            </div>

            <div>
                <label className="block text-white mb-1">Quantity</label>
                <input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="w-full p-3 rounded bg-[#101011] text-white border"
                />
            </div>

            <div>
                <label className="block text-white mb-1">Brand</label>
                <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="w-full p-3 rounded bg-[#101011] text-white border"
                />
            </div>

            <div>
                <label className="block text-white mb-1">Count In Stock</label>
                <input
                type="number"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full p-3 rounded bg-[#101011] text-white border"
                />
            </div>

            <div>
                <label className="block text-white mb-1">Category</label>
                <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded bg-[#101011] text-white border"
                >
                <option disabled selected>Choose Category</option>
                {categories?.map((c) => (
                    <option key={c._id} value={c._id}>
                    {c.name}
                    </option>
                ))}
                </select>
            </div>
            </div>

            <div>
            <label className="block text-white mb-1">Description</label>
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full p-3 rounded bg-[#101011] text-white border"
            />
            </div>

            <button
            type="submit"
            className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-lg font-semibold text-lg"
            >
            Submit
            </button>
        </form>
        </div>
    </div>
   </div>
  );
};

export default ProductList;