require('dotenv').config()

const {Logar, Logado, Deslogar, Redireciona} = require('./controllers/controller')
const db = require('./database')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')

const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())

app.use('/Pages', express.static(__dirname+'/Pages'))

app.get('/', Redireciona, (req, res) => res.sendFile(__dirname+'/Pages/index.html'))
app.get('/privado', Logado, (req, res) => res.send('Somente usuários logados podem ver isso!'))


//ROUTES
app.post('/api/users/logar', async(req, res)=>{
    res.send(await Logar(req.body, res))
})

app.get('/api/users/deslogar', async(req, res)=>{
    res.send(await Deslogar(res))
})



app.listen(process.env.SERVER_PORT, ()=>{
    console.log('Servidor online na porta ' + process.env.SERVER_PORT.toString() )
})
