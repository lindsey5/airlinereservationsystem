import { Outlet } from "react-router-dom"
import UserHeader from "../Components/User/Partials/UserHeader"
import ChatBotInterface from "../Pages/UserPage/ChatBotInterface"
import { SettingsContext, SettingsContextProvider } from "../Context/SettingsContext"
import Settings from "../Components/User/Modals/Settings"
export default function UserLayout() {

    return(
        <SettingsContextProvider>
            <main className="user-page">
                <UserHeader />
                <SettingsContext.Consumer>
                {value => 
                   (value.showSettings && <Settings />)
                }
                </SettingsContext.Consumer>
                <Outlet />
                <ChatBotInterface />
            </main>
        </SettingsContextProvider>
    )
}