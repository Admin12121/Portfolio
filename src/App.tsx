import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/home";
import Blog from "./pages/blog";

function App() {
  const routes = useMemo(
    () => (
      <Routes>
        <Route index element={<Home />} />
        <Route path="/blog" element={<Blog />} />
      </Routes>
    ),
    []
  );

  return <>{routes}</>;
}

export default App;
