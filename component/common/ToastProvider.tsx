"use client";
import { ToastContainer, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useTheme } from "@/context/themeContext";

export default function ToastProvider() {
  const { theme } = useTheme();

  return (
    <ToastContainer
      position="top-right"
      autoClose={2400}
      hideProgressBar
      newestOnTop
      closeOnClick
      rtl={false}
      pauseOnFocusLoss={false}
      draggable={false}
      pauseOnHover
      theme={theme === "dark" ? "dark" : "light"}
      transition={Slide}
    />
  );
}
