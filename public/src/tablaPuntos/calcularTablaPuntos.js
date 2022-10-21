
export function getDatosTablaPuntos(info_fechas) {
  let equipos = []
  info_fechas[0].partidos.forEach(partido => {
    equipos.push(partido.local)
    equipos.push(partido.visitante)
  })



  let info_tabla = []
  equipos.forEach(equipo => {
    let { goles_favor, goles_contra, dif_goles } = getInfoGoles(equipo, info_fechas)
    let { jugados, ganados, empatados, perdidos } = getInfoPartidos(equipo, info_fechas)
    let puntos = ganados * 3 + empatados

    info_tabla.push({
      "escudo": `./img/${equipo.replaceAll(" ", "_")}.png`,
      "equipo": getNombreCorto(equipo),
      "PJ": jugados,
      "puntos": puntos,
      "PG": ganados,
      "PE": empatados,
      "PP": perdidos,
      "GF": goles_favor,
      "GC": goles_contra,
      "dif": dif_goles
    })
  })


  
  // info_tabla.sort((a, b) => a.equipo.localeCompare(b.equipo))
  // info_tabla.sort(((a, b) => b.puntos - a.puntos))

  info_tabla.sort((a,b)=>{
    let n = b.puntos - a.puntos
    if(n !=0){
        return n
    }
    return b.dif - a.dif
    
  }) 


  let pos = 0
  info_tabla.forEach(equipo => {
    equipo.posicion = ++pos
  })


  return info_tabla
}







function getInfoGoles(equipo, info_fechas) {
  let goles_favor = 0
  let goles_contra = 0
  let dif_goles = 0

  info_fechas.forEach(fecha => {
    fecha.partidos.forEach(partido => {
      if (partido.local == equipo) {
        goles_favor += partido.goles_local != "-" ? partido.goles_local : 0
        goles_contra += partido.goles_visitante != "-" ? partido.goles_visitante : 0

      } else if (partido.visitante == equipo) {
        goles_favor += partido.goles_visitante != "-" ? partido.goles_visitante : 0
        goles_contra += partido.goles_local != "-" ? partido.goles_local : 0

      }
    })
  })

  dif_goles = goles_favor - goles_contra

  return { goles_favor, goles_contra, dif_goles }
}


function getInfoPartidos(equipo, info_fechas) {
  let jugados = 0
  let ganados = 0
  let empatados = 0
  let perdidos = 0
  info_fechas.forEach(fecha => {
    fecha.partidos.forEach(partido => {
      if (partido.local == equipo || partido.visitante == equipo) {
        if (partido.resultado != "-") {
          jugados++
        }
      }

      if ((partido.local == equipo && partido.resultado == "L") || (partido.visitante == equipo && partido.resultado == "V")) {
        ganados++
      }

      if ((partido.local == equipo && partido.resultado == "E") || (partido.visitante == equipo && partido.resultado == "E")) {
        empatados++
      }

      if ((partido.local == equipo && partido.resultado == "V") || (partido.visitante == equipo && partido.resultado == "L")) {
        perdidos++
      }

    })
  })
  return { jugados, ganados, empatados, perdidos }


}


function getNombreCorto(equipo) {
  if (equipo == "Argentinos Juniors") {
    return "Argentinos"
  } else if (equipo == "Atlético Tucumán") {
    return "Atl. Tucumán"
  } else if (equipo == "Central Córdoba (SdE)") {
    return "Central Cba."
  } else if (equipo == "Defensa y Justicia") {
    return "Def y Justicia"
  } else if (equipo == "Gimnasia y Esgrima (LP)") {
    return "Gimnasia (LP)"
  } else if (equipo == "Newell's Old Boys") {
    return "Newells"
  } else {
    return equipo
  }
}