import { createRoot } from 'react-dom/client'
import './index.css'
import React from "react"
import {RouterProvider, createHashRouter, Outlet} from "react-router-dom"
import Home from "../routes/Home.jsx";
import About from "../routes/About.jsx";

const router = createHashRouter([
    {
        path: '/',
        element:
        <>
            <div>
                <a href={"#/"}>Home</a>
                <a href={"#/about"}>About</a>
            </div>
            <h1>Pokedeks - Nikolai Balck</h1>
            <Outlet />
        </>,
        children: [
            {
                index: true,
                element: <Home />
            },
            {
                path: "about",
                element: <About />
            }
        ]
    }
])

const root = createRoot(document.getElementById('root'));

root.render(
    <RouterProvider router={router} />
)
