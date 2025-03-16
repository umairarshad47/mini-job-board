import React, { useEffect, useState } from 'react';
import { Redirect, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { verifyTokenApi } from '../apis/api';
import { useJobContext } from '../context/JobContext';

const ProtectedRoute = ({ children }) => {
    const navigate = useNavigate();
    const { handleAuth } = useJobContext();
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        // check authentication status
        const checkAuth = async () => {
            try {

                const response = await verifyTokenApi();

                // token found and valid
                if (response.status === 200) {
                    setIsAuthenticated(true);
                    handleAuth(true);
                } else if (response.status === 401 || response.status === 403) {
                    // token not found or invalid
                    setIsAuthenticated(false);
                    handleAuth(false);
                }
            } catch (error) {
                // if token is expired or invalid
                setIsAuthenticated(false);
                handleAuth(false);
            }
        };

        checkAuth();
    }, []);

    if (isAuthenticated === null) {
        return;
    }

    // if user is authenticated render the childrens
    if (isAuthenticated) {
        return children;
    }

    // if user is not authenticated redirect to login screen
    navigate('/');

    return null;
};

export default ProtectedRoute;