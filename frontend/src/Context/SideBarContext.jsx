import { useState, createContext} from "react";

export const SideBarContext = createContext();

export const SideBarContextProvider = ({ children }) => {
    const [showSideBar, setShowSideBar] = useState(true);
  
    return (
        <SideBarContext.Provider value={{ showSideBar, setShowSideBar }}>
            {children}
        </SideBarContext.Provider>
    )
};