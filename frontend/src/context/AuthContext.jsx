import { useState, useEffect, useCallback } from "react";

import { clearAccessToken } from "../services/tokenService";

import api, { refreshAccessToken } from "../services/api";

import { AuthContext } from "./authContextValue";


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

            try {

                await refreshAccessToken();

                await fetchUser();

            } catch {

                setUser(null);
                setIsAuthenticated(false);

            }

            setLoading(false);

        };
        initialize();


    }, [fetchUser]);





    const login = async () => {

        await fetchUser();

    };



    const logout = async () => {

        clearAccessToken();
        setUser(null);
        setIsAuthenticated(false);
        setLoading(false);

        await api.post("token/logout/").catch(() => null);

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