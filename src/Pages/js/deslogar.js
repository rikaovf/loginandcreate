function Deslogar(){
    axios('api/users/deslogar')
    .then(response =>{
        if (response.data.erro){
            return alert(response.data.erro)
        } else{
            window.location.href = '/'
        }
    })
    .catch(erro =>{
        console.log(erro)
        return alert(erro)
    })
}