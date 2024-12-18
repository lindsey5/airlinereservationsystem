import Admin from "../model/Admin.js"
import Notification from "../model/Notification.js";

export const createNotifications = async (notification) => {
    try{
        const admins = await Admin.find();
        if(admins){
            admins.forEach(async(admin) => {
                const newNotification = await Notification.create({
                    admin_id: admin._id,
                    flight: notification.flight, 
                    message: notification.message
                });
                await newNotification.save()
            })
        }

        return true
    }catch(err){
        return false
    }
}