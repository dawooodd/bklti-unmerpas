"use client";
import { useTheme } from "next-themes";
import { Button } from "#/base";
import { useState, useEffect } from "react";

export const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-8 h-8 p-1"></div>;
  }

  return (
    <Button
      icon={theme === "dark" ? "tabler:moon" : "tabler:sun"}
      color="transparent"
      className="p-1"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    />
  );
};
