import { createContext, useContext, useState, useEffect, useCallback } from "react";

import { clearAccessToken } from "../services/tokenService";

import api, { refreshAccessToken } from "../services/api";


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

        try {

            await api.post("token/logout/");

        } catch {

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