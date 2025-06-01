import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import './App.css';
import TreasureForm from './components/TreasureForm';
import HistoryPage from './components/HistoryPage';
import HistoryDetail from './components/HistoryDetail';
function App() {
  return (
    <Router>
    <div style={{ padding: "1rem" }}>
      <nav style={{ marginBottom: "1rem" }}>
        <Link to="/" style={{ marginRight: "1rem" }}>🏝 Nhập dữ liệu</Link>
        <Link to="/history">📜 Lịch sử</Link>
      </nav>
      <Routes>
        <Route path="/" element={<TreasureForm />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/history/:id" element={<HistoryDetail />} />

      </Routes>
    </div>
  </Router>
  );
}

export default App;
