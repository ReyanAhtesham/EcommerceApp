import { Outlet } from "react-router-dom";
import Navigation from "./pages/Auth/Navigation";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer />
      <Navigation />
      <main className="bg-gradient-to-br from-neutral-900 to-neutral-950 text-white min-h-screen">
        <Outlet />
      </main>
    </>
  );
};

export default App;