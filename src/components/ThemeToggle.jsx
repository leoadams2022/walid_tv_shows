import React from "react";

import { ToggleSwitch } from "flowbite-react";

const ThemeToggle = () => {
  const [theme, setTheme] = React.useState(localStorage?.theme || "");
  const toggleTheme = () => {
    if (!document.documentElement.classList.contains("dark")) {
      setTheme("dark");
      localStorage.setItem("theme", "dark");
      document.documentElement.setAttribute("data-color-mode", "dark");
    } else {
      setTheme("light");
      localStorage.setItem("theme", "light");
      document.documentElement.setAttribute("data-color-mode", "light");
    }
    setTimeout(() => {
      document.documentElement.classList.toggle("dark");
    }, 300);
  };

  React.useEffect(() => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      if (!document.documentElement.classList.contains("dark"))
        document.documentElement.classList.add("dark");
      if (document.documentElement.classList.contains("light"))
        document.documentElement.classList.remove("light");
      document.documentElement.setAttribute("data-color-mode", "dark");
      if (theme !== "dark") setTheme("dark");
    } else {
      if (document.documentElement.classList.contains("dark"))
        document.documentElement.classList.remove("dark");
      if (!document.documentElement.classList.contains("light"))
        document.documentElement.classList.add("light");
      document.documentElement.setAttribute("data-color-mode", "light");
      if (theme !== "light") setTheme("light");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToggleSwitch
      checked={theme === "dark"}
      label="Dark/Light Mode"
      onChange={toggleTheme}
      className="text-nowrap"
    />
  );
};

export default ThemeToggle;
