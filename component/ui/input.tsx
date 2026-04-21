"use client";
import { InputProps } from "@/types/ui/input";

export const InputComp = ({ type, className, ...rest }: InputProps) => {
  return <input type={type} className={className}  />;
};
