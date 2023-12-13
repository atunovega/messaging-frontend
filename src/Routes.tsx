import React from "react";
import {
    createBrowserRouter,
    Navigate,
    RouterProvider,
} from "react-router-dom";

const LoginForm = React.lazy(() => import("./LoginForm"));
const RegistrationForm = React.lazy(
    () => import("./RegistrationForm")
);
const ChatWindow = React.lazy(() => import("./ChatWindow"));


export const PUBLIC_ROUTES = {
    LOGIN: "login",
    REGISTER: "register",
};

export const PRIVATE_ROUTES = {
    CHAT_WINDOW: "chat-window"
};
const RedirectToPrivateRegister = () => <Navigate to="/private-register" />;

const ProtectedRoute = ({ isAuth, redirectPath = "/login", children }: any) => {
    if (!isAuth) {
        return <Navigate to={redirectPath} replace />;
    }
    return children;
};
const Routes = () => {

    const token = localStorage.getItem("token");
    const router = createBrowserRouter([

        {
            path: PUBLIC_ROUTES.LOGIN,
            element: <LoginForm />,
        },
        {
            path: "/",
            element: <LoginForm />,
        },
        {
            path: PUBLIC_ROUTES.REGISTER,
            element: <RegistrationForm />,
        },

        {
            path: PRIVATE_ROUTES.CHAT_WINDOW,
            element: <ChatWindow />,
        },
    ]);
    return <RouterProvider router={router} />;
};

export default Routes;
