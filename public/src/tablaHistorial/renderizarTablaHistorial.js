import { fechas_array } from "../index.js"
import { abrirModalPartido } from "../modalPartido/modalPartido.js"

const match_history = document.querySelector('.modal-history')
const match_column = document.querySelector('.match-row')
const selected_team = document.querySelector('.selected-team')

const hide_button = document.querySelector('.hide-button')
hide_button.addEventListener('click', ocultarHistorialEquipo)


export function ocultarHistorialEquipo() {
    match_history.style.right = "-400px"
    match_column.textContent = ''
}



export function mostrarHistorialEquipo(equipo) {
    match_history.style.right = 0
    let equipo_mostrar = equipo.children[1].textContent

    match_column.textContent = ''
    selected_team.children[0].children[0].src = `./img/${equipo_mostrar.replaceAll(" ", "_")}.png`
    selected_team.children[0].children[1].textContent = equipo_mostrar
    

    fechas_array.forEach(fecha => {


        fecha.partidos.forEach(partido => {
            let equipoEsLocal = partido.local == equipo_mostrar
            if (equipoEsLocal || partido.visitante == equipo_mostrar) {
                let row = match_column.insertRow()
                let cell_num_fecha = row.insertCell()
                let cell_dia = row.insertCell()
                let cell_cancha = row.insertCell()
                let cell_rival = row.insertCell()
                let cell_resultado = row.insertCell()

                row.classList.add("row-eff")
                row.setAttribute("data-toggle", "modal")
                row.setAttribute("data-target", "#exampleModal")

                row.addEventListener('click', () => {
                    let equipo_local = partido.local
                    let equipo_visitante = partido.visitante
                    let goles_local = partido.goles_local
                    let goles_visitante = partido.goles_visitante
                    abrirModalPartido(equipo_local, equipo_visitante, goles_local, goles_visitante,fecha.fecha,false)
                })

                let equipoEsGanador = equipoEsLocal && partido.resultado == "L" || !equipoEsLocal && partido.resultado == "V"
                let esEmpate = partido.resultado == "E"

                let equipoEsPerdedor = equipoEsLocal && partido.resultado == "V" || !equipoEsLocal && partido.resultado == "L"

                if (equipoEsGanador) {
                    cell_resultado.classList.add("victoria")
                } else if (equipoEsPerdedor) {
                    cell_resultado.classList.add("derrota")
                } else if (esEmpate) {
                    cell_resultado.classList.add("empate")
                }


                let img = document.createElement('IMG')
                img.src = `./img/${equipoEsLocal ? partido.visitante.replaceAll(" ", "_") : partido.local.replaceAll(" ", "_")}.png`
                img.width = img.height = 20
                img.style.marginRight = "4px"
                cell_num_fecha.style.textAlign = "center"
                cell_dia.style.textAlign = "center"
                cell_num_fecha.appendChild(document.createTextNode(fecha.fecha))
                cell_cancha.appendChild(document.createTextNode(equipoEsLocal ? "L" : "V"))
                cell_dia.appendChild(document.createTextNode(formatFecha(partido.dia)))
                cell_rival.appendChild(img)
                cell_rival.appendChild(document.createTextNode(equipoEsLocal ? partido.visitante : partido.local))
                cell_resultado.style.textAlign = "center"
                cell_resultado.appendChild(document.createTextNode(equipoEsLocal ? partido.goles_local + "-" + partido.goles_visitante : partido.goles_visitante + "-" + partido.goles_local))

            }
        })
    })



    function formatFecha(fecha) {
        let dia = fecha.match(/\d+/)
        if (dia) {


            let fechaLower = fecha.toLowerCase()
            let mes

            if (fechaLower.includes("enero")) {
                mes = 1
            } else if (fechaLower.includes("febrero")) {
                mes = 2
            } else if (fechaLower.includes("marzo")) {
                mes = 3
            } else if (fechaLower.includes("abril")) {
                mes = 4
            } else if (fechaLower.includes("mayo")) {
                mes = 5
            } else if (fechaLower.includes("junio")) {
                mes = 6
            } else if (fechaLower.includes("julio")) {
                mes = 7
            } else if (fechaLower.includes("agosto")) {
                mes = 8
            } else if (fechaLower.includes("septiembre")) {
                mes = 9
            } else if (fechaLower.includes("octubre")) {
                mes = 10
            } else if (fechaLower.includes("noviembre")) {
                mes = 11
            } else if (fechaLower.includes("diciembre")) {
                mes = 12
            }


            return dia + "/" + mes
        }
        else {
            return "Susp"
        }
    }
}