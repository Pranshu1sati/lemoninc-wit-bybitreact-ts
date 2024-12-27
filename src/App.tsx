import { Route, Routes } from "react-router-dom";
import Layout from "./Components/Layout";
import Products from "./Pages/Products";
import AddProducts from "./Pages/AddProducts";
import NotFound from "./Pages/NotFound";
// function Home() {
//   return (
//     <>
//       <h1 className="">Home</h1>
//     </>
//   );
// }

function App() {
  return (
    <main className="w-full min-h-screen ">
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Products />} />
          <Route path="/add" element={<AddProducts />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </main>
  );
}

export default App;
