import { renderizarTablaFechas } from './tablaFechas/renderizarTablaFechas.js'
import { renderizarTablaPuntos } from './tablaPuntos/renderizarTablaPuntos.js'
import { ocultarHistorialEquipo } from './tablaHistorial/renderizarTablaHistorial.js'

export let fechas_array = null
requestArrayFechas()

async function requestArrayFechas() {

    fetch('/info_fechas')
        .then((data) => {
            data.json().then((fechas_array_resp) => {
                setFechasArray(fechas_array_resp)
                main(fechas_array_resp)

            })
        }).catch((error) => {
            console.error(error)
        })
}

function setFechasArray(fechas_array_resp){
    fechas_array = fechas_array_resp
}


function main(fechas_array) {

    window.localStorage.setItem("estadoInicial", JSON.stringify(fechas_array))

    const nextButton = document.querySelector('.next-button')
    const prevButton = document.querySelector('.previous-button')
    const boton_deshacer = document.querySelector('.boton-deshacer')
    const botones_fechas = document.querySelector('.botones-fechas')
    const fechaDiv = document.querySelector('.fecha')

    prevButton.addEventListener('click', setFechaAnterior)
    nextButton.addEventListener('click', setFechaSiguiente)
    boton_deshacer.addEventListener('click', setEstadoInicial)

    const cantidadFechas = 27
    const fechaActual = 26
    let fecha = fechaActual
    fechaDiv.textContent = fechaActual

    renderizarBotonesFechas()
    renderizarTablaFechas(fechas_array[fechaActual - 1])
    renderizarTablaPuntos(fechas_array)



    function renderizarBotonesFechas() {
        for (let i = 1; i <= fechas_array.length; i++) {
            let boton = document.createElement('BUTTON')
            boton.textContent = i
            boton.className = "btn btn-success"
            boton.addEventListener('click', () => {
                renderizarTablaFechas(fechas_array[i - 1])
                fechaDiv.textContent = i
            })
            botones_fechas.appendChild(boton)
        }
    }

    function setFechaAnterior() {
        fecha = parseInt(fechaDiv.textContent)
        let fechaValida = fecha > 0

        if (fechaValida) {
            fecha--
            fechaDiv.textContent = fecha
            renderizarTablaFechas(fechas_array[fecha - 1])
        }
    }

    function setFechaSiguiente() {
        fecha = parseInt(fechaDiv.textContent)
        let fechaValida = fecha < cantidadFechas

        if (fechaValida) {
            fecha++
            fechaDiv.textContent = fecha
            renderizarTablaFechas(fechas_array[fecha - 1])
        }
    }

    function setEstadoInicial() {
        let fechas_array_inicial = JSON.parse(window.localStorage.getItem("estadoInicial"))
        let numero_fecha = parseInt(fechaDiv.textContent) - 1

        setFechasArray(fechas_array_inicial)
        renderizarTablaFechas(fechas_array_inicial[numero_fecha])
        renderizarTablaPuntos(fechas_array_inicial)
        
    }

}






