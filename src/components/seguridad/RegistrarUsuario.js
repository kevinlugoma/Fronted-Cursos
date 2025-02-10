import {
    Button,
    Container,
    Grid,
    TextField,
    Typography
  } from "@material-ui/core";
  import Alert from "@material-ui/lab/Alert";
  import React, { useState, useRef, useEffect } from "react";
  import style from "../Tools/Style";
  import { registrarUsuario } from "../../actions/UsuarioAction";
  import { useHistory } from "react-router-dom";
  
  const RegistrarUsuario = () => {
    const history = useHistory();
    const [usuario, setUsuario] = useState({
      NombreCompleto: "",
      Email: "",
      Password: "",
      ConfirmarPassword: "",
      Username: "",
    });
  
    const [error, setError] = useState(null);
    const timeoutRef = useRef(null);
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validación de email
  
    useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);
  
    const ingresarValoresMemoria = (e) => {
      const { name, value } = e.target;
      setUsuario((anterior) => ({
        ...anterior,
        [name]: value,
      }));
    };
  
    const validarFormulario = () => {
      if (!emailRegex.test(usuario.Email)) {
        setError("Ingrese un correo electrónico válido");
        return false;
      }
      
      if (usuario.Password !== usuario.ConfirmarPassword) {
        setError("Las contraseñas no coinciden");
        return false;
      }
  
      if (!usuario.NombreCompleto || !usuario.Email || !usuario.Username || !usuario.Password) {
        setError("Todos los campos son obligatorios");
        return false;
      }
  
      return true;
    };
  
    const registrarUsuarioBoton = (e) => {
      e.preventDefault();
      setError(null);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
  
      if (!validarFormulario()) {
        timeoutRef.current = setTimeout(() => setError(null), 5000);
        return;
      }
  
      registrarUsuario(usuario)
        .then((response) => {
          window.localStorage.setItem("token_seguridad", response.data.token);
          history.push("/");
        })
        .catch((error) => {
          const mensajeError = error.response?.data?.mensaje || 
            error.response?.data?.errors?.Email?.[0] || 
            "Error al registrar el usuario";
          setError(mensajeError);
          timeoutRef.current = setTimeout(() => setError(null), 5000);
        });
    };
  
    return (
      <Container component="main" maxWidth="md" justify="center">
        <div style={style.paper}>
          <Typography component="h1" variant="h5">
            Registro de Usuario
          </Typography>
          <form style={style.form}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  name="NombreCompleto"
                  value={usuario.NombreCompleto}
                  onChange={ingresarValoresMemoria}
                  variant="outlined"
                  fullWidth
                  label="Nombre completo"
                  inputProps={{ maxLength: 50 }}
                  required
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  name="Email"
                  value={usuario.Email}
                  onChange={ingresarValoresMemoria}
                  variant="outlined"
                  fullWidth
                  label="Correo electrónico"
                  type="email"
                  inputProps={{ maxLength: 50 }}
                  required
                  error={!!error && error.includes("correo")}
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  name="Username"
                  value={usuario.Username}
                  onChange={ingresarValoresMemoria}
                  variant="outlined"
                  fullWidth
                  label="Nombre de usuario"
                  inputProps={{ maxLength: 20 }}
                  required
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  name="Password"
                  value={usuario.Password}
                  onChange={ingresarValoresMemoria}
                  type="password"
                  variant="outlined"
                  fullWidth
                  label="Contraseña"
                  inputProps={{ 
                    maxLength: 20,
                    minLength: 6 
                  }}
                  required
                />
              </Grid>
  
              <Grid item xs={12} md={6}>
                <TextField
                  name="ConfirmarPassword"
                  value={usuario.ConfirmarPassword}
                  onChange={ingresarValoresMemoria}
                  type="password"
                  variant="outlined"
                  fullWidth
                  label="Confirmar contraseña"
                  inputProps={{ 
                    maxLength: 20,
                    minLength: 6 
                  }}
                  required
                />
              </Grid>
            </Grid>
  
            <Grid container justify="center">
              <Grid item xs={12} md={6}>
                <Button
                  type="submit"
                  onClick={registrarUsuarioBoton}
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  style={style.submit}
                >
                  Registrarse
                </Button>
  
                {error && (
                  <div style={{ marginTop: 16, width: '100%' }}>
                    <Alert severity="error">{error}</Alert>
                  </div>
                )}
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    );
  };
  
  export default RegistrarUsuario;