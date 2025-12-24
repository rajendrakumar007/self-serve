import { createContext, useState } from "react";

export const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("dark");

  const toggleTheme = () => {
    setTheme(prev => (prev === "dark" ? "light" : "dark"));
  };

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
