import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import { AuthProvider } from "./components/auth/AuthContext";
import Signup from "./components/auth/Signup"
import Login from "./components/auth/Login"
import Logout from "./components/auth/Logout";
import Dashboard from "./components/subscriptions/Home"
import ProtectedRoute from "./components/auth/ProtectedRoute"
import SubscriberDetails from "./components/subscriptions/SubscriberDetails";
import Layout from './components/Layout'


export default function App() {
  return (
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Layout>
                    <Dashboard />
                    </Layout>
                  </ProtectedRoute>
                }/>
              <Route
                path="/subscriber/:id"
                element={
                  <ProtectedRoute>
                    <Layout>
                      <SubscriberDetails />
                    </Layout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/signup"
                element={
                  <ProtectedRoute>
                    <Signup />
                  </ProtectedRoute>
                }/>
              <Route
                path="/logout"
                element={
                <ProtectedRoute>
                  <Layout>
                    <Logout />
                  </Layout>
                </ProtectedRoute>
                }
              />
              <Route path="*" element={<Login />} />
          </Routes>
        </Router>
      </AuthProvider>
  )
}

