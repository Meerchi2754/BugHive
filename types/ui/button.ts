import { MotionProps } from "motion/react";
import { Ref } from "react";

export interface ButtonProps extends MotionProps {
  icon?: React.ReactNode;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
  className?: string;
  text?: string;
  disabled?: boolean;
  id?: string;
  ref?: Ref<HTMLButtonElement>;
}
