import {
    createContext,
    useContext,
    useState,
    useEffect
} from "react";

import {
    getAccessToken,
    clearTokens
} from "../services/tokenService";


const AuthContext = createContext();


export function AuthProvider({ children }) {


    const [isAuthenticated, setIsAuthenticated] =
        useState(false);


    const [loading, setLoading] =
        useState(true);



    useEffect(() => {


        const token = getAccessToken();


        if(token){

            setIsAuthenticated(true);

        }


        setLoading(false);


    }, []);



    const login = () => {

        setIsAuthenticated(true);

    };



    const logout = () => {

        clearTokens();

        setIsAuthenticated(false);

    };



    return (

        <AuthContext.Provider
            value={{
                isAuthenticated,
                loading,
                login,
                logout
            }}
        >

            {children}

        </AuthContext.Provider>

    );

}



export function useAuth(){

    return useContext(AuthContext);

}