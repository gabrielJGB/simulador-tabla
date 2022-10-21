import {fechas_array} from './index.js'

export function agregarListaCambios(p){



let numeroFecha = p.fecha
let equipo_local = p.local
let equipo_visitante = p.visitante

let fecha_resp = fechas_array[numeroFecha-1].partidos.filter(partido=>(partido.visitante===equipo_visitante && partido.local === equipo_local))

console.log(fecha_resp[0])

}