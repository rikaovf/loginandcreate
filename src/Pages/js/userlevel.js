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

    if(btnCriarUsuario && btnListUser){
        const parentBtnCriarUsuario = btnCriarUsuario.parentElement

        parentBtnCriarUsuario.removeChild(btnCriarUsuario)
        parentBtnCriarUsuario.removeChild(btnListUser)
    }
}
