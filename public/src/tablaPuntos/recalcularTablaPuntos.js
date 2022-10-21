import { renderizarTablaFechas } from "../tablaFechas/renderizarTablaFechas.js"
import { renderizarTablaPuntos } from "./renderizarTablaPuntos.js"
import { fechas_array } from "../index.js"
import { mostrarHistorialEquipo } from "../tablaHistorial/renderizarTablaHistorial.js"

export function recalcularTablaPuntos(partido_nuevo,origen_tabla_fechas) {

    let fecha = parseInt(partido_nuevo.fecha)

    
    
    fechas_array[fecha - 1].partidos.forEach(partido => {
        if (partido.local == partido_nuevo.local) {
            
            partido.goles_local = partido_nuevo.goles_local
            partido.goles_visitante = partido_nuevo.goles_visitante
            if (partido_nuevo.goles_local > partido_nuevo.goles_visitante) {
                partido.resultado = "L"
            } else if (partido_nuevo.goles_local < partido_nuevo.goles_visitante) {
                partido.resultado = "V"
            } else {
                partido.resultado = "E"
            }
        }
    })

    
    origen_tabla_fechas?renderizarTablaFechas(fechas_array[fecha - 1]):null
    renderizarTablaPuntos(fechas_array)

}