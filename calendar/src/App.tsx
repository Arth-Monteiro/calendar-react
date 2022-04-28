import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import CalendarPage from "./pages/CalendarPage";
import LoginPage from "./pages/LoginPage";

import { TODAY, dateToISOString } from "./helpers/dateHelpers";
import { apiCheckAuthUser, apiMakeLogout } from "./services/apiService";
import IUser from "./interfaces/IUser";

export default function App() {
  const period = dateToISOString(TODAY).substring(0, 7);

  const [user, setUser] = useState<IUser | null>(null);

  useEffect(() => {
    (async () => {
      const user = await apiCheckAuthUser();
      setUser(user);
    })();
  }, []);

  async function handleSignOut() {
    if (await apiMakeLogout()) setUser(null);
  }

  if (user) {
    return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate key={period} to={"/calendar/" + period} replace />} />
          <Route
            path="/calendar/:period"
            element={<CalendarPage user={user} onSignOut={handleSignOut} />}
          />
          {/* <Route path="users/*" element={<Users />} /> */}
        </Routes>
      </BrowserRouter>
    );
  }
  return <LoginPage onSignIn={setUser} />;
}
