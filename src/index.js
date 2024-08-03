import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import reportWebVitals from "./reportWebVitals";
import Home from "./Home";
import PackageTable from "./PackageTable";
import Teams from "./Teams";
import Apackage from "./Apackage";
import TeamTable from "./TeamTable";
import TeamEdit from "./TeamEdit";
import AddCategory from "./AddCategory";
import PackageEdit from "./PackageEdit";
import MemberEdit from "./EditTeamMember";
import AddTeamMember from "./AddTeamMember";
import FileUpload from "./ImportForExistingComponents";
import ViewComponents from "./ViewComponents";
import ViewComponentsAndTeams from "./ViewComponentsAndTeams";
import ViewComponentsAndTeamMember from "./ViewComponentsTeamMember";
import ViewLoggedUserComponents from "./ViewLoggedUserComponents";
import "./App.css";
//import CategoryTable from "./ViewCategory";
import "./App.css";
import ViewAssignComponent from "./ViewAssignComponent";
import AddExistingComponent from "./AddExistingComponent";
import Login from "./Login";
import Help from "./Help";
import ViewTeamMemberByTeamName from "./ViewTeamMemberByTeamName";
import GetComponentsByPackageId from "./GetComponentsByPackageId";
import BulkAddExistingComp from "./BulkAddExistingComp";
import ChangePassword from "./ChangePassword";
import Contactus from "./Contactus";
import TeamMember from "./TeamMember";
import Category from "./Category";
import AssetEdit from "./AssetEdit";
import DataContext from "./DataContext";
import Location from "./Location";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "/Home",
    element: <Home />,
  },
  {
    path: "/viewPackage",
    element: <PackageTable />,
  },
  {
    path: "/viewTeams",
    element: <Teams />,
  },
  {
    path: "/viewAllTeams",
    element: <TeamTable />,
  },
  {
    path: "/AddPackage",
    element: (
      <DataContext>
        <Apackage />
      </DataContext>
    ),
  },
  {
    path: "/TeamEdit/:id",
    element: <TeamEdit />,
  },
  {
    path: "/addTeam",
    element: <Teams />,
  },

  {
    path: "/viewTeamMemeber",
    element: <TeamMember />,
  },
  {
    path: "/addViewCategory",
    element: <Category />,
  },
  {
    path: "/addLocation",
    element: <Location />,
  },
  {
    path: "/addCategory",
    element: <AddCategory />,
  },
  {
    path: "/PackageEdit/:packageId",
    element: <PackageEdit />,
  },

  //it will get editted by component id

  {
    path: "/AssetEdit/:componentId",
    element: <AssetEdit />,
  },
  {
    path: "/MemberEdit/:memberId",
    element: <MemberEdit />,
  },
  {
    path: "/addTeamMember",
    element: <AddTeamMember />,
  },
  {
    path: "/viewassignComponent",
    element: <ViewAssignComponent />,
  },
  {
    path: "/viewComponents",
    element: <ViewComponents />,
  },
  {
    path: "/viewComponentsAndTeams/:pid",
    element: <ViewComponentsAndTeams />,
  },
  {
    path: "/viewComponentsTeamMember/:teamName/:pid",
    element: <ViewComponentsAndTeamMember />,
  },
  {
    path: "/viewLoggedUserComponents",
    element: <ViewLoggedUserComponents />,
  },
  {
    path: "/addExistingComponent",
    element: <BulkAddExistingComp />,
  },

  {
    path: "/Help",
    element: <Help />,
  },
  {
    path: "/ViewTeamMemberByTeamName/",
    element: <ViewTeamMemberByTeamName />,
  },
  {
    path: "/ImportExistingComponent",
    element: (
      <DataContext>
        <FileUpload />
      </DataContext>
    ),
  },
  {
    path: "/GetComponentsByPackageId/:packageId",
    element: <GetComponentsByPackageId />,
  },
  {
    path: "/ChangePassword",
    element: <ChangePassword />,
  },
  {
    path: "/Contactus",
    element: <Contactus />,
  },
]);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<RouterProvider router={router} />);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
