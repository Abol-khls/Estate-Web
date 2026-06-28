import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Properties from "../pages/properties/Properties";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";


export default function AppRoutes() {


    return (

        <BrowserRouter>

            <Routes>


                <Route
                    path="/"
                    element={<Login />}
                />



                <Route
                    path="/dashboard"
                    element={

                        <ProtectedRoute>

                            <Layout>

                                <Dashboard />

                            </Layout>

                        </ProtectedRoute>

                    }
                />



                <Route
                    path="/properties"
                    element={

                        <ProtectedRoute>

                            <Layout>

                                <Properties />

                            </Layout>

                        </ProtectedRoute>

                    }

                />



            </Routes>

        </BrowserRouter>

    );

}