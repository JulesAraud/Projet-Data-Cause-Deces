import { Link } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <h1 className="logo">Mortalité Dashboard</h1>
        <div className="nav-links">
          <Link to="/">Accueil</Link>
          <Link to="/top-causes">Top Causes</Link>
          <Link to="/cause-evolution">Évolution</Link>
          <Link to="/diabetes-evolution">Diabète</Link>
          <Link to="/top-deaths-country">Top Pays</Link>
          <Link to="/non-communicable">Non Transmissibles</Link>
        </div>
      </div>
    </nav>
  );
}
