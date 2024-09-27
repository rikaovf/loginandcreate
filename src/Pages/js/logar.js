function Logar(){
    let user = document.getElementById('user').value
    let password = document.getElementById('password').value

    if(!user || !password){
        return alert('Digite todos os campos de login!')
    }

    axios.post('api/users/logar', {user, password})
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
    })
}
