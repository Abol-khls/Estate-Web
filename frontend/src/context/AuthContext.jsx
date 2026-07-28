import { createContext, useContext, useState, useEffect, useCallback } from "react";

import { getAccessToken, getRefreshToken, clearTokens } from "../services/tokenService";

import api from "../services/api";


const AuthContext = createContext();


export function AuthProvider({ children }) {


    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const [user, setUser] = useState(null);


    const [loading, setLoading] = useState(true);

    const fetchUser = useCallback(async () => {

        try {

            const response = await api.get(
                "me/"
            );

            setUser(
                response.data
            );

            setIsAuthenticated(true);

        } catch {

            setUser(null);

            setIsAuthenticated(false);

        }

    }, []);



    useEffect(() => {




        const initialize = async () => {

            const token = getAccessToken();

            if (token) {

                await fetchUser();
            }

            setLoading(false);

        };
        initialize();


    }, [fetchUser]);





    const login = async () => {

        await fetchUser();

    };



    const logout = async () => {

        const refresh = getRefreshToken();

        clearTokens();
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);

        if (refresh) {

            try {

                await api.post("token/blacklist/", { refresh });

            } catch {

            }

        }

    };



    return (

        <AuthContext.Provider
            value={{
                user,
                isAuthenticated,
                loading,
                login,
                logout,
                fetchUser,
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}



export function useAuth() {

    return useContext(AuthContext);

}