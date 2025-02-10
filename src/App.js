import React, { useEffect, useState } from 'react';
import {Grid, MuiThemeProvider, Snackbar} from '@material-ui/core';
import theme from './theme/theme';
import RegistrarUsuario from './components/seguridad/RegistrarUsuario';
import Login from './components/seguridad/Login';
import PerfilUsuario from './components/seguridad/PerfilUsuario';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import AppNavbar from './components/navegacion/AppNavbar';
import { useStateValue } from './context/store';
import { obtenerUsuarioActual } from './actions/UsuarioAction';
import RutaSegura from './components/navegacion/RutaSegura';
import NuevoCurso from './components/cursos/NuevoCurso';
import PaginadoCurso from './components/cursos/PaginadorCurso';

function App() {
  const [{sesionUsuario, openSnackbar}, dispatch] = useStateValue();

  const [iniciaApp, setIniciaApp] = useState(false);

  useEffect(() =>{
    if(!iniciaApp){
      obtenerUsuarioActual(dispatch).then(response =>{
        setIniciaApp(true);
      }).catch(error => {
        setIniciaApp(true);
      })
    }
  },[iniciaApp])

  return iniciaApp === false ? null : (
    <React.Fragment>
    <Snackbar 
      anchorOrigin={{ vertical:"bottom",horizontal:"center" }}
      open={openSnackbar ? openSnackbar.open : false}
      autoHideDuration={3000}
      ContentProps={{"aria-describedby": "message-id"}}
      message = {
        <span id='message-id'>{openSnackbar ? openSnackbar.mensaje : ""}</span>
      }
      onClose={() => 
        dispatch({
          type : "OPEN_SNACKBAR",
          openMensaje : {
            open : false,
            mensaje : ""
          }
        })
      }
    >

    </Snackbar>
    <Router>
     <MuiThemeProvider theme={theme}>
      <AppNavbar/>
       <Grid container>
          <Switch>
            <Route exact path="/" component={PerfilUsuario}/>
            <Route exact path="/auth/login" component={Login}/>
            <Route exact path="/auth/register" component={RegistrarUsuario}/>

            <RutaSegura
              exact
              path="/auth/perfil"
              component={PerfilUsuario}
            />

            <RutaSegura
              exact
              path="/"
              component={PerfilUsuario}
            />

            <RutaSegura
            exact
            path="/curso/nuevo"
            component={NuevoCurso}
            />

            <RutaSegura
            exact
            path="/curso/paginador"
            component={PaginadoCurso}
            />
          </Switch>
       </Grid>
     </MuiThemeProvider>
    </Router>
    </React.Fragment>
  );
}

export default App;
