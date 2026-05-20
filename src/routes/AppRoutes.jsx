import { Routes, Route } from "react-router-dom";

import MainLayout from "@/Layouts/MainLayout";

import Home from "@/pages/Home";
import Blogs from "@/pages/Blogs";
import SingleBlog from "@/pages/SingleBlog";
import About from "@/pages/About";
import Contact from "@/pages/Contact";

import AddBlog from "@/pages/AddBlog";
import EditBlog from "@/pages/EditBlog";

import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import VerifyOtp from "@/pages/auth/VerifyOtp";

const AppRoutes = () => {
  return (
    <Routes>

      <Route element={<MainLayout />}>

        <Route path="/" element={<Home />} />

        <Route path="/blogs" element={<Blogs />} />

        <Route path="/blog/:id" element={<SingleBlog />} />

        <Route path="/blog/edit/:id" element={<EditBlog />} />

        <Route path="/add-blog" element={<AddBlog />} />

        <Route path="/about" element={<About />} />

        <Route path="/contact" element={<Contact />} />

        {/* AUTH ROUTES */}

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp"element={<VerifyOtp />}/>

      </Route>

    </Routes>
  );
};

export default AppRoutes;