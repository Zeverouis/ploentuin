import React, {createContext, useState, useEffect} from "react";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [loggedIn, setLoggedIn] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [currentUserId, setCurrentUserId] = useState(null);
    const [isBanned, setIsBanned] = useState(false);
    const [currentUserEmail, setCurrentUserEmail] = useState(null);
    const [currentUserAvatar, setCurrentUserAvatar] = useState(null);
    const [currentUsername, setCurrentUsername] = useState(null);

    const token = localStorage.getItem('token');

    function logout() {
        localStorage.removeItem('token');
        setLoggedIn(false);
        setCurrentUserId(null);
        setCurrentUsername(null);
        setUserRole(null);
        setCurrentUserAvatar(null);
        setIsBanned(false);
        setCurrentUserEmail(null);

    }

        useEffect(() => {
            const validateToken = async () => {
                if (!token) {
                    logout();
                    return;
                }
                try {
                    const response = await fetch('http://localhost:8080/users/me', {
                        method: 'GET',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    });

                    if (response.ok) {
                        const jsonResponse = await response.json();
                        setLoggedIn(true);

                        if (jsonResponse.data) {
                            setUserRole(jsonResponse.data.role);
                            setCurrentUserId(jsonResponse.data.id);
                            setIsBanned(jsonResponse.data.banned);
                            setCurrentUsername(jsonResponse.data.username);
                            setCurrentUserEmail(jsonResponse.data.email);
                            setCurrentUserAvatar(jsonResponse.data.avatarUrl);
                        }
                    } else {
                        logout();
                    }
                } catch (error) {
                    console.error("Token validation failed: ", error);
                    logout();
                }
            };

            validateToken();
        }, [token]);

        const contextData = {
            loggedIn,
            setLoggedIn,
            currentUserId,
            currentUserEmail,
            currentUserAvatar,
            currentUsername,
            isBanned,
            userRole,
            logout,
            token
        };

        return (
            <AuthContext.Provider value={contextData}>
                {children}
            </AuthContext.Provider>
        )
}

export default AuthProvider