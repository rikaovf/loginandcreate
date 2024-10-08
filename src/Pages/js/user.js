var user, userMaster


axios('api/users/adminlogado')
.then(response =>{
    if (response.data.erro){
        destroyBtnAddUser()
        return alert(response.data.erro)
    } else{
        user = response.data.user
        userMaster = response.data.userMaster

        document.querySelector("#welcometext").innerText = `Bem-vindo ${user}!`

        // Somente usuário master pode criar/alterar/excluir usuarios.
        if (!userMaster){
            destroyBtnAddUser()
        }
    }
})
.catch(erro =>{
    destroyBtnAddUser()    
    return alert(erro)
})




function destroyBtnAddUser(){
    const btnCriarUsuario = document.getElementById("addUser")
    const btnListUser = document.getElementById("listUser")

    const parentBtnCriarUsuario = btnCriarUsuario.parentElement

    parentBtnCriarUsuario.removeChild(btnCriarUsuario)
    parentBtnCriarUsuario.removeChild(btnListUser)
}

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
                                
                tdu.innerText = response.data[e].user
                tdl.innerText = ['', 'Supervisor', 'Intermediário', 'Básico'][parseInt(response.data[e].level)]

                tbody.insertAdjacentElement('beforeend', tr)
                tr.insertAdjacentElement('beforeend', tdu)
                tr.insertAdjacentElement('beforeend', tdl)
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

    tr.classList.add('text-center')

    el.insertAdjacentElement('beforeend', thead)
    thead.insertAdjacentElement('beforeend', tr)

    thu.innerText = 'Usuário'
    thl.innerText = 'Nível'

    tr.insertAdjacentElement('beforeend', thu)
    tr.insertAdjacentElement('beforeend', thl)
}