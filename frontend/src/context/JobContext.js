import { createContext, useState, useContext } from 'react';
import { fetchUserNotifications } from '../apis/api';

const JobContext = createContext();

export function JobProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const [selectedJob, setSelectedJob] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [notificationCount, setNotificationCount] = useState(0);

    const handleSelectedJob = (job) => {
        setSelectedJob(job);
    }

    const handleAuth = (value) => {
        setIsAuthenticated(value);
    }

    const callNotificationsApi = async () => {
        try {
            const resp = await fetchUserNotifications();
            console.log("resp: ", resp);
            setNotifications(resp.notifications);
            setNotificationCount(resp.totalNotifications);
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <JobContext.Provider
            value={{
                handleSelectedJob,
                selectedJob,
                handleAuth,
                isAuthenticated,
                callNotificationsApi,
                notifications,
                notificationCount,
            }}>
            {children}
        </JobContext.Provider>
    );
}

export function useJobContext() {
    return useContext(JobContext);
}