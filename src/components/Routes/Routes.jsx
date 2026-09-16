import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/Main";
import Pomodoro from "../Pages/Pomodoro/pomodoro";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        children: [
            {
                path: '/',
                element: <Pomodoro />
            }
        ]
    }
])

export default router;