// src/pages/Callback.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const success = params.get("success");
    const token = params.get("token");

    if (success === "true" && token) {
      // ✅ Save token in localStorage
      localStorage.setItem("authToken", token);

      // Clean up URL
      const cleanUrl = window.location.origin + "/dashboard";
      window.history.replaceState({}, document.title, cleanUrl);

      // Redirect to dashboard
      navigate("/dashboard");
    } else {
      // ❌ Login failed — go back to login
      navigate("/login");
    }
  }, [navigate]);

  return null; // You could show a loader or spinner here
};

export default Callback;
