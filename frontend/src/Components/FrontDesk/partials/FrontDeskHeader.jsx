import { useContext } from "react";
import { SideBarContext } from "../../../Context/sideBarContext";

const FrontDeskHeader = () => {
    const { setShowSideBar } = useContext(SideBarContext);

    return (
        <header className="admin-header">
            <div className='logo-container'>
                <button onClick={() => setShowSideBar(prev => !prev)}><img src="/icons/burger-bar.png" alt="" /></button>
                <img src="/icons/tcu_airlines-logo (2).png"/>
                <h3>Front Desk <span>Agent</span></h3>
            </div>
        </header>
    )

} 

export default FrontDeskHeader;