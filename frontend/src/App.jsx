import { lazy, Suspense, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router";

const Home = lazy(() => import("@/pages/Home.jsx"));
const Login = lazy(() => import("@/pages/Login.jsx"));
const Registration = lazy(() => import("@/pages/Registration.jsx"));
const Profile = lazy(() => import("@/pages/Profile.jsx"));
const ProfileAdverts = lazy(() => import("@/pages/ProfileAdverts.jsx"));
const ProfileAdvertsCreate = lazy(() => import("@/pages/ProfileAdvertsCreate.jsx"));
const ProfileAdvertsEdit = lazy(() => import("@/pages/ProfileAdvertsEdit.jsx"));
const Buy = lazy(() => import("@/pages/Buy.jsx"));
const Rent = lazy(() => import("@/pages/Rent.jsx"));
const SavedAdverts = lazy(() => import("@/pages/SavedAdverts.jsx"));
const AdvertDetails = lazy(() => import("@/pages/AdvertDetails.jsx"));
const AccountView = lazy(() => import("@/pages/AccountView.jsx"));
const NewBuildings = lazy(() => import("@/pages/NewBuildings.jsx"));
const AdminAdverts = lazy(() => import("@/pages/AdminAdverts.jsx"));
const AdminUsers = lazy(() => import("@/pages/AdminUsers.jsx"));
const AdminPropertyTypes = lazy(() => import("@/pages/AdminPropertyTypes.jsx"));
const AdminBenefits = lazy(() => import("@/pages/AdminBenefits.jsx"));
const AdminComplaints = lazy(() => import("@/pages/AdminComplaints.jsx"));

import { DefaultLayout } from "@/components/layout/DefaultLayout.jsx";
import { ProfileLayout } from "@/components/layout/ProfileLayout.jsx";
import { AdminLayout } from "@/components/layout/AdminLayout.jsx";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";
import { ProtectedRoute } from "@/components/ProtectedRoute/ProtectedRoute.jsx";
import { Loading } from "@/components/common/Loading/Loading.jsx";
import { NotFound } from "@/components/NotFound/NotFound.jsx";

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
      <Suspense fallback={<Loading />}>
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
              <Route path="admin/adverts/:id/edit" element={<ProfileAdvertsEdit />} />
              <Route path="admin/users" element={<AdminUsers/>} />
              <Route path="admin/property-types" element={<AdminPropertyTypes/>} />
              <Route path="admin/benefits" element={<AdminBenefits/>} />
              <Route path="admin/complaints" element={<AdminComplaints/>} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
