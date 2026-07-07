import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "../styles/home.css";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNavbar, setShowNavbar] = useState(false); // State to toggle navbar visibility
  const navigate = useNavigate();

  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (error) {
          console.error("Error parsing user data:", error);
        }
      } else {
        setUser(null);
      }
    };

    window.addEventListener("userUpdated", handleStorageChange);
    handleStorageChange();

    return () => {
      window.removeEventListener("userUpdated", handleStorageChange);
    };
  }, []);

  const logout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    setUser(null);
    window.dispatchEvent(new Event("userUpdated"));
    navigate("/");
  };

  return (
    <nav className="nav">
      <Link to="/" className="nav-links">
        <div className="nav-links" style={{ fontWeight: "700" }}>
          ROOM EASE
        </div>
      </Link>
      <div
        className={`hamburger ${showNavbar ? "open" : ""}`}
        onClick={() => setShowNavbar(!showNavbar)}
      >
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`nav-events ${showNavbar ? "active" : ""}`}>
        <Link to="/ramkrishna/meets" className="nav-links">
          <div>Events & Meets</div>
        </Link>
        <Link to="/ramkrishna/reviews" className="nav-links">
          <div>Reviews</div>
        </Link>
        <Link
          to="/ramkrishna/lodging/rooms"
          className="nav-links"
          style={{
            backgroundColor: "#c69963",
            padding: "8px 16px",
            color: "#141c24ff",
          }}
        >
          <div>Book Now</div>
        </Link>

        <div className="nav-links login-container">
          <div
            className="nav-links"
            style={{
              position: "relative",
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span className="material-symbols-outlined">account_circle</span>
            {user ? (
              <span
                className="user-name"
                style={{ cursor: "pointer" }}
                onMouseEnter={() => setShowDropdown(true)}
                onMouseLeave={() => setShowDropdown(false)}
              >
                {user.GuestFName}
              </span>
            ) : (
              <Link
                to="/ramkrishna/verify/login"
                className="nav-links"
                style={{ cursor: "pointer" }}
              >
                Login
              </Link>
            )}
          </div>

          {showDropdown && (
            <div
              className="dropdown-menu"
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              {user ? (
                <>
                  <Link
                    to="/ramkrishna/lodging/yourbookings"
                    className="dropdown-item"
                  >
                    Your Bookings
                  </Link>
                  <button onClick={logout} className="dropdown-item logout-btn">
                    Logout
                  </button>
                </>
              ) : (
                ""
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
