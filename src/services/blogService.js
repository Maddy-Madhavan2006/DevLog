const BASE_URL = "http://localhost:5000/blogs";

// 📦 GET ALL BLOGS
export const getBlogs = async () => {
  try {
    const response = await fetch(BASE_URL);

    if (!response.ok) {
      throw new Error("Failed to fetch blogs");
    }

    return await response.json();

  } catch (error) {
    console.error("Error fetching blogs:", error);

    return [];
  }
};

// 📄 GET SINGLE BLOG
export const getSingleBlog = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/${id}`);

    if (!response.ok) {
      throw new Error("Blog not found");
    }

    return await response.json();

  } catch (error) {
    console.error("Error fetching blog:", error);

    return null;
  }
};

// ➕ CREATE BLOG
export const createBlog = async (blogData, token) => {
  try {
    const response = await fetch(BASE_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify(blogData),
    });

    if (!response.ok) {
      throw new Error("Failed to create blog");
    }

    return await response.json();

  } catch (error) {
    console.error("Error creating blog:", error);

    throw error;
  }
};

// ✏️ UPDATE BLOG
export const updateBlog = async (
  id,
  updatedData,
  token
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}`,
      {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify(updatedData),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to update blog");
    }

    return await response.json();

  } catch (error) {
    console.error("Error updating blog:", error);

    throw error;
  }
};

// ❌ DELETE BLOG
export const deleteBlog = async (
  id,
  token
) => {
  try {
    const response = await fetch(
      `${BASE_URL}/${id}`,
      {
        method: "DELETE",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to delete blog");
    }

    return await response.json();

  } catch (error) {
    console.error("Error deleting blog:", error);

    throw error;
  }
};