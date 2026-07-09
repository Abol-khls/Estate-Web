import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/common/Loading";
import PageContainer from "../components/common/PageContainer";


export default function ProtectedRoute({
    children
}) {


    const {
        isAuthenticated,
        loading
    } = useAuth();



    if(loading){

        return (
            <PageContainer>
                <Loading />
            </PageContainer>
        );

    }



    if(!isAuthenticated){

        return (
            <Navigate
                to="/"
                replace
            />
        );

    }



    return children;

}