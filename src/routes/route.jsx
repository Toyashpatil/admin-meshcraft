import EditDetails from "../screens/EditDetails";
import DeleteAsset from "../screens/DeleteAsset";
import Profile from "../screens/Profile";
import Home from "../screens/Home"
import EditAsset from "../screens/EditAsset"
import LoginPage from "../screens/Login";
import Layout from '../screens/Layout'

const routes = [
    {
      path: "/",
      element: <LoginPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      element: <Layout />, // This wraps all protected routes with sidebar
      children: [
        {
          path: "/addassets",
          element: <Home />,
        },
        {
          path: "/editassets",
          element: <EditAsset />,
        },
        {
          path: "/editassets/editdetails",
          element: <EditDetails />,
        },
        {
          path: "/deleteassets",
          element: <DeleteAsset />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
  ];
export default routes
   