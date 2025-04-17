import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TopCauses from "./pages/TopCauses";
import CauseEvolution from "./pages/CauseEvolution"; // Importation du composant CauseEvolution
import DiabetesEvolution from "./pages/DiabetesEvolution";
import TopDeathsCountry from "./pages/TopCountries";
import NonCommunicable from "./pages/NonCommunicable";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/top-causes" element={<TopCauses />} />
        <Route path="/cause-evolution" element={<CauseEvolution />} />
        <Route path="/diabetes-evolution" element={<DiabetesEvolution />} /> {/* Nouvelle route pour l'évolution du diabète */}
        <Route path="/top-deaths-country" element={<TopDeathsCountry />} />
        <Route path="/non-communicable" element={<NonCommunicable />} />
      </Routes>
    </Router>
  );
}

export default App;
