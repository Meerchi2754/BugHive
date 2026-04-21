"use client";
import { ToastContainer } from "react-toastify";

export default function ToastProvider() {
  return <ToastContainer position="top-center" closeOnClick autoClose={2000} />;
}
