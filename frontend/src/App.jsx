import { Route, Routes } from "react-router";
import { Home } from "@/pages/Home.jsx";
import { DefaultLayout } from "@/components/layout/DefaultLayout.jsx";
import { ErrorBoundary } from "@/components/layout/ErrorBoundary.jsx";

function App() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route path="/" element={<DefaultLayout />}>
          <Route index element={<Home />} />
          <Route path="buy" element={<div>Buy</div>} />
          <Route path="rent" element={<div>Rent</div>} />
          <Route path="new-buildings" element={<div>New-buildings</div>} />
        </Route>
      </Routes>
    </ErrorBoundary>
  );
}

export default App;