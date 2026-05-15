import { useState } from "react";

import { useNavigate } from "react-router-dom";

import BlogForm from "@/components/custom/BlogForm";

import toast from 'react-hot-toast';


const AddBlog = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const user =
    JSON.parse(localStorage.getItem("user") || "null");

  const token = localStorage.getItem("token");


  // 🔐 AUTH CHECK
  if (!user) {

    return (
      <div className="py-32 text-center">

        <h1 className="text-4xl font-bold">
          Login Required
        </h1>

        <p className="text-muted-foreground mt-4">
          You must login to create blogs.
        </p>

      </div>
    );
  }


  // ✅ CREATE BLOG
  const handleCreateBlog = async (formData) => {

    try {

      setLoading(true);

      // 🔥 FORM DATA
      const blogData = new FormData();

      blogData.append("title", formData.title);

      blogData.append("category", formData.category);

      blogData.append("content", formData.content);

      blogData.append("image", formData.image);


      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/blogs`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`,
          },

          body: blogData,
        }
      );


      if (!response.ok) {
        throw new toast.error("Failed to create blog");
      }


      const data = await response.json();

      console.log("Blog created:", data);

      toast.success("Blog created successfully ✅");

      navigate("/blogs");

    } catch (error) {

      console.error(error);

      toast.error("Failed to create blog ❌");

    } finally {

      setLoading(false);
    }
  };


  return (
    <section className="py-16 px-4">

      <BlogForm
        type="create"
        onSubmit={handleCreateBlog}
        loading={loading}
      />

    </section>
  );
};


export default AddBlog;