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



function CriarUsuario(){
    /*
        values dos campos para montar objeto e mandar via post
    */
    
    /*axios.post('api/users/criarusuario', {user, password})
    .then(response =>{
        if (response.data.erro){
            return alert(response.data.erro)
        } else{
            window.location.href = '/privado'
        }
    }) 
    .catch(erro =>{
        console.log(erro)
        return alert(erro)
    })*/
}





function destroyBtnAddUser(){
    let btnCriarUsuario = document.getElementById("addUser")
    let parentBtnCriarUsuario = btnCriarUsuario.parentElement

    parentBtnCriarUsuario.removeChild(btnCriarUsuario)
}