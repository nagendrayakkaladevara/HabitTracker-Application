import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
// import PrivateRoute from "./utils/PrivateRoute";

function App() {

  return (
    <>
      <Router>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/home" element={<Home />} />
            <Route path="/analytics" element={<Analytics />} />

            <Route path="*" element={<Login />} />

            {/* <Route element={<PrivateRoute />}>
              <Route path="/" element={<Home />} />
            </Route> */}

            {/* Add other routes as needed */}
          </Routes>
        </AuthProvider>
      </Router>
    </>
  )
}

export default App