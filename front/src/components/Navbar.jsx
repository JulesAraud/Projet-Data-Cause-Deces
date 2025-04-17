import { Link } from 'react-router-dom';

const Navbar = () => (
  <nav style={{ padding: '1rem', background: '#222', color: '#fff' }}>
    <Link to="/" style={{ marginRight: 10 }}>Accueil</Link>
    <Link to="/top-countries" style={{ marginRight: 10 }}>Top Pays</Link>
    <Link to="/top-causes" style={{ marginRight: 10 }}>Top Causes</Link>
    <Link to="/diabetes-evolution" style={{ marginRight: 10 }}>Évolution Diabète</Link>
    <Link to="/cause-evolution" style={{ marginRight: 10 }}>Évolution Causes</Link>
    <Link to="/non-communicable">Maladies Non Transmissibles</Link>
  </nav>
);

export default Navbar;
