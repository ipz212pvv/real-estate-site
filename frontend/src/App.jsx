import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router";

import { Home } from "@/pages/Home.jsx";
import { Login } from "@/pages/Login.jsx";
import { Registration } from "@/pages/Registration.jsx";
import { Profile } from "@/pages/Profile.jsx";
import { ProfileAdverts } from "@/pages/ProfileAdverts.jsx";
import { ProfileAdvertsCreate } from "@/pages/ProfileAdvertsCreate.jsx";
import { ProfileAdvertsEdit } from "@/pages/ProfileAdvertsEdit.jsx";
import { Buy } from "@/pages/Buy.jsx";
import { Rent } from "@/pages/Rent.jsx";
import { SavedAdverts } from "@/pages/SavedAdverts.jsx";
import { AdvertDetails } from "@/pages/AdvertDetails.jsx";
import { AccountView } from "@/pages/AccountView.jsx";
import { NewBuildings } from "@/pages/NewBuildings.jsx";
import { NotFound } from "@/components/NotFound/NotFound.jsx";
import { AdminAdverts } from "@/pages/AdminAdverts.jsx";
import { AdminUsers } from "@/pages/AdminUsers.jsx";
import { DefaultLayout } from "@/components/layout/DefaultLayout.jsx";
import { ProfileLayout } from "@/components/layout/ProfileLayout.jsx";
import { AdminLayout } from "@/components/layout/AdminLayout.jsx";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute.jsx";

import { getUserData } from "@/store/slices/authSlice.js";
import { ROLES } from "@/config/constants.js";
import { AdminPropertyTypes } from "@/pages/AdminPropertyTypes.jsx";
import { AdminBenefits } from "@/pages/AdminBenefits.jsx";
import { AdminComplaints } from "@/pages/AdminComplaints.jsx";

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
          <Route path="rent" element={<Rent/>} />
          <Route path="new-buildings" element={<NewBuildings />} />
          <Route path="saved" element={<SavedAdverts />} />
          <Route path="adverts/:id" element={<AdvertDetails />} />
          <Route path="accounts/:id" element={<AccountView />} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
          <Route element={<ProtectedRoute roles={[ROLES.USER]}/>}>
            <Route path="profile" element={<ProfileLayout />}>
              <Route index element={<Profile />} />
              <Route path="adverts">
                <Route index element={<ProfileAdverts />}/>
                <Route path="create" element={<ProfileAdvertsCreate />}/>
                <Route path=":id/edit" element={<ProfileAdvertsEdit />}/>
              </Route>
            </Route>
          </Route>
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route element={<ProtectedRoute roles={[ROLES.ADMIN]}/>}>
          <Route element={<AdminLayout/>}>
            <Route path="admin/adverts" element={<AdminAdverts/>} />
            <Route path="admin/users" element={<AdminUsers/>} />
            <Route path="admin/property-types" element={<AdminPropertyTypes/>} />
            <Route path="admin/benefits" element={<AdminBenefits/>} />
            <Route path="admin/complaints" element={<AdminComplaints/>} />
          </Route>
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;
