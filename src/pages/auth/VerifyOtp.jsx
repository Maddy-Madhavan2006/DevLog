import { useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";


const VerifyOtp = () => {

  const [otp, setOtp] = useState("");

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const location = useLocation();

  // 📧 GET EMAIL FROM REGISTER PAGE
  const email = location.state?.email;


  const handleVerifyOtp = async (e) => {

    e.preventDefault();

    if (!otp) {
      return alert("Please enter OTP");
    }

    try {

      setLoading(true);

      const response = await fetch(

        `${import.meta.env.VITE_API_URL}/auth/verify-otp`,

        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      // 💾 SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      // 💾 SAVE USER
      localStorage.setItem(
        "user",
        JSON.stringify(data.user)
      );

      alert(
        "Account verified successfully"
      );

      // ✅ REDIRECT
      navigate("/");

    } catch (error) {

      console.error(error);

      alert(
        error.message ||
        "Verification failed"
      );

    } finally {

      setLoading(false);

    }
  };


  return (

    <div
      className="
        min-h-screen
        flex
        items-center
        justify-center
        bg-gray-100
        px-4
      "
    >

      <div
        className="
          bg-white
          p-8
          rounded-2xl
          shadow-lg
          w-full
          max-w-md
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-center
            mb-2
          "
        >
          Verify OTP
        </h1>

        <p
          className="
            text-gray-500
            text-center
            mb-6
          "
        >
          Enter the OTP sent to your email
        </p>

        <form
          onSubmit={handleVerifyOtp}
          className="space-y-4"
        >

          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) =>
              setOtp(e.target.value)
            }
            className="
              w-full
              border
              rounded-lg
              p-3
              outline-none
              focus:ring-2
              focus:ring-black
            "
          />

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-black
              text-white
              py-3
              rounded-lg
              hover:opacity-90
              transition
            "
          >

            {
              loading
                ? "Verifying..."
                : "Verify OTP"
            }

          </button>

        </form>

      </div>

    </div>
  );
};

export default VerifyOtp;