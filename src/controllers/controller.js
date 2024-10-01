require('dotenv').config()

const mongoose = require('mongoose')
const jsonwebtoken = require('jsonwebtoken')

const userModel = require('../models/user.model')





async function Logar(body, res){

    const user= body.user;
    const password= body.password;

    if(!user || !password){
        return {erro: 'Dados insuficientes!'}
    }

    let Find = await userModel.find({user: user, password: password})
    .then(response => {
        return response
    })
    .catch(erro => {
        return { erro: erro }
    })

    if( Find == '' || Find.erro ){
        return {erro: 'E-mail ou senha incorretos.'}
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
        return res.send({erro: {login: 'Token inexistente'}})
    }
    
    let Auth = req.cookies.Token

    //Verifica se o cookie existe
    if(typeof(Auth) == 'undefined' || Auth == '' || Auth == null){
        return res.send({erro: {login: 'Não autorizado'}})
    } else{
        try{
            let Token = await jsonwebtoken.verify(Auth, process.env.TOKEN_PASS_GENERATOR)
            next()
        } catch(err){
            return res.send({erro: {login: 'Não autorizado'}})
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
        return res.send({erro: {login: 'Token inexistente'}})
    }
    
    let Auth = req.cookies.Token

    //Verifica se o cookie existe
    if(typeof(Auth) == 'undefined' || Auth == '' || Auth == null){
        return res.send({erro: {login: 'Não autorizado'}})
    } else{
        try{
            let Token = await jsonwebtoken.verify(Auth, process.env.TOKEN_PASS_GENERATOR)
            return {user: Token.user, userMaster: Token.level == 1}
        } catch(err){
            return res.send({erro: {login: 'Não autorizado'}})
        }
    }
}

async function CriarUsuario(body, res){
    res.clearCookie('Token')
    res.redirect('/')
}


module.exports = {Logar, Logado, Deslogar, Redireciona, AdminLogado, CriarUsuario}