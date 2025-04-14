import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router";

import { Home } from "@/pages/Home.jsx";
import { Login } from "@/pages/Login.jsx";
import { Registration } from "@/pages/Registration.jsx";
import { Profile } from "@/pages/Profile.jsx";
import { ProfileAdverts } from "@/pages/ProfileAdverts.jsx";
import { ProfileAdvertsCreate } from "@/pages/ProfileAdvertsCreate.jsx";
import { Buy } from "@/pages/Buy.jsx";
import { DefaultLayout } from "@/components/layout/DefaultLayout.jsx";
import { ProfileLayout } from "@/components/layout/ProfileLayout.jsx";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute.jsx";

import { getUserData } from "@/store/slices/authSlice.js";
import { ROLES } from "@/config/constants.js";

function App() {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);

  useEffect(() => {
    if (token) {
      dispatch(getUserData());
    }
  }, [])

  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="buy" element={<Buy/>} />
          <Route path="rent" element={<div>Rent</div>} />
          <Route path="new-buildings" element={<div>New-buildings</div>} />
          <Route element={<ProtectedRoute roles={[ROLES.USER]}/>}>
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<Profile />} />
              <Route path="adverts">
                <Route index element={<ProfileAdverts />}/>
                <Route path="create" element={<ProfileAdvertsCreate />}/>
              </Route>
            </Route>
          </Route>
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;