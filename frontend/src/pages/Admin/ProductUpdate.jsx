import { useState, useEffect } from "react";
import AdminMenu from "./AdminMenu";
import { useNavigate, useParams } from "react-router-dom";
import {
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetProductByIdQuery,
  useUploadProductImageMutation,
} from "../../redux/api/productsApiSlice";
import { useFetchCategoriesQuery } from "../../redux/api/categoryApiSlice";
import { toast, ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const AdminProductUpdate = () => {
  const params = useParams();

  const { data: productData } = useGetProductByIdQuery(params._id);

  console.log(productData);

  const [image, setImage] = useState(productData?.image || "");
  const [name, setName] = useState(productData?.name || "");
  const [description, setDescription] = useState(
    productData?.description || ""
  );
  const [price, setPrice] = useState(productData?.price || "");
  const [category, setCategory] = useState(productData?.category || "");
  const [quantity, setQuantity] = useState(productData?.quantity || "");
  const [brand, setBrand] = useState(productData?.brand || "");
  const [stock, setStock] = useState(productData?.countInStock);

  // hook
  const navigate = useNavigate();

  // Fetch categories using RTK Query
  const { data: categories = [] } = useFetchCategoriesQuery();

  const [uploadProductImage] = useUploadProductImageMutation();

  // Define the update product mutation
  const [updateProduct] = useUpdateProductMutation();

  // Define the delete product mutation
  const [deleteProduct] = useDeleteProductMutation();

  useEffect(() => {
    if (productData && productData._id) {
      setName(productData.name);
      setDescription(productData.description);
      setPrice(productData.price);
  
      // Fix: directly use category if it's a string
      setCategory(productData.category);
  
      console.log("Category of product:", productData.category); // should now print ObjectId
      setQuantity(productData.quantity);
      setBrand(productData.brand);
      setImage(productData.image);
      setStock(productData.countInStock); // <-- Add this
   
    }
  }, [productData]);

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success("Item added successfully", {
           position: "top-right",
        autoClose: 2000,
      });
      setImage(res.image);
    } catch (err) {
      toast.success("Item added successfully", {
           position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      if (category) formData.append("category", category); // make sure it's valid
      formData.append("quantity", quantity);
      formData.append("brand", brand);
      if (!isNaN(stock)) formData.append("countInStock", stock);
  
      const data = await updateProduct({ productId: params._id, formData });
  
      if (data?.error) {
        toast.error(data.error, {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        toast.success(`Product successfully updated`, {
          position: "top-right",
          autoClose: 2000,
        });
        navigate("/admin/allproductslist");
      }
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };
  

  const handleDelete = async () => {
    try {
      let answer = window.confirm(
        "Are you sure you want to delete this product?"
      );
      if (!answer) return;

      const { data } = await deleteProduct(params._id);
      toast.success(`Product successfully deleted`, {
        position: "top-right",
        autoClose: 2000,
      });
      navigate("/admin/allproductslist");
    } catch (err) {
      console.log(err);
      toast.error("Product update failed. Try again.", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  return (
    <>
      <div className="container pl-25 py-8">
        <div className="flex flex-col md:flex-row">
          <AdminMenu />
          <div className="md:w-3/4 p-3">
            <div className="h-12 text-2xl font-bold">Update / Delete Product</div>

            

            <div className="p-6 bg-[#1a1a1a] rounded-xl shadow-lg text-white">
                <div className="mt-6">
                    {image && (
                        <div className="mt-4">
                        <img
                        src={image}
                        alt="product"
                        className="max-w-full h-auto rounded-lg shadow-md"
                        />
                    </div>
                    )}
                    <label className="block font-semibold mb-2">Upload Image</label>
                    <input
                    type="file"
                    accept="image/*"
                    onChange={uploadFileHandler}
                    className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-green-700 file:text-white
                                hover:file:bg-green-800"
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                    <label className="block mb-1 font-semibold">Name</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    </div>
                    <div>
                    <label className="block mb-1 font-semibold">Price</label>
                    <input
                        type="number"
                        className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    </div>

                    <div>
                    <label className="block mb-1 font-semibold">Quantity</label>
                    <input
                        type="number"
                        min="1"
                        className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                    </div>
                    <div>
                    <label className="block mb-1 font-semibold">Brand</label>
                    <input
                        type="text"
                        className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    />
                    </div>

                    <div>
                    <label className="block mb-1 font-semibold">Count In Stock</label>
                    <input
                        type="number"
                        min="0"
                        className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                    />
                    </div>

                    <div>
                    <label className="block mb-1 font-semibold">Category</label>
                    <select
                        value={category}
                        className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        {categories?.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                        ))}
                    </select>
                    </div>
                </div>

                <div className="mt-6">
                    <label className="block mb-1 font-semibold">Description</label>
                    <textarea
                    rows="4"
                    className="w-full p-3 rounded-lg border border-gray-600 bg-[#101011] focus:outline-none focus:ring-2 focus:ring-green-500"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                

                <div className="flex gap-4 mt-8">
                    <button
                    onClick={handleSubmit}
                    className="flex-1 py-3 px-6 bg-green-600 hover:bg-green-700 transition rounded-lg font-semibold text-white"
                    >
                    Update Product
                    </button>
                    <button
                    onClick={handleDelete}
                    className="flex-1 py-3 px-6 bg-red-600 hover:bg-red-700 transition rounded-lg font-semibold text-white"
                    >
                    Delete Product
                    </button>
                </div>
                </div>

          </div>
        </div>
      </div>
    </>
  );
};

export default AdminProductUpdate;