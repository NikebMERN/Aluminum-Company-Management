import { createContext, useContext, useState } from "react";
import { toast } from "react-hot-toast";

export const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const [notifications, setNotifications] = useState([]);

    const notifySuccess = (msg) => {
        toast.success(msg);
        setNotifications((prev) => [...prev, { type: "success", msg }]);
    };

    const notifyError = (msg) => {
        toast.error(msg);
        setNotifications((prev) => [...prev, { type: "error", msg }]);
    };

    return (
        <NotificationContext.Provider
            value={{
                notifications,
                notifySuccess,
                notifyError,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}

export const useNotification = () => useContext(NotificationContext);
