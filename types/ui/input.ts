import { MotionProps } from "motion/react";

export interface InputProps extends MotionProps {
  type?: "button" | "submit" | "reset";
  className?: string;
}
