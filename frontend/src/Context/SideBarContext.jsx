import { useState, createContext} from "react";

export const SideBarContext = createContext();

export const SideBarContextProvider = ({ children }) => {
    const [showSideBar, setShowSideBar] = useState(false);
  
    return (
        <SideBarContext.Provider value={{ showSideBar, setShowSideBar }}>
            {children}
        </SideBarContext.Provider>
    )
};