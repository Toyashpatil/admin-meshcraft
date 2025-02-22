import React from "react";
import Home from "../screens/Home";
import EditAsset from "../screens/EditAsset";
import EditDetails from "../screens/EditDetails";
import DeleteAsset from "../screens/DeleteAsset";
import Profile from "../screens/Profile";

const routes =[
    {
        path : "/",
        element: <Home/>,
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
export default routes;