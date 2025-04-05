import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router";

import { Home } from "@/pages/Home.jsx";
import { Login } from "@/pages/Login.jsx";
import { Registration } from "@/pages/Registration.jsx";
import { DefaultLayout } from "@/components/layout/DefaultLayout.jsx";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";

import { getUserData } from "@/store/slices/authSlice.js";

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
          <Route path="buy" element={<div>Buy</div>} />
          <Route path="rent" element={<div>Rent</div>} />
          <Route path="new-buildings" element={<div>New-buildings</div>} />
          <Route path="login" element={<Login />} />
          <Route path="registration" element={<Registration />} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;