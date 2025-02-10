import { AppBar } from "@material-ui/core";
import React from "react";
import BarSesion from "./bar/BarSesion";
import { useStateValue } from "../../context/store";

const AppNavbar = () => {
    const [{sesionUsuario},dispatch] = useStateValue();

    return sesionUsuario
    ? (sesionUsuario.autenticado === true ? <AppBar position="static"><BarSesion/></AppBar> : null)
    : null;
}

export default AppNavbar;