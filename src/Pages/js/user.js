function switchModal(alterar, evt){
    
    alterar = typeof(alterar) == undefined ? false : alterar
    
    const modal = document.querySelector("#createUser")
    const btnC = document.querySelector("#btnCriar")
    const userN = document.querySelector("#user")
    const actualState = modal.style.display
    
    // Removi o remove event listener, e o add event listener, pois ele não funciona corretamente ao excluir os eventos
    // já cadastrados. Ele acumula os eventos cada vez que ativa o switchmodal. substituí pelo  btnC.onclick = ()=>{}
    // que sobreescreve a função cada vez que é chamada para executar a sua rotina.
    /*btnC.removeEventListener('click', alteraUsuario)
    btnC.removeEventListener('click', criarUsuario)*/

    if (alterar){
        const nameUserClicked = evt.target.dataset.user;
        userN.value = nameUserClicked
        userN.disabled = true

        btnC.innerText = 'Alterar'

        btnC.onclick = ()=>{alteraUsuario(evt)}
        /*btnC.addEventListener('click', (e)=>{
            alteraUsuario(evt)
        }, {once: true})*/
    } else{
        userN.value = ''
        userN.disabled = false

        btnC.innerText = 'Criar Usuário'
        btnC.onclick = ()=>{criarUsuario()}
        /*btnC.addEventListener('click', (e)=>{
            criarUsuario()
        }, {once: true})*/
    }
    
    if (actualState == 'block'){
        modal.style.display = 'none'
    } else{
        modal.style.display = 'block'
    }
}

function criarUsuario(){
    const userName = document.querySelector("#user")
    const userPass = document.querySelector("#pass")
    const usercPass = document.querySelector("#cpass")
    const userLevel = document.querySelector("#nivelAuth")
    
    if(!userName.value && !userPass.value && !usercPass.value){
        errorMsg("Um ou mais campos incompletos, favor preencher todos os campos!")
        
        return
    } else if(userName.value.length > 30){
        errorMsg("Campo de usuário excede o valor máximo de 30 caracteres!")
        userName.value = ''
        
        return
    } 

    if(userPass.value.length == 0 || userPass.value.length < 5){
        userPass.value = ''
        usercPass.value = ''
        errorMsg('Campo senha vazio, ou menor que o esperado (5 caracteres)')
        return
    }
    
    if(!(userPass.value == usercPass.value)){
        userPass.value = ''
        usercPass.value = ''

       errorMsg("Senhas devem concidir, confira e digite novamente!") 
       return
    }

    
    const data = {
        user: userName.value,
        password: userPass.value,
        level: userLevel.value
    }
    
    axios.post('api/users/criarusuario', data)
    .then(response =>{
        if (response.data.erro){
            errorMsg(response.data.erro)
        } else{
            errorMsg(response.data.mensagem)
            
            userName.value = ''
            userPass.value = ''
            usercPass.value = ''

            switchModal();
        }

        return 
    }) 
    .catch(erro =>{
        return errorMsg(erro)
    })
}

function listUsers(){
    const container = document.querySelector('#container')
    
    let userList = document.querySelector('#userList')
    
    if(!userList){
        userList = criaElementoDom('table', [['id', 'userList']], ['table', 'table-striped', 'table-hover', 'table-sm', 'userList'], container, 'beforeend');
                
        criaHeaderTable(userList)
    } else{
        for(var i = userList.childNodes.length - 1; i >= 0; i--){
            userList.removeChild(userList.childNodes[i])
        }
        
        criaHeaderTable(userList)
    }
    
    
    axios('api/users/listusers')
    .then(response =>{
        if (response.data.erro){
            errorMsg(response.data.erro)
        } else{
            let tbody = criaElementoDom('tbody', [], [], userList, 'beforeend');
                        
            for( var e = 0; e < response.data.length; e++){
                let tr = criaElementoDom('tr', [], ['text-center', 'lineUsers'], tbody, 'beforeend');
                
                let tdu  = criaElementoDom('td', [], [], tr, 'beforeend');
                let tdl  = criaElementoDom('td', [], [], tr, 'beforeend');
                let tds  = criaElementoDom('td', [], [], tr, 'beforeend');
                let tdAE = criaElementoDom('td', [], [], tr, 'beforeend');

                let tda  = criaElementoDom('i', [], ['bi', 'bi-pencil', 'altexc'], tdAE, 'beforeend');
                let tde  = criaElementoDom('i', [], ['bi', 'bi-trash', 'altexc'], tdAE, 'beforeend');
                
                tdu.innerText = response.data[e].user
                tdl.innerText = ['', 'Supervisor', 'Intermediário', 'Básico'][parseInt(response.data[e].level)]

                tda.dataset.id = response.data[e]._id
                tda.dataset.user = response.data[e].user
               
                tde.dataset.id = response.data[e]._id

                tda.addEventListener('click', (e)=>{
                    switchModal(true, e)
                    //alteraUsuario(e)
                })
                
                tde.addEventListener('click', (e)=>{
                    excluiUsuario(e)
                })
            }
        }
    }) 
    .catch(erro =>{
        errorMsg(erro)
    })

    return    
}

function criaHeaderTable(el){
    let thead = criaElementoDom('thead', [], [], el, 'beforeend')
    let tr  = criaElementoDom('tr', [], ['text-center'], thead, 'beforeend')
    let thu = criaElementoDom('th', [], [], tr, 'beforeend')
    let thl = criaElementoDom('th', [], [], tr, 'beforeend')
    let tha = criaElementoDom('th', [], [], tr, 'beforeend')
    let thd = criaElementoDom('th', [], [], tr, 'beforeend')

    thu.innerText = 'Usuário'
    thl.innerText = 'Nível'
}

async function alteraUsuario(evt){
    const userClicked = evt.target.dataset.id;
    
    const data = {
        _id: userClicked,
    }
    
    const userP = document.querySelector("#pass")
    const usercP = document.querySelector("#cpass")
    const userL = document.querySelector("#nivelAuth")

    if(userP.value.length > 0 || usercP.value.length > 0){
        if(userP.value === usercP.value && userP.value.length >= 5){
            data.password = userP.value
        } else {
            return errorMsg('Para alterar senha, o campo senha e confirmação devem coincidir e conter mais que 5 caraceteres. Caso não deseje alterar a senha,' +
                            ' mantenha os campos senha/confirmação em branco!')
        }
    }

    data.level = userL.value

    axios.post('api/users/alterausuario', data)
    .then(response =>{
        if (response.data.erro){
            return errorMsg(response.data.erro)
        } else{
            evt.target.parentElement.parentElement.childNodes[1].innerText = ['', 'Supervisor', 'Intermediário', 'Básico'][parseInt(userL.value)]
            return errorMsg(response.data.mensagem)
        }
    }) 
    .catch(erro =>{
        return errorMsg(erro)
    })
    
    userN = ''
    userP.value = ''
    usercP.value = ''

    userN.disabled = false
    switchModal()
}

async function excluiUsuario(evt){
    const userClicked = evt.target.dataset.id;

    const data = {
        _id: userClicked,
    }
    
    msgSimNao('Deseja realmente excluir este usuário?', 'Exclusão de usuário')
    .then((res)=>{
        if(res == 'Ok'){
            axios.post('api/users/deleteusuario', data)
            .then(response =>{
                if (response.data.erro){
                    return errorMsg(response.data.erro)
                } else{
                    evt.target.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode)
                    return errorMsg(response.data.mensagem)
                }
            }) 
            .catch(erro =>{
                return errorMsg(erro)
            })
        }
        return res
    })
    .catch(err=>{return console.log(err)})
}