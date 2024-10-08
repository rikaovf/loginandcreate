function criaElementoDom(tipo, atributos, classes, elementoInsert, posicaoInsert, conteudoElm){
    var elemento = document.createElement(tipo);

    if(atributos != undefined){
        atributos.forEach(atrib => {
            elemento.setAttribute(atrib[0], atrib[1])
        });
    }

    if(classes != undefined){
        classes.forEach(classe => {
            elemento.classList.add(classe);
        });
    }

    if(elementoInsert != undefined){
        elementoInsert.insertAdjacentElement( elementoInsert != undefined ? posicaoInsert : "beforeend", elemento);
    }

    if(conteudoElm != undefined){
        elemento.innerText = conteudoElm;
    }

    return elemento;
}