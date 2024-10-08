require('dotenv').config()

const mongoose = require('mongoose')
const jsonwebtoken = require('jsonwebtoken')

const userModel = require('../models/user.model')
const {dispatchErro, dispatchOK} = require('./returns')




async function Logar(body, res){

    const user= body.user;
    const password= body.password;

    if(!user || !password){
        return dispatchErro('Dados insuficientes!')
    }

    let Find = await userModel.find({user: user, password: password})
    .then(response => {
        return response
    })
    .catch(erro => {
        return dispatchErro(erro)
    })

    if( Find == '' || Find.erro ){
        return dispatchErro('E-mail ou senha incorretos.')
    }

    let Token = await jsonwebtoken.sign({
        id: Find[0]._id,
        user: Find[0].user,
        password: Find[0].password,
        level: Find[0].level
    }, process.env.TOKEN_PASS_GENERATOR)

    //Salva o token gerado no cookie do navegador.
    res.cookie('Token', Token)
    res.sendStatus(200)
}

async function Logado(req, res, next){
    
    // Verifica se tem algum cookie chamado token no navegador, para depois fazer as verificações se é valido.
    if(! req.cookies || ! req.cookies.Token){
        return dispatchErro('Token inexistente')
    }
    
    let Auth = req.cookies.Token

    //Verifica se o cookie existe
    if(typeof(Auth) == 'undefined' || Auth == '' || Auth == null){
        return dispatchErro('Não autorizado')
    } else{
        try{
            let Token = await jsonwebtoken.verify(Auth, process.env.TOKEN_PASS_GENERATOR)
            next()
        } catch(err){
            return dispatchErro('Não autorizado')
        }
    }
}

async function Redireciona(req, res, next){
    // Verifica se tem algum cookie chamado token no navegador, para depois fazer as verificações se é valido.
    if(! req.cookies || ! req.cookies.Token){
        return next()
    }
    
    let Auth = req.cookies.Token

    //Verifica se o cookie existe
    if(typeof(Auth) == 'undefined' || Auth == '' || Auth == null){
        return next()
    } else{
        try{
            let Token = await jsonwebtoken.verify(Auth, process.env.TOKEN_PASS_GENERATOR)
            res.redirect('/privado')        
        } catch(err){
            return next()
        }
    }
}

async function Deslogar(res){
    res.clearCookie('Token')
    res.redirect('/')
}

async function AdminLogado(req, res){
    
    if(! req.cookies || ! req.cookies.Token){
        return dispatchErro('Token inexistente')
    }
    
    let Auth = req.cookies.Token

    //Verifica se o cookie existe
    if(typeof(Auth) == 'undefined' || Auth == '' || Auth == null){
        return dispatchErro('Não autorizado')
    } else{
        try{
            let Token = await jsonwebtoken.verify(Auth, process.env.TOKEN_PASS_GENERATOR)
            return {user: Token.user, userMaster: Token.level == 1}
        } catch(err){
            return dispatchErro('Não autorizado')
        }
    }
}

async function CriarUsuario(body, res){
    
    if(!body){
        return dispatchErro('Corpo da requisição vazio!')
    } else{
        const Find = await userModel.find({user: body.user})
        
        try{
            if(! Find == '' || ! Find.erro){
                if(Find.length == 0){
                    const userCreate = new userModel({
                        user: body.user,
                        password: body.password,
                        level: body.level
                    })

                    return await userCreate.save() != undefined ? dispatchOK('Usuário criado com sucesso!') : dispatchErro('Erro ao criar usuário!')
                } else{
                    return dispatchErro('Este nome de usuário ja encontra-se utilizado!')    
                }
             } else{
                return dispatchErro('Erro ao executar consulta ao banco de dados!')
            }
        } catch(err){
            console.log(err)
            return dispatchErro(err)
        }
    }
}

async function ListarUsuarios(){
    
    const Find = await userModel.find()

    if(! Find || Find.length == 0){
        return dispatchErro('Não foram encontrados nenhum registro de usuário.')
    } else{
        return Find
    }
}

async function deleteUsuario(body, res){
    const id = body._id

    const Find = await userModel.find({_id: id})

    if(! Find || Find.length == 0){
        return dispatchErro('Não foram encontrados nenhum registro de usuário.')
    } else{
        console.log(Find)
        return dispatchOK(Find[0].user)
    }
}

module.exports = {Logar, Logado, Deslogar, Redireciona, AdminLogado, CriarUsuario, ListarUsuarios, deleteUsuario}