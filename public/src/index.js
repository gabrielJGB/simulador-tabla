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

    let fechas_array = fechas_array_response
    const cantidadFechas = 27
    const fechaActual = 26
    let fecha = fechaActual
    const fechaDiv = document.querySelector('.fecha')
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

            row.addEventListener('click', abrirModalPartido)

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



    const equipo_local_div = document.querySelector(".equipo-local")
    const equipo_visitante_div = document.querySelector(".equipo-visitante")
    const goles_local_input = document.querySelector("#goles-local")
    const goles_visitante_input = document.querySelector("#goles-visitante")
    const boton_aceptar = document.querySelector(".accept-button")

    boton_aceptar.addEventListener('click', recalcularTabla)



    function abrirModalPartido(e) {
        let equipo_local = this.children[1].textContent
        let equipo_visitante = this.children[4].textContent
        let goles_local = this.children[2].textContent
        let goles_visitente = this.children[3].textContent

        goles_local_input.value = goles_local == "-" ? "" : goles_local
        goles_visitante_input.value = goles_visitente == "-" ? "" : goles_visitente
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

        fechas_array[fecha-1].partidos.forEach(partido=>{
            if(partido.local == partido_nuevo.local){
                partido.goles_local = partido_nuevo.goles_local
                partido.goles_visitante = partido_nuevo.goles_visitante
                if(partido_nuevo.goles_local>partido_nuevo.goles_visitante){
                    partido.resultado = "L"
                }else if(partido_nuevo.goles_local<partido_nuevo.goles_visitante){
                    partido.resultado = "V"
                }else{
                    partido.resultado = "E"
                }
            }
        })

        
        
        crearTablaPartidos(fechas_array[fecha - 1])
        crearTablaPuntos(fechas_array)

    }

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

