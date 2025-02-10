import React, { useEffect, useState } from "react";
import style from "../Tools/Style";
import {
  Button,
  Container,
  TextField,
  Typography,
  Grid,
  Avatar,
} from "@material-ui/core";
import {
  actualizarUsuario,
  obtenerUsuarioActual,
} from "../../actions/UsuarioAction";
import { useStateValue } from "../../context/store";
import reactFoto from "../../logo.svg";
import { v4 as uuidv4 } from "uuid";
import ImageUploader from "react-images-upload"
import { obtenerDataImagen } from "../../actions/ImagenAction";

const PerfilUsuario = () => {
  const [{ sesionUsuario }, dispatch] = useStateValue();
  const [usuario, setUsuario] = useState({
    nombreCompleto: "",
    email: "",
    password: "",
    confirmarPassword: "",
    username: "",
    imagenPerfil : null,
    fotoUrl : ""
  });

  const [errores, setErrores] = useState({
    nombreCompleto: "",
    username: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });

  const ingresarValoresMemoria = (e) => {
    const { name, value } = e.target;
    // Validaciones para cada campo
    switch (name) {
      case "nombreCompleto":
        if (/^[a-zA-Z\s]*$/.test(value)) {
          if (value.length <= 50) {
            setUsuario((anterior) => ({
              ...anterior,
              [name]: value,
            }));
            setErrores((prev) => ({ ...prev, [name]: "" }));
          } else {
            setErrores((prev) => ({
              ...prev,
              [name]: "Máximo 50 caracteres permitidos.",
            }));
          }
        } else {
          setErrores((prev) => ({
            ...prev,
            [name]: "Solo se permiten letras y espacios.",
          }));
        }
        break;

      case "username":
          if (value.length <= 20) {
            setUsuario((anterior) => ({
              ...anterior,
              [name]: value,
            }));
            setErrores((prev) => ({ ...prev, [name]: "" }));
          } else {
            setErrores((prev) => ({
              ...prev,
              [name]: "Máximo 20 caracteres permitidos.",
            }));
          }
        
        break;

      case "email":
        if (value.length <= 50) {
          setUsuario((anterior) => ({
            ...anterior,
            [name]: value,
          }));
          setErrores((prev) => ({ ...prev, [name]: "" }));
        } else {
          setErrores((prev) => ({
            ...prev,
            [name]: "Ingrese un correo electrónico válido.",
          }));
        }
        break;

      case "password":
        if (value.length >= 8 && value.length <= 20) {
          setUsuario((anterior) => ({
            ...anterior,
            [name]: value,
          }));
          setErrores((prev) => ({ ...prev, [name]: "" }));
        } else {
          setErrores((prev) => ({
            ...prev,
            [name]: "La contraseña debe tener entre 8 y 20 caracteres.",
          }));
        }
        break;

      case "confirmarPassword":
        if (value === usuario.password) {
          setUsuario((anterior) => ({
            ...anterior,
            [name]: value,
          }));
          setErrores((prev) => ({ ...prev, [name]: "" }));
        } else {
          setErrores((prev) => ({
            ...prev,
            [name]: "Las contraseñas no coinciden.",
          }));
        }
        break;

      default:
        break;
    }
  };

  useEffect(() => {

    setUsuario(sesionUsuario.usuario);
    setUsuario(anterior => ({
        ...anterior,
        fotoUrl : sesionUsuario.usuario.imagenPerfil,
        imagenPerfil : null
    }))
  }, []);

  const guardarUsuario = (e) => {
    e.preventDefault();
    actualizarUsuario(usuario, dispatch).then((response) => {
      if (response.status === 200) {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje: "Se guardaron exitosamente los cambios en Perfil Usuario",
          },
        });
        window.localStorage.setItem("token_seguridad", response.data.token);
      } else {
        dispatch({
          type: "OPEN_SNACKBAR",
          openMensaje: {
            open: true,
            mensaje:
              "Errores al intentar guardar en : " +
              Object.keys(response.data.errors),
          },
        });
      }
    });
  };

  const subirFoto = imagenes =>{
    const foto = imagenes[0];
    const fotoUrl = URL.createObjectURL(foto);

    obtenerDataImagen(foto).then(respuesta => {
        console.log("respuesta" , respuesta)
        setUsuario(anterior => ({
            ...anterior,
            imagenPerfil : respuesta, //respuesta es un json que proviene del action obtener imagen
            fotoUrl : fotoUrl //el archivo en formato URL
        }));
    })

    
  }

  const fotoKey = uuidv4()

  return (
    <Container component="main" maxWidth="md" justify="center">
      <div style={style.paper}>
        <Avatar
        style={style.avatar}
        src={usuario.fotoUrl || reactFoto}>

        </Avatar>
        <Typography component="h1" variant="h5">
          Perfil de Usuario
        </Typography>

        <form style={style.form}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={12}>
              <TextField
                name="nombreCompleto"
                value={usuario.nombreCompleto}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="Ingrese nombre y apellidos"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="username"
                value={usuario.username}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="Ingrese Username"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="email"
                value={usuario.email}
                onChange={ingresarValoresMemoria}
                variant="outlined"
                fullWidth
                label="Ingrese email"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="password"
                value={usuario.password}
                onChange={ingresarValoresMemoria}
                type="password"
                variant="outlined"
                fullWidth
                label="Ingrese password"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                name="confirmarPassword"
                value={usuario.confirmarPassword}
                onChange={ingresarValoresMemoria}
                type="password"
                variant="outlined"
                fullWidth
                label="Confirme password"
              />
            </Grid>
            <Grid item xs={12} md={12}>
                <ImageUploader
                withIcon={false}
                key={fotoKey}
                singleImage={true}
                buttonText="Seleccione una imagen de Perfil"
                onChange={subirFoto}
                imgExtension={[".jpg",".gif",".png",".jpeg"]}
                maxFileSize={5242880}
                />
            </Grid>
          </Grid>
          <Grid container justify="center">
            <Grid item xs={12} md={6}>
              <Button
                type="submit"
                onClick={guardarUsuario}
                fullWidth
                variant="contained"
                size="large"
                color="primary"
                style={style.submit}
              >
                Guardar Datos
              </Button>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default PerfilUsuario;
