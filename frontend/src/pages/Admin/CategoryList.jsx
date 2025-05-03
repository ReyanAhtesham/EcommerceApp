import { useState } from "react";
import {
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useFetchCategoriesQuery,
} from "../../redux/api/categoryApiSlice";

import { toast } from "react-toastify";
import CategoryForm from "../../components/CategoryForm";
import Modal from "../../components/Modal";
import AdminMenu from "./AdminMenu";

const CategoryList = () => {
  const { data: categories, refetch } = useFetchCategoriesQuery();  // Get refetch here
  const [name, setName] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatingName, setUpdatingName] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();


  const handleCreateCategory = async (e) => {
    e.preventDefault();
    if (!name) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await createCategory({ name }).unwrap();
      result.error
        ? toast.error(result.error)
        : toast.success(`${result.name} is created.`);
      setName("");
      refetch();  // Refetch the categories after creation
    } catch (error) {
      console.error(error);
      toast.error("Creating category failed, try again.");
    }
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    if (!updatingName) {
      toast.error("Category name is required");
      return;
    }

    try {
      const result = await updateCategory({
        categoryId: selectedCategory._id,
        updatedCategory: { name: updatingName },
      }).unwrap();

      result.error
        ? toast.error(result.error)
        : toast.success(`${result.name} is updated`);
      setSelectedCategory(null);
      setUpdatingName("");
      setModalVisible(false);
      refetch();  // Refetch categories after updating
    } catch (error) {
      console.error(error);
    }
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setUpdatingName(category.name);
    setModalVisible(true);
    setConfirmingDelete(true);
  
  };

  const handleDeleteCategory = async () => {
    
    const confirmed = window.confirm(
      `Are you sure you want to delete the category "${selectedCategory.name}"?\n\nThis will also delete associated product(s).`
    );
  
    if (!confirmed) return;
  
    try {
      const result = await deleteCategory(selectedCategory._id).unwrap();
      result.error
        ? toast.error(result.error)
        : toast.success(`${selectedCategory.name} is deleted.`);
  
      setSelectedCategory(null);
      setModalVisible(false);
      setConfirmingDelete(false);
      refetch();  // Refetch categories after deletion
    } catch (error) {
      console.error(error);
      toast.error("Category deletion failed. Try again.");
    }
  };

  return (
    <div className="ml-[10rem] flex flex-col md:flex-row">
      <AdminMenu />
      <div className="md:w-3/4 p-3">
        <div className="h-12 text-lg font-semibold">Manage Categories</div>

        <CategoryForm
          value={name}
          setValue={setName}
          handleSubmit={handleCreateCategory}
        />
        <br />
        <hr />

        <div className="flex flex-wrap">
          {categories?.map((category) => (
            <div key={category._id}>
              <button
                className="bg-white/5 cursor-pointer border border-pink-500 text-pink-500 py-2 px-4 rounded-lg m-3 hover:bg-pink-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50"
                onClick={() => {
                  setModalVisible(true);
                  setSelectedCategory(category);
                  setUpdatingName(category.name);
                  setConfirmingDelete(false);
                }}
                onContextMenu={(e) => {
                  e.preventDefault();
                  confirmDelete(category); // right-click triggers delete confirmation
                }}
                title="Left-click to edit, right-click to delete"
              >
                {category.name}
              </button>
            </div>
          ))}
        </div>

        <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
        <CategoryForm
          value={updatingName}
          setValue={(value) => setUpdatingName(value)}
          handleSubmit={handleUpdateCategory}
          buttonText="Update"
          handleDelete={handleDeleteCategory} // ← Always pass this
        />
      </Modal>
      </div>
    </div>
  );
};

export default CategoryList;
