import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import logomain2 from "../images/logo1.png";
import "../css/Navbar.css";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebaseConfig";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen,setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useAuth();
  // Prevent default behavior for logo click and use navigate instead
  const handleLogoClick = (e) => {
    e.preventDefault();
    navigate("/");
  };
  const logOut = async () => {
    try {
      await auth.signOut();
      setIsLoggedIn(false);
      localStorage.removeItem("isLoggedIn");
      navigate("/");
    } catch (error) {
      alert("Error Signing out!", error);
    }
  };
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="navmain">
      <img
        src={logomain2}
        alt="Logo"
        onClick={handleLogoClick}
        style={{ cursor: "pointer" }}
      />
      <h2>Filmscape</h2>
      <div className="mobile-menu-toggle" onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`navitems ${menuOpen ? 'active' : ''}`}>
        <ul>
          <li>
            <NavLink to="/scripts">Script</NavLink>
          </li>
          <li>
            <NavLink to="/contact">Contact</NavLink>
          </li>
          <li>
            <NavLink to="/storyboard">Storyboard</NavLink>
          </li>
          <li id="log">
            <span onClick={()=> logOut()}>Logout</span>
          </li>
          <li>
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
