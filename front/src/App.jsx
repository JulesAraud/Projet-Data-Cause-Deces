import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TopCauses from "./pages/TopCauses";
import CauseEvolution from "./pages/CauseEvolution";
import DiabetesEvolution from "./pages/DiabetesEvolution";
import TopDeathsCountry from "./pages/TopCountries";
import NonCommunicable from "./pages/NonCommunicable";
import Navbar from "./components/Navbar";
import "./App.css"; 

function App() {
  return (
    <Router>
      
      <div className="main-container">
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/top-causes" element={<TopCauses />} />
          <Route path="/cause-evolution" element={<CauseEvolution />} />
          <Route path="/diabetes-evolution" element={<DiabetesEvolution />} />
          <Route path="/top-deaths-country" element={<TopDeathsCountry />} />
          <Route path="/non-communicable" element={<NonCommunicable />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
