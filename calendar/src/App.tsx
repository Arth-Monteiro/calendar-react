import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { TODAY, dateToISOString } from "./helpers/dateHelpers";
import CalendarPage from "./pages/CalendarPage";

export default function App() {
  const period = dateToISOString(TODAY).substring(0, 7);
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate key={period} to={"/calendar/" + period} replace />} />
        <Route path="/calendar/:period" element={<CalendarPage />} />
        {/* <Route path="users/*" element={<Users />} /> */}
      </Routes>
    </BrowserRouter>
  );
}
