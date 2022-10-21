import {getDatosTablaPuntos} from './calcularTablaPuntos.js'
import { mostrarHistorialEquipo } from '../tablaHistorial/renderizarTablaHistorial.js'

export function renderizarTablaPuntos(fechas_array) {
    let datos_tabla_puntos = getDatosTablaPuntos(fechas_array)
    const tabla_puntos = document.querySelector(".main-table")

    tabla_puntos.innerHTML = ` <tr style="background-color: #121212">
        <th style="text-align:center">#</th>
        <th>Equipo</th>
        <th style="text-align:center">Pts</th>
        <th>PJ</th>
        <th>PG</th>
        <th>PE</th>
        <th>PP</th>
        <th>GF</th>
        <th>GC</th>
        <th>Dif</th>
    </tr>`



    datos_tabla_puntos.forEach(equipo => {
        let row = tabla_puntos.insertRow()

        // row.addEventListener('click', ()=>{
        //     console.log(this)
        //     mostrarHistorialEquipo(this.children[1].textContent)
        // })

        row.addEventListener('click',equipoClicked)

        function equipoClicked(){
            mostrarHistorialEquipo(this)
        }

        let cell_posicion = row.insertCell()
        let cell_nombre_equipo = row.insertCell()
        let cell_puntos = row.insertCell()
        let cell_PJ = row.insertCell()
        let cell_PG = row.insertCell()
        let cell_PE = row.insertCell()
        let cell_PP = row.insertCell()
        let cell_GF = row.insertCell()
        let cell_GC = row.insertCell()
        let cell_dif = row.insertCell()


        let img = document.createElement('IMG')
        img.src = equipo.escudo
        img.width = img.height = 20
        cell_nombre_equipo.appendChild(img)
        cell_puntos.style = "font-weight:bold"
        cell_posicion.style = "font-weight:bold;text-align:center"
        cell_nombre_equipo.style = "text-align:start"
        cell_posicion.appendChild(document.createTextNode(equipo.posicion))
        cell_nombre_equipo.appendChild(document.createTextNode(equipo.equipo))
        cell_puntos.appendChild(document.createTextNode(equipo.puntos))
        cell_PJ.appendChild(document.createTextNode(equipo.PJ))
        cell_PG.appendChild(document.createTextNode(equipo.PG))
        cell_PE.appendChild(document.createTextNode(equipo.PE))
        cell_PP.appendChild(document.createTextNode(equipo.PP))
        cell_GF.appendChild(document.createTextNode(equipo.GF))
        cell_GC.appendChild(document.createTextNode(equipo.GC))
        cell_dif.appendChild(document.createTextNode(equipo.dif))
    })
}
