import { useState } from "react";
import { useFormErrors } from "../hooks/useFormErrors";

export const useBookForm = (editingBook, onSubmit) => {
  const [formData, setFormData] = useState({
    title: editingBook?.title || "",
    author: editingBook?.author || "",
    genre: editingBook?.genre || "",
    isbn: editingBook?.isbn || "",
    total_copies: editingBook?.total_copies || 0,
    available_copies: editingBook?.available_copies,
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    editingBook?.image_url || null
  );

  // Use the custom error handling hook
  const { fieldErrors, clearErrors, handleApiError } = useFormErrors({
    title: "title",
    author: "author",
    genre: "genre",
    isbn: "isbn",
    total_copies: "total_copies",
    available_copies: "available_copies",
    image: "image",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file, error) => {
    if (error) {
      handleApiError({
        response: {
          data: {
            errors: {
              image: [error],
            },
          },
        },
      });
      return;
    }

    setSelectedImage(file);

    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }

    // Clear any previous image errors
    clearErrors();
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setImagePreview(null);
    // Clear the file input
    const fileInput = document.getElementById("image-upload");
    if (fileInput) {
      fileInput.value = "";
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      genre: "",
      isbn: "",
      total_copies: "",
      available_copies: "",
    });
    setSelectedImage(null);
    setImagePreview(null);
    clearErrors();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const bookData = {
        ...formData,
        total_copies: parseInt(formData.total_copies),
        available_copies: parseInt(formData.available_copies),
      };

      // If there's a selected image, add it to the form data
      if (selectedImage) {
        bookData.image = selectedImage;
      }

      await onSubmit(bookData);
      resetForm();
    } catch (err) {
      // Use the custom error handler
      handleApiError(err);
    }
  };

  return {
    formData,
    selectedImage,
    imagePreview,
    fieldErrors,
    handleInputChange,
    handleImageChange,
    handleImageRemove,
    handleSubmit,
    resetForm,
  };
};
