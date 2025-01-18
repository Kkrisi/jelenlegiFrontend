import React from "react";
import { Outlet } from "react-router-dom";
import Navigation from "../pages/Navigation";


export default function VendegLayout() {
    return (
        <>
            <Navigation />
            <Outlet />
        </>
    );
}