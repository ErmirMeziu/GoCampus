import React, { createContext, useContext, useState, useEffect } from "react";
import { Appearance } from "react-native";
import { Colors } from "../constants/colors";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [userPreference, setUserPreference] = useState(null);
    const [systemTheme, setSystemTheme] = useState(Appearance.getColorScheme());

    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            setSystemTheme(colorScheme);
        });
        return () => listener.remove();
    }, []);

    const isDarkMode =
        userPreference === null ? systemTheme === "dark" : userPreference === "dark";

    const theme = isDarkMode ? Colors.dark : Colors.light;

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDarkMode,
                setUserPreference,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
};
export const toOpacity = (hex, opacity) => {
    const bigint = parseInt(hex.replace("#", ""), 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

export const useTheme = () => useContext(ThemeContext);
