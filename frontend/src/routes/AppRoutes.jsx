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

import Settings from "../pages/settings/Settings";

import PublicProperties from "../pages/public/PublicProperties";
import PublicPropertyDetail from "../pages/public/PublicPropertyDetail";

import NotFound from "../pages/errors/NotFound";
import Forbidden from "../pages/errors/Forbidden";
import SessionExpired from "../pages/errors/SessionExpired";

export default function AppRoutes() {


    return (

        <BrowserRouter>

            <Routes>


                <Route
                    path="/"
                    element={<PublicProperties />}
                />

                <Route
                    path="/property/:id"
                    element={<PublicPropertyDetail />}
                />

                <Route
                    path="/admin/login"
                    element={<Login />}
                />



                <Route
                    path="/admin/dashboard"
                    element={

                        <ProtectedRoute>

                            <Layout>

                                <Dashboard />

                            </Layout>

                        </ProtectedRoute>

                    }
                />



                <Route
                    path="/admin/properties"
                    element={

                        <ProtectedRoute>

                            <Layout>

                                <Properties />

                            </Layout>

                        </ProtectedRoute>

                    }

                />

                <Route
                    path="/admin/properties/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <PropertyForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/properties/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <PropertyForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/properties/:id"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <PropertyDetail />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/clients"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Customers />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/clients/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CustomerForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/clients/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <CustomerForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/contracts"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Contracts />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/contracts/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ContractForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/contracts/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ContractForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/visits"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Visits />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/visits/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <VisitForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/visits/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <VisitForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/activities"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Activities />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/activities/create"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ActivityForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/activities/:id/edit"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <ActivityForm />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/settings"
                    element={
                        <ProtectedRoute>
                            <Layout>
                                <Settings />
                            </Layout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/forbidden"
                    element={<Forbidden />}
                />

                <Route
                    path="/session-expired"
                    element={<SessionExpired />}
                />

                <Route
                    path="*"
                    element={<NotFound />}
                />

            </Routes>

        </BrowserRouter>

    );

}