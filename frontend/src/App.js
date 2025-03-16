import Button from '@mui/material/Button';
import RegisterScreen from './pages/RegisterScreen';
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import LoginScreen from './pages/LoginScreen';
import DocumentTitle from './components/DocumentTitle';
import Layout from './layout';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import JobsListing from './pages/JobsListing';
import ProtectedRoute from './components/ProtectedRoute';
import CreateJob from './pages/CreateJob';
import { JobProvider } from './context/JobContext';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';

function App() {
  return (
    <div>
      <DocumentTitle title="Job Board" />
      <JobProvider>
        <Layout>
          <ToastContainer />
          <Router>
            <Routes>
              <Route path="/" element={<LoginScreen />} />
              <Route path="/register" element={<RegisterScreen />} />
              <Route path="/jobs-listing" element={
                <ProtectedRoute>
                  <JobsListing />
                </ProtectedRoute>
              }
              />

              <Route path="/create-job" element={
                <ProtectedRoute>
                  <CreateJob />
                </ProtectedRoute>
              }
              />

              <Route path="/profile" element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              }
              />

              <Route path="/notifications" element={
                <ProtectedRoute>
                  <Notifications />
                </ProtectedRoute>
              }
              />
            </Routes>
          </Router>
        </Layout>
      </JobProvider>
    </div>
  );
}

export default App;
