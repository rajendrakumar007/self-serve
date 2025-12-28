import { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

  useEffect(() => {
    // Keep a `dark` class on <html> so Tailwind 'dark:' and global CSS rules can apply
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div
        className={
          theme === "dark"
            ? "bg-secondary text-textInverted min-h-screen"
            : "bg-bgBase text-textPrimary min-h-screen"
        }
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};
