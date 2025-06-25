import { useState, useEffect } from "react";
import "./Navbar.css";
import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobilePagesOpen, setMobilePagesOpen] = useState(false);

  const { loginWithRedirect, isAuthenticated, logout, user } = useAuth0();
  const navigate = useNavigate();

  const pages = ["Courses", "Communities", "AI Assistant", "Study Plan"];
  const settings = ["Profile", "Logout"];
  const services = ["Development", "Design"];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
    setServicesOpen(false);
    setUserMenuOpen(false);
  };

  // Toggle services dropdown
  const toggleServices = (e) => {
    e.stopPropagation();
    setServicesOpen(!servicesOpen);
    setUserMenuOpen(false);
  };

  // Toggle user menu
  const toggleUserMenu = (e) => {
    e.stopPropagation();
    setUserMenuOpen(!userMenuOpen);
    setServicesOpen(false);
  };

  // Toggle mobile pages dropdown
  const toggleMobilePages = () => {
    setMobilePagesOpen(!mobilePagesOpen);
  };

  // Close all menus when clicking outside
  useEffect(() => {
    const closeMenus = (e) => {
      if (!e.target.closest(".user-menu-container")) setUserMenuOpen(false);
      if (!e.target.closest(".dropdown-container")) setServicesOpen(false);
    };
    document.addEventListener("click", closeMenus);
    return () => document.removeEventListener("click", closeMenus);
  }, []);

  // Handle navigation
  const handleNavigation = (path) => {
    // Close menus
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
    setServicesOpen(false);
    // Navigate to path
    navigate(path);
  };

  // Logout handler
  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin
      }
    });
  };

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        {/* Logo */}
        <Link to="/" className="navbar-logo" onClick={() => handleNavigation('/')}>
          <span className="ai-highlight">AI</span> LMS
        </Link>

        {/* Mobile menu button */}
        <div className="mobile-menu-button" onClick={toggleMobileMenu}>
          <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className={`navbar-links ${mobileMenuOpen ? "open" : ""}`}>
          {pages.map((page) =>
            page === "Services" ? (
              <div key={page} className="dropdown-container">
                <button className="nav-link dropdown-trigger" onClick={toggleServices}>
                  {page}
                  <span className={`dropdown-arrow ${servicesOpen ? "open" : ""}`}>&#9662;</span>
                </button>
                <div className={`dropdown-menu ${servicesOpen ? "open" : ""}`}>
                  {services.map((service) => (
                    <Link 
                      key={service} 
                      to={`/services/${service.toLowerCase()}`} 
                      className="dropdown-item"
                      onClick={() => handleNavigation(`/services/${service.toLowerCase()}`)}
                    >
                      {service}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link 
                key={page} 
                to={`/${page.toLowerCase().replace(" ", "")}`} 
                className="nav-link"
                onClick={() => handleNavigation(`/${page.toLowerCase().replace(" ", "")}`)}
              >
                {page}
              </Link>
            )
          )}
        </div>

        {/* User section */}
        <div className="navbar-user">
          {/* User avatar */}
          <div className="user-menu-container">
            {isAuthenticated ? (
              <Button className="user-avatar" onClick={toggleUserMenu}>
                <img
                  src={user?.picture || "https://via.placeholder.com/40"}
                  alt="User"
                  className="user-avatar"
                />
              </Button>
            ) : (
              <Button
                onClick={loginWithRedirect}
                sx={{
                  backgroundColor: "rgb(9, 238, 9)",
                  color: "white",
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                  textTransform: "none",
                  fontWeight: "800",
                }}
              >
                Login
              </Button>
            )}
            {/* Dropdown for user settings */}
            <div className={`user-dropdown ${userMenuOpen ? "open" : ""}`}>
              {settings.map((setting) =>
                setting === "Logout" ? (
                  <button key={setting} className="dropdown-item" onClick={handleLogout}>
                    {setting}
                  </button>
                ) : (
                  <Link 
                    key={setting} 
                    to={`/${setting.toLowerCase()}`} 
                    className="dropdown-item"
                    onClick={() => handleNavigation(`/${setting.toLowerCase()}`)}
                  >
                    {setting}
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
        <div className="mobile-menu-container">
          {pages.map((page) => (
            <Link 
              key={page} 
              to={`/${page.toLowerCase().replace(" ", "")}`} 
              className="mobile-nav-link"
              onClick={() => handleNavigation(`/${page.toLowerCase().replace(" ", "")}`)}
            >
              {page}
            </Link>
          ))}
          
          {/* Mobile user section */}
          <div className="mobile-user-settings">
            {isAuthenticated ? (
              <>
                {settings.map((setting) => 
                  setting === "Logout" ? (
                    <button 
                      key={setting} 
                      className="mobile-nav-link" 
                      onClick={() => {
                        toggleMobileMenu();
                        handleLogout();
                      }}
                    >
                      {setting}
                    </button>
                  ) : (
                    <Link 
                      key={setting} 
                      to={`/${setting.toLowerCase()}`} 
                      className="mobile-nav-link"
                      onClick={() => handleNavigation(`/${setting.toLowerCase()}`)}
                    >
                      {setting}
                    </Link>
                  )
                )}
              </>
            ) : (
              <Button
                onClick={() => {
                  toggleMobileMenu();
                  loginWithRedirect();
                }}
                fullWidth
                sx={{
                  backgroundColor: "rgb(9, 238, 9)",
                  color: "white",
                  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif",
                  textTransform: "none",
                  fontWeight: "800",
                  padding: "10px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                Login
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
