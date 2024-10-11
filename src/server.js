require('dotenv').config()

const {Logar, Logado, Deslogar, Redireciona, AdminLogado, CriarUsuario, ListarUsuarios, alteraUsuario, deleteUsuario} = require('./controllers/controller')
const db = require('./database')

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')




const app = express()


//// ACTIVATE EJS ENGINE
app.set('view engine', 'ejs')
app.set('views', __dirname +'/views');
////////////////////////

////////MIDDLEWARES
app.use(cors())
app.use(bodyParser.json())
app.use(cookieParser())
///////////////////



////////STATIC PAGES FRONT-END
app.use('/Pages', express.static(__dirname+'/Pages'))
app.use('/js', express.static(__dirname+'/Pages/js'))
app.use('/css', express.static(__dirname+'/Pages/styles'))
////////////////////



//////ROUTES
// index page
app.get('/teste', Logado, (req, res)=> res.render('teste'));

app.get('/', Redireciona, (req, res) => res.sendFile(__dirname+'/Pages/index.html'))
app.get('/privado', Logado, (req, res) => res.sendFile(__dirname+'/Pages/privado.html'))

app.get('/api/users/adminlogado', async(req, res)=>{
    res.send(await AdminLogado(req, res))
})

app.get('/api/users/deslogar', async(req, res)=>{
    res.send(await Deslogar(res))
})

app.get('/api/users/listusers', async(req, res)=>{
    res.send(await ListarUsuarios())
})

app.post('/api/users/logar', async(req, res)=>{
    res.send(await Logar(req.body, res))
})

app.post('/api/users/criarusuario', async(req, res)=>{
    res.send(await CriarUsuario(req.body, res))
})

app.post('/api/users/alterausuario', async(req, res)=>{
    res.send(await alteraUsuario(req.body, res))
})

app.post('/api/users/deleteusuario', async(req, res)=>{
    res.send(await deleteUsuario(req.body, res))
})


////////// teste para recuperar ip do cliente
/*app.get('/api/users/teste', async(req, res)=>{
    var remoteIp = (req.headers['x-forwarded-for'] || '').split(',').pop() || // Recupera o IP de origem, caso a fonte esteja utilizando proxy
                 req.connection.remoteAddress || // Recupera o endereço remoto da chamada
                 req.socket.remoteAddress || // Recupera o endereço através do socket TCP
                 req.connection.socket.remoteAddress // Recupera o endereço através do socket da conexão
    
    res.send(remoteIp)
})*/

/////////////







app.listen(process.env.SERVER_PORT, ()=>{
    console.log('Servidor online na porta ' + process.env.SERVER_PORT.toString() )
})