import { useState, createContext} from "react";

export const SettingsContext = createContext();

export const SettingsContextProvider = ({ children }) => {
    const [showSettings, setShowSettings] = useState(false);
  
    return (
        <SettingsContext.Provider value={{ showSettings, setShowSettings }}>
            {children}
        </SettingsContext.Provider>
    )
};