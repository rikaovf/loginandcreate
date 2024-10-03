function dispatchErro(mensagem){
    return { erro: { erro: mensagem } }
}

function dispatchOK(mensagem){
    return { mensagem: { mensagem: mensagem } }
}

module.exports = { dispatchErro, dispatchOK }