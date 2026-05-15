import { useState, useEffect } from "react";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import {
  ImagePlus,
  Loader2,
  Tag,
  Type,
  FileText,
} from "lucide-react";

const BlogForm = ({
  type = "create",
  initialData = null,
  onSubmit,
  loading = false,
}) => {

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: null,
  });

  const [preview, setPreview] = useState("");

  // ✅ FIX: load initialData safely (NO infinite loop)
  useEffect(() => {
    if (!initialData) return;

    setFormData({
      title: initialData.title || "",
      category: initialData.category || "",
      content: initialData.content || "",
      image: null, // always reset file
    });

    setPreview(initialData.image || "");
  }, [
    initialData?.id, // 🔥 IMPORTANT FIX (prevents infinite updates)
  ]);

  // TEXT CHANGE
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // IMAGE CHANGE
  const handleImage = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      image: file,
    }));

    setPreview(URL.createObjectURL(file));
  };

  // SUBMIT
  const handleSubmit = (e) => {
  e.preventDefault();

  onSubmit({
    title: formData.title,
    category: formData.category,
    content: formData.content,
    image: formData.image,
  });
};
  return (
    <div className="max-w-5xl mx-auto">

      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight">
          {type === "create"
            ? "Create New Blog"
            : "Update Blog"}
        </h1>

        <p className="text-muted-foreground mt-3 text-lg">
          {type === "create"
            ? "Write and publish your next amazing article."
            : "Edit and improve your blog content."}
        </p>
      </div>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="space-y-8 rounded-3xl border bg-card p-6 md:p-8 shadow-sm"
      >

        {/* TITLE */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Type className="w-4 h-4" />
            Blog Title
          </label>

          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter your blog title..."
            required
            className="h-12 rounded-xl"
          />
        </div>

        {/* CATEGORY */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Tag className="w-4 h-4" />
            Category
          </label>

          <Input
            name="category"
            value={formData.category}
            onChange={handleChange}
            placeholder="Technology, AI, Programming..."
            required
            className="h-12 rounded-xl"
          />
        </div>

        {/* IMAGE */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <ImagePlus className="w-4 h-4" />
            Blog Image
          </label>

          <Input
            type="file"
            accept="image/*"
            onChange={handleImage}
            className="cursor-pointer rounded-xl"
          />

          {preview && (
            <div className="mt-4 overflow-hidden rounded-2xl border">
              <img
                src={preview}
                alt="preview"
                className="h-[300px] w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* CONTENT */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Blog Content
          </label>

          <Textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            placeholder="Write your blog content..."
            required
            className="min-h-[350px] rounded-2xl text-base leading-7"
          />
        </div>

        {/* SUBMIT */}
        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={loading}
            className="rounded-xl px-8 h-12 font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Please wait...
              </>
            ) : type === "create" ? (
              "Publish Blog"
            ) : (
              "Update Blog"
            )}
          </Button>
        </div>

      </form>
    </div>
  );
};

export default BlogForm;