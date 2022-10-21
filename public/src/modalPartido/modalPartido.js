import { agregarListaCambios } from "../cambios.js"
import { renderizarTablaFechas } from "../tablaFechas/renderizarTablaFechas.js"
import { recalcularTablaPuntos } from "../tablaPuntos/recalcularTablaPuntos.js"


const boton_aceptar = document.querySelector(".accept-button")
boton_aceptar.addEventListener('click', extraerDatosPartidoModal)

const equipo_local_div = document.querySelector(".equipo-local")
const equipo_visitante_div = document.querySelector(".equipo-visitante")
const goles_local_input = document.querySelector("#goles-local")
const goles_visitante_input = document.querySelector("#goles-visitante")
let fecha
let origen_tabla_fechas

export function abrirModalPartido(equipo_local, equipo_visitante, goles_local, goles_visitante,fecha_partido,origen_tabla_fechas_p) {

    fecha = fecha_partido
    origen_tabla_fechas = origen_tabla_fechas_p
    goles_local_input.value = goles_local == "-" ? "" : goles_local
    goles_visitante_input.value = goles_visitante == "-" ? "" : goles_visitante
    equipo_local_div.children[1].textContent = equipo_local
    equipo_visitante_div.children[1].textContent = equipo_visitante
    equipo_local_div.children[0].src = `./img/${equipo_local.replaceAll(" ", "_")}.png`
    equipo_visitante_div.children[0].src = `./img/${equipo_visitante.replaceAll(" ", "_")}.png`

}

function extraerDatosPartidoModal(){
    
    let partido_nuevo = {
        "goles_local": parseInt(goles_local_input.value),
        "goles_visitante": parseInt(goles_visitante_input.value),
        "local": equipo_local_div.children[1].textContent,
        "visitante": equipo_visitante_div.children[1].textContent,
        "fecha":fecha
    }
    agregarListaCambios(partido_nuevo)
    recalcularTablaPuntos(partido_nuevo,origen_tabla_fechas)
    

}

