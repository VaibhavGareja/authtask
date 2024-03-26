import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import SignUp from "./components/SignUp.jsx";
import Login from "./components/Login.jsx";
import store from "./store/authStore.js";
import Dashboard from "./components/Dashboard.jsx";
import ResetPassword from "./components/ResetPassword.jsx";
import VerifyEmail from "./components/VerifyEmail.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <SignUp />,
      },
      {
        path: "/verify/:token",
        element: <VerifyEmail />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/dashboard",
        element: <ProtectedRoute element={<Dashboard />} />,
      },
      {
        path: "/reset-password/:token",
        element: <ProtectedRoute element={<ResetPassword />} />,
      },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
