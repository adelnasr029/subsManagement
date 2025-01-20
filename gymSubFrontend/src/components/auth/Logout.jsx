import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
// import { AuthContext } from "./AuthContext"; 

const Logout = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // const { setIsAuthenticated } = useContext(AuthContext);
  const navigate = useNavigate();
  const handleLogout = async () => {

    try {
      const response = await fetch("http://localhost:5174/logout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials:"include",
      });
      if (response.ok) {
        window.location.href = '/login'
      }
    } catch(error){
      console.error('Error during logout:', error);
    }
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      {/* Overlay */}
      <div className="overlay"></div>

      {/* Popup */}
      <div className="confirmation-modal">
        <h2>Are you sure you want to log out?</h2>
        <div className="button-container">
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
          <button className="confirm" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Logout;