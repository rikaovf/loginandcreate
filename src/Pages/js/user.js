function switchModal(){
    const modal = document.querySelector("#createUser")
    const actualState = modal.style.display

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
        alert("Um ou mais campos incompletos, favor preencher todos os campos!")
        
        return
    } else if(userName.value.length > 30){
        alert("Campo de usuário excede o valor máximo de 30 caracteres!")
        userName.value = ''
        
        return
    } 

    if(userPass.value.length == 0 || userPass.value.length < 5){
        userPass.value = ''
        usercPass.value = ''
        alert('Campo senha vazio, ou menor que o esperado (5 caracteres)')
        return
    }
    
    if(!(userPass.value == usercPass.value)){
        userPass.value = ''
        usercPass.value = ''

       alert("Senhas devem concidir, confira e digite novamente!") 
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
            alert(response.data.erro)
        } else{
            alert(response.data.mensagem)
            
            userName.value = ''
            userPass.value = ''
            usercPass.value = ''

            switchModal();
        }

        return 
    }) 
    .catch(erro =>{
        console.log(erro)
        return alert(erro)
    })
}

function listUsers(){
    const container = document.querySelector('#container')
    
    let userList = document.querySelector('#userList')
    
    if(!userList){
        userList = document.createElement('table')
        userList.setAttribute('id', 'userList')
        userList.classList.add('table', 'table-striped', 'table-hover', 'table-sm', 'userList')
        
        container.insertAdjacentElement('beforeend', userList)
        
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
            alert(response.data.erro)
        } else{
            let tbody = document.createElement('tbody')
            userList.insertAdjacentElement('beforeend', tbody)
            
            for( var e = 0; e < response.data.length; e++){
                let tr = document.createElement('tr')
                tr.classList.add('text-center')

                let tdu = document.createElement('td')
                let tdl = document.createElement('td')
                let tds = document.createElement('td')
                let tdAE = document.createElement('td')
                let tda = document.createElement('i')
                let tde = document.createElement('i')

                tdu.innerText = response.data[e].user
                tdl.innerText = ['', 'Supervisor', 'Intermediário', 'Básico'][parseInt(response.data[e].level)]
                
                
                tda.classList.add('bi', 'bi-pencil', 'altexc')
                tde.classList.add('bi', 'bi-trash', 'altexc')
                tda.dataset.id = response.data[e]._id
                tde.dataset.id = response.data[e]._id
                
                tda.addEventListener('click', (e)=>{
                    alteraUsuario(e)
                })
                
                tde.addEventListener('click', (e)=>{
                    excluiUsuario(e)
                })
                                
                tdAE.insertAdjacentElement('beforeend', tda)
                tdAE.insertAdjacentElement('beforeend', tde)

                tbody.insertAdjacentElement('beforeend', tr)
                tr.insertAdjacentElement('beforeend', tdu)
                tr.insertAdjacentElement('beforeend', tdl)
                tr.insertAdjacentElement('beforeend', tds)
                tr.insertAdjacentElement('beforeend', tdAE)
            }
        }
    }) 
    .catch(erro =>{
        console.log(erro)
        alert(erro)
    })

    return    
}

function criaHeaderTable(el){
    let thead = document.createElement('thead')
    let tr = document.createElement('tr')
    let thu = document.createElement('th')
    let thl = document.createElement('th')
    let tha = document.createElement('th')
    let thd = document.createElement('th')

    tr.classList.add('text-center')

    el.insertAdjacentElement('beforeend', thead)
    thead.insertAdjacentElement('beforeend', tr)

    thu.innerText = 'Usuário'
    thl.innerText = 'Nível'
    /*tha.innerText = 'Alterar'
    thd.innerHTML = 'Excluir'*/

    tr.insertAdjacentElement('beforeend', thu)
    tr.insertAdjacentElement('beforeend', thl)
    tr.insertAdjacentElement('beforeend', tha)
    tr.insertAdjacentElement('beforeend', thd)
}

async function alteraUsuario(evt){
    /*const userClicked = evt.target.dataset.id;

    const data = {
        _id: userClicked,
    }
    
    axios.post('api/users/criarusuario', data)
    .then(response =>{
        if (response.data.erro){
            alert(response.data.erro)
        } else{
            alert(response.data.mensagem)
            
            userName.value = ''
            userPass.value = ''
            usercPass.value = ''

            switchModal();
        }

        return 
    }) 
    .catch(erro =>{
        console.log(erro)
        return alert(erro)
    })*/
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
                    return alert(response.data.erro)
                } else{
                    evt.target.parentNode.parentNode.parentNode.removeChild(evt.target.parentNode.parentNode)
                    return alert(response.data.mensagem)
                }
            }) 
            .catch(erro =>{
                return alert(erro)
            })
        }
        return res
    })
    .catch(err=>{return console.log(err)})
}