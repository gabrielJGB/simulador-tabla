import { getDatosTablaPuntos } from './calculosTablaPuntos.js'

getDatosFecha()

function getDatosFecha() {
    fetch('/info_fechas')
        .then((data) => {
            data.json().then((fechas_array_resp) => {
                main(fechas_array_resp)

            })
        }).catch((error) => {
            console.error(error)
        })
}


function main(fechas_array_response) {

    const nextButton = document.querySelector('.next-button')
    const prevButton = document.querySelector('.previous-button')
    const botones_fechas = document.querySelector('.botones-fechas')
    const boton_deshacer = document.querySelector('.boton-deshacer')
    const fechaDiv = document.querySelector('.fecha')
    const equipo_local_div = document.querySelector(".equipo-local")
    const equipo_visitante_div = document.querySelector(".equipo-visitante")
    const goles_local_input = document.querySelector("#goles-local")
    const goles_visitante_input = document.querySelector("#goles-visitante")
    const boton_aceptar = document.querySelector(".accept-button")
    const hide_button = document.querySelector('.hide-button')
    const match_column = document.querySelector('.match-row')
    const match_history = document.querySelector('.modal-history')
    const selected_team = document.querySelector('.selected-team')


    boton_deshacer.addEventListener('click', deshacerCambios)
    hide_button.addEventListener('click', ocultarHistorialEquipo)
    boton_aceptar.addEventListener('click', recalcularTabla)
    window.localStorage.setItem("estadoInicial", JSON.stringify(fechas_array_response))

    let fechas_array = fechas_array_response

    for (let i = 1; i <= fechas_array.length; i++) {
        let boton = document.createElement('BUTTON')
        boton.textContent = i
        boton.className = "btn btn-success"
        boton.addEventListener('click', () => {
            crearTablaPartidos(fechas_array[i - 1])
            fechaDiv.textContent = i
        })
        botones_fechas.appendChild(boton)
    }

    const cantidadFechas = 27
    const fechaActual = 26
    let fecha = fechaActual
    fechaDiv.textContent = fechaActual



    crearTablaPartidos(fechas_array[fechaActual - 1])
    crearTablaPuntos(fechas_array)

    prevButton.addEventListener('click', () => {
        fecha = parseInt(fechaDiv.textContent)
        let fechaValida = fecha > 0

        if (fechaValida) {
            fecha--
            fechaDiv.textContent = fecha
            crearTablaPartidos(fechas_array[fecha - 1])
        }
    })

    nextButton.addEventListener('click', () => {
        fecha = parseInt(fechaDiv.textContent)
        let fechaValida = fecha < cantidadFechas

        if (fechaValida) {
            fecha++
            fechaDiv.textContent = fecha
            crearTablaPartidos(fechas_array[fecha - 1])
        }
    })


    function crearTablaPartidos(objeto_fecha) {
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
        abrirModalPartido(equipo_local, equipo_visitante, goles_local, goles_visitante)

    }

    function abrirModalPartido(equipo_local, equipo_visitante, goles_local, goles_visitante) {

        goles_local_input.value = goles_local == "-" ? "" : goles_local
        goles_visitante_input.value = goles_visitante == "-" ? "" : goles_visitante
        equipo_local_div.children[1].textContent = equipo_local
        equipo_visitante_div.children[1].textContent = equipo_visitante

        equipo_local_div.children[0].src = `./img/${equipo_local.replaceAll(" ", "_")}.png`
        equipo_visitante_div.children[0].src = `./img/${equipo_visitante.replaceAll(" ", "_")}.png`

    }


    function recalcularTabla(e) {


        let partido_nuevo = {
            "goles_local": parseInt(goles_local_input.value),
            "goles_visitante": parseInt(goles_visitante_input.value),
            "local": equipo_local_div.children[1].textContent,
            "visitante": equipo_visitante_div.children[1].textContent
        }

        console.log(partido_nuevo)


        console.log(fechas_array[fecha - 1]);
        fechas_array[fecha - 1].partidos.forEach(partido => {
            if (partido.local == partido_nuevo.local) {
                console.log(partido)
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



        crearTablaPartidos(fechas_array[fecha - 1])
        crearTablaPuntos(fechas_array)

    }


    function deshacerCambios(e) {
        let fechas_array_inicial = JSON.parse(window.localStorage.getItem("estadoInicial"))

        crearTablaPartidos(fechas_array_inicial[parseInt(fechaDiv.textContent) - 1])
        crearTablaPuntos(fechas_array_inicial)
    }



    function crearTablaPuntos(fechas_array) {
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

            row.addEventListener('click', mostrarHistorialEquipo)

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

    
    function mostrarHistorialEquipo() {
        match_history.style.right = 0
        let equipo_mostrar = this.children[1].textContent


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
                        abrirModalPartido(equipo_local, equipo_visitante, goles_local, goles_visitante)
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

    function ocultarHistorialEquipo() {

        match_history.style.right = "-400px"
    }


}
