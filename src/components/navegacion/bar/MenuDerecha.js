import { Avatar, List, ListItem, ListItemText } from "@material-ui/core";
import React from "react";
import {Link} from "react-router-dom"
import fotoUsuarioTemp from "../../../logo.svg";

export const MenuDerecha = ({
    classes,
    usuario,
    salirSesionApp
}) => {
    return(
        <div className={classes.list}>
            <List>
                <ListItem button component={Link}>  
                    <Avatar src={usuario.imagenPerfil || fotoUsuarioTemp }/>
                    <ListItemText classes={{primary:classes.listItemText}} primary={usuario ? usuario.nombreCompleto : ""}/>
                </ListItem>
                <ListItem button onClick={salirSesionApp}>
                    <ListItemText classes={{primary:classes.listItemText}} primary="Salir"/>
                </ListItem>
            </List>
        </div>
    )
};