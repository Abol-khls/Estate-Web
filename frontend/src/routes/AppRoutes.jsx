import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Properties from "../pages/properties/Properties";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";

import PropertyForm from "../pages/properties/PropertyForm";

import PropertyDetail from "../pages/properties/PropertyDetail";

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

                <Route
                    path="/properties/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <PropertyForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/properties/:id"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <PropertyDetail />
                            </Layout>
                        </ProtectedRoute>
                    }
                />



            </Routes>

        </BrowserRouter>

    );

}