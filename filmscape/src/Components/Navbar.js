import { NavLink, useNavigate } from "react-router-dom";
import logomain2 from "../images/logo1.png";
import "../css/Navbar.css";
function Navbar({ isLoggedIn }) {
    const navigate = useNavigate();
  return (
    <div className="navmain">
      <img src={logomain2} alt="Logo" onClick={() => window.location.href = "/index"} style={{ cursor: "pointer" }} />
      <h2>Filmscape</h2>
      <div className="navitems">
        <ul>
          <li>
            <NavLink to={"/scripts"} activeClassName="active">Script</NavLink>
          </li>
          <li>
            <NavLink to={"/"} activeClassName="active">Contact</NavLink>
          </li>
          <li>
            <NavLink to={"/"} activeClassName="active">About Us</NavLink>
          </li>
          <li>
            <NavLink to={"/"} activeClassName="active">Storyboard</NavLink>
          </li>
          {isLoggedIn ? (
            <button onClick={() => navigate("/dashboard")}>Dashboard</button>
          ) : (
            <button onClick={() => navigate("/login")}>Get Started</button>
          )}
        </ul>
      </div>
    </div>
  );
}
export default Navbar;
