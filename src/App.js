import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashBoard';
import UserDashboard from './pages/UserDashboard';
import Login from './pages/Login';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" index={true} element={<Login />} />
        <Route path="/admindashboard/:id" element={<AdminDashboard />} />
        <Route path="/userdashboard/:id" element={<UserDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
