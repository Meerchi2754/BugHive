"use client";
import { useEffect, useState } from "react";


export function useDebouncing<T>(value: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState<T>();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, value]);

  return debounceValue!;
}
