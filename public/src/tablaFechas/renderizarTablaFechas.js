import { abrirModalPartido } from "../modalPartido/modalPartido.js";

export function renderizarTablaFechas(objeto_fecha) {
    const tabla_partidos = document.querySelector(".match-table")
    let texto_dia = ''
    tabla_partidos.textContent = '';

    objeto_fecha.partidos.forEach(partido => {

        if (partido.dia != texto_dia.textContent) {
            let row = tabla_partidos.insertRow()
            let cell = row.insertCell()
            cell.style.backgroundColor = "#121212"
            cell.colSpan = 5
            texto_dia = document.createTextNode(partido.dia)
            cell.appendChild(texto_dia)
        }

        let row = tabla_partidos.insertRow()
        row.classList.add("row-eff")
        row.setAttribute("data-toggle", "modal")
        row.setAttribute("data-target", "#exampleModal")

        row.addEventListener('click', getDatosPartido)

        let cell_hora = row.insertCell()
        let cell_local = row.insertCell()
        let cell_goles_local = row.insertCell()
        let cell_goles_visitante = row.insertCell()
        let cell_visitante = row.insertCell()

        cell_hora.appendChild(document.createTextNode(partido.hora == "" ? "A conf." : partido.hora))
        cell_goles_local.appendChild(document.createTextNode(partido.goles_local))
        cell_goles_visitante.appendChild(document.createTextNode(partido.goles_visitante))
        cell_local.appendChild(document.createTextNode(partido.local))
        cell_visitante.appendChild(document.createTextNode(partido.visitante))

        if (partido.resultado == "L")
            cell_local.style.fontWeight = "bold"
        else if (partido.resultado == "V")
            cell_visitante.style.fontWeight = "bold"

    })
}


 
    function getDatosPartido() {
        let equipo_local = this.children[1].textContent
        let equipo_visitante = this.children[4].textContent
        let goles_local = this.children[2].textContent
        let goles_visitante = this.children[3].textContent
        let fecha = document.querySelector('.fecha').textContent
        abrirModalPartido(equipo_local, equipo_visitante, goles_local, goles_visitante,fecha,true)

    }