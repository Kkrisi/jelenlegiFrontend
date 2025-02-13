import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../pages/Navigation";


export default function Layout() {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
}   