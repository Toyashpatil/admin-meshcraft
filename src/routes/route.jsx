import EditDetails from "../screens/EditDetails";
import DeleteAsset from "../screens/DeleteAsset";
import Profile from "../screens/Profile";
import Home from "../screens/Home"
import EditAsset from "../screens/EditAsset"
import LoginPage from "../screens/Login";


const routes =[
    {
        path : "/",
        element: <Home/>,
    },
    {
        path : "/login",
        element: <LoginPage/>,
    },
    
    {
        path : "/addassets",
        element: <Home/>,
    },
    {
        path : "/editassets",
        element: <EditAsset/>,
    },
    {
        path : "/editassets/editdetails",
        element: <EditDetails/>,
    },
    {
        path : "/deleteassets",
        element: <DeleteAsset/>,
    },
    {
        path : "/profile",
        element: <Profile/>,
    },
];

export default routes
   