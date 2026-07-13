import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "../pages/auth/Login";
import Dashboard from "../pages/dashboard/Dashboard";
import Properties from "../pages/properties/Properties";

import ProtectedRoute from "./ProtectedRoute";
import Layout from "../components/layout/Layout";

import PropertyForm from "../pages/properties/PropertyForm";

import PropertyDetail from "../pages/properties/PropertyDetail";

import Customers from "../pages/customers/Customers";
import CustomerForm from "../pages/customers/CustomerForm";

import Contracts from "../pages/contracts/Contracts";
import ContractForm from "../pages/contracts/ContractForm";

import Visits from "../pages/visits/Visits";
import VisitForm from "../pages/visits/VisitForm";

import Activities from "../pages/activities/Activities";
import ActivityForm from "../pages/activities/ActivityForm";

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
                    path="/properties/:id/edit"
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

                <Route
                    path="/clients"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Customers />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CustomerForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/clients/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CustomerForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Contracts />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ContractForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contracts/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ContractForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/visits"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Visits />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/visits/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <VisitForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/visits/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <VisitForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/activities"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Activities />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/activities/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ActivityForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/activities/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ActivityForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

            </Routes>

        </BrowserRouter>

    );

}