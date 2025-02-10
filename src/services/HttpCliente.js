import Axios from "axios";

// Configuración de la URL base
Axios.defaults.baseURL = 'http://localhost:5120/api';

// Interceptor para solicitudes
//pruebas de comit
//pruebas
Axios.interceptors.request.use(
    (config) => {
        const token_seguridad = window.localStorage.getItem('token_seguridad');
        if (token_seguridad) {
            config.headers.Authorization = `Bearer ${token_seguridad}`;
        }
        return config; // Devuelve siempre el objeto config
    },
    (error) => {
        return Promise.reject(error); // Manejo de errores en la solicitud
    }
);

// Interceptor para respuestas
Axios.interceptors.response.use(
    (response) => {
        return response; // Devuelve la respuesta si no hay errores
    },
    (error) => {
        if (error.response) {
            // Manejo de errores específicos del servidor
            if (error.response.status === 401) {
                console.error("No autorizado. Redirigiendo a login...");
                // Lógica para redirigir al usuario al login
                window.location.href = "/login";
            }
        }
        return Promise.reject(error); // Propaga el error
    }
);

// Objeto de solicitudes genéricas
const requestGenerico = {
    get: (url) => Axios.get(url),
    post: (url, body) => Axios.post(url, body),
    put: (url, body) => Axios.put(url, body),
    delete: (url) => Axios.delete(url),
};

export default requestGenerico;
