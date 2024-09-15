import AuthPage from "./Components/AuthPage/AuthPage";
import AdminDashboard from "./Components/Dashboard/AdminDashboard";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

function App() {
  return (
    <Router>
      <Routes>
        {" "}
        <Route path="/" element={<AuthPage />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />{" "}
      </Routes>
    </Router>
  );
}

export default App;
