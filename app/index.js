const express = require('express')
const logger = require('loglevel')
const config = require('./config/essential')
const basicRoutes = require('./core/basicRoutes')
const aQuery = require('./core/query/aQuery')

const app = express()

logger.setLevel('INFO', false)

app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: true }))

app.use(express.static('public'))

app.get(config.basepath, basicRoutes.functionHomepage)
app.get(config.basepath + '/' + 'a', basicRoutes.a)
app.post(config.basepath + '/' + 'aQuery', aQuery)

//app.get(config.basepath + '/' + 'about', basicRoutes.functionAboutPage)

app.listen(config.port, config.host, () => logger.info('[System] App QualityMarks deployed at: http://' + config.host + ':' + config.port + config.basepath))