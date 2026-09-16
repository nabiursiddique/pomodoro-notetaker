import { createBrowserRouter } from "react-router-dom";
import Main from "../../layout/Main";
import Pomodoro from "../Pages/Pomodoro/pomodoro";
import NoteTaking from "../Pages/noteTaking/NoteTaking";
import Schedule from "../Pages/Schedule/Schedule";


const router = createBrowserRouter([
    {
        path: '/',
        element: <Main />,
        children: [
            {
                path: '/',
                element: <Pomodoro />
            },
            {
                path: '/note',
                element: <NoteTaking />
            },
            {
                path: '/schedule',
                element: <Schedule />
            }
        ]
    }
])

export default router;