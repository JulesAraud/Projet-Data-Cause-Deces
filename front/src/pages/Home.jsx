import { Link } from 'react-router-dom';
import './Home.css';

export default function Home() {
  return (
    <div className="home-container">
      <div className="home-box">
        <h1 className="home-title">Bienvenue sur le Dashboard de la Mortalité</h1>
        <nav>
          <ul className="link-list">
            <li>
              <Link to="/top-deaths-country" className="nav-link blue">
                🔝 Top 10 pays avec le plus grand nombre de décès (toutes causes)
              </Link>
            </li>
            <li>
              <Link to="/diabetes-evolution" className="nav-link purple">
                📈 Évolution des décès dus au diabète
              </Link>
            </li>
            <li>
              <Link to="/top-causes" className="nav-link red">
                🩺 Les 10 causes de mortalité les plus fréquentes
              </Link>
            </li>
            <li>
              <Link to="/cause-evolution" className="nav-link green">
                📊 Évolution des causes de mortalité (1990 - 2019)
              </Link>
            </li>
            <li>
              <Link to="/non-communicable" className="nav-link yellow">
                🧬 Pays les plus touchés par les maladies non transmissibles
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
