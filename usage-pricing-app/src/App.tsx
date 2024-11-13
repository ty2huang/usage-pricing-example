import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Login from './components/Login';
import Layout from './components/Layout';
import Activity from './components/Activity';
import Dashboard from './components/Dashboard';
import PrivateRoute from './components/PrivateRoute';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route index element={<Navigate to="/activity" replace />} />
            <Route path="activity" element={<Activity />} />
            <Route path="dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;