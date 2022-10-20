const express = require('express');
const app = express();
const info_fechas = require('./info_fechas.json'); 
const scrapper = require('./update-json')
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => { console.log('Listening on port', PORT); });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index')
});


app.get('/info_fechas', function (req, res) {
  res.json(info_fechas)
});


app.get('/update',async (req,res)=>{
  await scrapper.update_data()
  // console.log("APP.JS: ----------------> " + JSON.stringify(info_fechas[26].partidos[10].goles_visitante))
  res.redirect('/')
})


