import React, { useEffect, useState } from "react";
import { paginacionCurso } from "../../actions/CursoAction";
import { Paper, TableBody, TableContainer, TableHead, Table, TableRow, TableCell, TablePagination, Hidden, Grid, TextField } from "@material-ui/core";
import ControlTyping from "../Tools/ControlTyping";

const PaginadoCurso = () => {

    const [textoBusquedaCurso, setTextoBusquedaCurso] = useState("");
    const typingBuscadorTexto = ControlTyping(textoBusquedaCurso, 900);

    const [paginadorRequest, setPaginadorRequest] =useState({
        titulo : "",
        numeroPagina : 0,
        cantidadElementos : 5
    })

    const [paginadorResponse, setPaginadorResponse] = useState({
        listaRecords : [],
        totalRecords : 0,
        numeroPaginas: 0
    })

    useEffect( () =>{

        const obtenerListaCurso = async() =>{
            let tituloVariant = "";
            let paginaVariant = paginadorRequest.numeroPagina + 1;
                
            if(typingBuscadorTexto){
                tituloVariant = typingBuscadorTexto;
                paginaVariant = 1
            }
    
            const objetoPaginadorRequest = {
                titulo : tituloVariant,
                numeroPagina : paginaVariant,
                cantidadElementos :paginadorRequest.cantidadElementos
            }
            const response = await paginacionCurso(objetoPaginadorRequest);
            setPaginadorResponse(response.data);
        }

        obtenerListaCurso();

    },[paginadorRequest, typingBuscadorTexto]);

    const cambiarPagina = (event, nuevaPagina) => {
        setPaginadorRequest((anterior) => ({
            ...anterior,
            numeroPagina : parseInt(nuevaPagina)
        }))
    }

    const cambiarCantidadRecords = (event) => {
        setPaginadorRequest((anterior) => ({
            ...anterior,
            cantidadElementos : parseInt(event.target.value),
            numeroPagina : 0
        }))
    }

    const handleChangeBusqueda = (e) => {
        const inputValue = e.target.value;

        // Validar que solo se ingresen letras, números y espacios
        if (/^[a-zA-Z0-9\s]*$/.test(inputValue)) {
            // Limitar el número de caracteres a 50
            if (inputValue.length <= 50) {
                setTextoBusquedaCurso(inputValue);
            }
        }
    };

    return(
        <div style={{padding:"10px", width:"100%"}}>
            <Grid container style={{paddingTop:"20px",paddingBottom:"20px"}}>
                <Grid item xs={12} sm={4} md={6}>
                    <TextField
                    fullWidth
                    name="textoBusquedaCurso"
                    variant="outlined"
                    label="Busca tu curso"
                    onChange={handleChangeBusqueda}
                    value={textoBusquedaCurso}
                    inputProps={{maxLength: 50}}
                    />
                </Grid>
            </Grid>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell align="left">Cursos</TableCell>
                            <TableCell align="left">Descripcion</TableCell>
                            <TableCell align="left">Fecha Publicacion</TableCell>
                            <TableCell align="left">Precio Original</TableCell>
                            <TableCell align="left">Precio Promocion</TableCell>
                        </TableRow>      
                    </TableHead>
                    <TableBody>
                        {paginadorResponse.listaRecords.map((curso) => (
                            <TableRow key={curso.titulo}>
                                <TableCell align="left">{curso.Titulo}</TableCell>
                                <TableCell align="left">{curso.Descripcion}</TableCell>
                                <TableCell align="left">{(new Date(curso.FechaPublicacion)).toLocaleString()}</TableCell>
                                <TableCell align="left">{curso.PrecioActual}</TableCell>
                                <TableCell align="left">{curso.Promocion}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25]}
                count={paginadorResponse.totalRecords}
                rowsPerPage={paginadorRequest.cantidadElementos}
                page={paginadorRequest.numeroPagina}
                onChangePage={cambiarPagina}
                onChangeRowsPerPage={cambiarCantidadRecords}
                labelRowsPerPage ="Cursos por pagina"
            />

        </div>
    )
}

export default PaginadoCurso;