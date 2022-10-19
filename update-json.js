const puppeteer = require('puppeteer');
const jsdom = require('jsdom');
const fs = require('fs');


const update_data = async () => {
  try {

    const browser = await puppeteer.launch({
      headless:true,
      
    });

    
    const page = await browser.newPage();
    const response = await page.goto('https://es.wikipedia.org/wiki/Campeonato_de_Primera_Divisi%C3%B3n_2022_(Argentina)');
    const body = await response.text();
    const { window: { document } } = new jsdom.JSDOM(body);

    let lastDateSaved = ''
    let lastTimeSaved = ''
    let data = []
    let fechas = []
    let tbodies = document.querySelectorAll('tbody')
    let cantidadDeEquipos = 16

    function resultado(el) {

      if (el.children[0].bgColor != '') {
        return "L"
      } else if (el.children[1].bgColor != '') {
        return "E"
      } else if (el.children[2].bgColor != '') {
        return "V"
      } else {
        return "-"
      }
    }

    function get_date(row) {
      if (row.cells[4] && row.cells[4].textContent.includes("de")) {
        lastDateSaved = row.cells[4].textContent.replace("\n", "")
      }
      if (row.cells[5]) {
        lastTimeSaved = row.cells[5].textContent.replace("\n", "")
      } else if (row.cells[4] && !row.cells[4].textContent.includes("de")) {
        lastTimeSaved = row.cells[4].textContent.replace("\n", "")
      }
    

      return { lastDateSaved, lastTimeSaved }

    }


    tbodies.forEach(tb => {
      if (tb.childElementCount == cantidadDeEquipos) {
        fechas.push(tb)
      }
    })
    let i = 0
    fechas.forEach(fecha => {
      let obj = {
        "fecha": ++i,
        "partidos": []
      }
      for (let i = 2; i < fecha.childElementCount; i++) {

        obj.partidos.push({
          "local": getNombreCorto(fecha.children[i].children[0].textContent.replace("\n", "").trim()),
          "visitante": getNombreCorto(fecha.children[i].children[2].textContent.replace("\n", "").trim()),
          "resultado": resultado(fecha.children[i]),
          "goles_local": (fecha.children[i].children[1].textContent.match(/\d/g) ? parseInt(fecha.children[i].children[1].textContent.match(/\d/g)[0]): '-'),
          "goles_visitante": (fecha.children[i].children[1].textContent.match(/\d/g) ? parseInt(fecha.children[i].children[1].textContent.match(/\d/g)[1]): '-'),
          "estadio": fecha.children[i].children[3].textContent.replace("\n", ""),
          "dia": get_date(fecha.children[i]).lastDateSaved.replace(/\d{1,2} de \w+\s?\[n. \d]/,"Reprogramado"),
          "hora": get_date(fecha.children[i]).lastTimeSaved,
        })

      }
      data.push(obj)

    })

    await browser.close();

    fs.writeFileSync(__dirname+'/info_fechas.json', JSON.stringify(data));

  } catch (error) {
    console.error(error);
  }
}

module.exports ={
  update_data
}


function getNombreCorto(equipo){
  if(equipo == "Argentinos Juniors"){
    return "Argentinos"
  }else if(equipo == "Atlético Tucumán"){
    return "Atl. Tucumán"
  }else if(equipo == "Central Córdoba (SdE)"){
    return "Central Cba"
  }else if(equipo == "Defensa y Justicia"){
    return "Def y Justicia"
  }else if(equipo == "Gimnasia y Esgrima (LP)"){
    return "Gimnasia (LP)"
  }else if(equipo == "Newell's Old Boys"){
    return "Newells"
  }else {
    return equipo
  }
}