function dispatchErro(mensagem){
    return { erro: mensagem }
}

function dispatchOK(mensagem){
    return { mensagem: mensagem }
}

module.exports = { dispatchErro, dispatchOK }