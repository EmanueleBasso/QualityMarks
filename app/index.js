const express = require('express')
const logger = require('loglevel')
const config = require('./config/essential')
const basicRoutes = require('./core/basicRoutes')
const ricercaProdottoAlimentareQuery = require('./core/query/ricercaProdottoAlimentareQuery')
const infoProdottoAlimentare = require('./core/query/infoProdottoAlimentare')
const ricercaPerMarchioQuery = require('./core/query/ricercaPerMarchioQuery')
const ricercaEventiQuery = require('./core/query/ricercaEventiQuery')

const app = express()

logger.setLevel('INFO', false)

app.set('view engine', 'ejs')

app.use(express.urlencoded({extended: true}))

app.use(express.static('public'))

app.get(config.basepath, basicRoutes.functionRicercaProdottoAlimentare)
app.get(config.basepath + '/' + 'ricercaProdottoAlimentare', basicRoutes.functionRicercaProdottoAlimentare)
app.post(config.basepath + '/' + 'ricercaProdottoAlimentareQuery', ricercaProdottoAlimentareQuery)
app.post(config.basepath + '/' + 'infoProdottoAlimentare', infoProdottoAlimentare)
app.get(config.basepath + '/' + 'ricercaPerMarchio', basicRoutes.functionRicercaPerMarchio)
app.post(config.basepath + '/' + 'ricercaPerMarchioQuery', ricercaPerMarchioQuery)
app.get(config.basepath + '/' + 'ricercaEventi', basicRoutes.functionRicercaEventi)
app.post(config.basepath + '/' + 'ricercaEventiQuery', ricercaEventiQuery)

//app.get(config.basepath + '/' + 'about', basicRoutes.functionAboutPage)

app.listen(config.port, config.host, () => logger.info('[System] App QualityMarks deployed at: http://' + config.host + ':' + config.port + config.basepath))