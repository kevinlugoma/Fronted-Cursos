import React, { useState } from "react";
import style from "../Tools/Style";
import { Avatar, Button, Container, TextField, Typography } from "@material-ui/core";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import { loginUsuario } from "../../actions/UsuarioAction";
import { withRouter } from "react-router-dom";
import { useStateValue } from "../../context/store";

const Login = (props) => {
    const [{ usuarioSesion }, dispatch] = useStateValue();

    const [usuario, setUsuario] = useState({
        Email: '',
        Password: ''
    });

    const ingresarValoresMemoria = e => {
        const { name, value } = e.target;
        setUsuario(anterior => ({
            ...anterior,
            [name]: value
        }));
    };

    const loginUsuarioBoton = e => {
        e.preventDefault();
        loginUsuario(usuario, dispatch).then(response => {
            if (response.status === 200) {
                window.localStorage.setItem('token_seguridad', response.data.token);
                props.history.push("/");
            } else {
                dispatch({
                    type: "OPEN_SNACKBAR",
                    openMensaje: {
                        open: true,
                        mensaje: "Las credenciales del usuario son incorrectas"
                    }
                });
            }
        });
    };

    return (
        <Container maxWidth="xs">
            <div style={style.paper}>
                <Avatar style={style.avatar}>
                    <LockOutlinedIcon style={style.icon} />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Login de Usuario
                </Typography>
                <form style={style.form}>
                    <TextField
                        name="Email"
                        value={usuario.Email}
                        onChange={ingresarValoresMemoria}
                        variant="outlined"
                        label="Ingrese Email"
                        fullWidth
                        inputProps={{ maxLength: 35 }}
                    />
                    <TextField
                        name="Password"
                        value={usuario.Password}
                        onChange={ingresarValoresMemoria}
                        variant="outlined"
                        type="password"
                        label="Password"
                        fullWidth
                        margin="normal"
                        inputProps={{ maxLength: 15 }}
                    />
                    <Button
                        type="submit"
                        onClick={loginUsuarioBoton}
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={style.submit}
                        margin="normal"
                    >
                        Enviar
                    </Button>

                    {/* Botón para registro */}
                    <Button
                        fullWidth
                        variant="outlined"
                        color="secondary"
                        style={{ marginTop: '1rem' }}
                        onClick={() => props.history.push("/auth/register")}
                    >
                        ¿No tienes cuenta? Regístrate aquí
                    </Button>
                </form>
            </div>
        </Container>
    );
};

export default withRouter(Login);