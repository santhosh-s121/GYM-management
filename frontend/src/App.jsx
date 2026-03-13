import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Members from "./pages/Members";
import Trainers from "./pages/Trainers";
import Equipment from "./pages/Equipment";
import Payments from "./pages/Payments";
import Attendance from "./pages/Attendance";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="members" element={<Members />} />
                    <Route path="trainers" element={<Trainers />} />
                    <Route path="equipment" element={<Equipment />} />
                    <Route path="payments" element={<Payments />} />
                    <Route path="attendance" element={<Attendance />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
