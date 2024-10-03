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
    let btnCriarUsuario = document.getElementById("addUser")
    let parentBtnCriarUsuario = btnCriarUsuario.parentElement

    parentBtnCriarUsuario.removeChild(btnCriarUsuario)
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
        console.log(response)
        if (response.data.erro){
            return alert(response.data.erro)
        } else{
            return alert(response.data.mensagem)
        }

        switchModal();
    }) 
    .catch(erro =>{
        console.log(erro)
        return alert(erro)
    })
}