function errorMsg(erro, titulo, trava){
    var dlgErro = document.getElementById('dlgErro');
    var bodyElm = [...document.getElementsByTagName('body')][0];
    
    trava = typeof(trava) != 'undefined' ? trava : false;
   
    if(dlgErro != null){
        var titErro = document.getElementById('titErro');
        var msgErro = document.getElementById('msgErro');

        titErro.innerText = typeof(titulo) != 'undefined' ? titulo : 'Erro'
        /*if(typeof(titulo) != 'undefined'){
            titErro.innerText = titulo;
        }*/

        if(typeof(erro) == 'object'){
            console.log(erro)
            msgErro.innerText = 'Erro, confira no console do navegador!';
        } else{
            msgErro.innerText = erro;
        }
        
        dlgErro.style.display = 'block';
    } else{
        dlgErro = criaElementoDom('dialog', [['id', 'dlgErro']], ['dlgErro'], bodyElm, 'afterbegin');
        
        dlgErro.style.display = 'block';
        
        var boxDlg = criaElementoDom('div', [['id', 'boxDlg']], ['boxDlg'], dlgErro, 'afterbegin');
        var btnErro = criaElementoDom('i', [['id', 'btnErro']], ['bi', 'bi-x-lg', 'btnErro'], boxDlg, 'beforeend');
    
        criaElementoDom('p', [['id', 'titErro']], ['titErro'], boxDlg, 'beforeend', typeof(titulo) != 'undefined' ? titulo : 'Erro');
        criaElementoDom('hr', [[]], ['sepErro'], boxDlg, 'beforeend');
        
        criaElementoDom('p', [['id', 'msgErro']], ['msgErro'], boxDlg, 'beforeend', erro);    
    
        if(!trava){
            btnErro.addEventListener('click',(e)=>{
                dlgErro.style.display = 'none';
            })        
        }
    }
}






async function msgSimNao(msg, titulo){
    var dlgSimNao = document.getElementById('dlgSimNao');
    var bodyElm = [...document.getElementsByTagName('body')][0];
    
   
    return new Promise((resolve,reject)=>{
        if(dlgSimNao != null){
            var titSimNao = document.getElementById('titSimNao');
            var msgSimNao = document.getElementById('msgSimNao');
    
            if(typeof(titulo) != 'undefined'){
                titSimNao.innerText = titulo;
            }
    
            msgSimNao.innerText = msg;
            dlgSimNao.style.display = 'block';
        } else{
            dlgSimNao = criaElementoDom('dialog', [['id', 'dlgSimNao']], ['dlgSimNao'], bodyElm, 'afterbegin');
            dlgSimNao.style.display = 'block';
            
            var boxDlg = criaElementoDom('div', [['id', 'boxDlgSimNao']], ['boxDlg'], dlgSimNao, 'afterbegin');
            var btnErro = criaElementoDom('i', [['id', 'btnSairSimNao']], ['bi', 'bi-x-lg', 'btnErro'], boxDlg, 'beforeend');
        
            criaElementoDom('p', [['id', 'titSimNao']], ['titErro'], boxDlg, 'beforeend', typeof(titulo) != 'undefined' ? titulo : 'Alerta');
            criaElementoDom('hr', [[]], ['sepSimNao'], boxDlg, 'beforeend');
            
            criaElementoDom('p', [['id', 'msgSimNao']], ['msgErro'], boxDlg, 'beforeend', msg);
        
            var btnOk = criaElementoDom('button', [['id', 'btnConfirma']], ['btnSimNao'], boxDlg, 'beforeend', 'Confirma');
            var btnNao = criaElementoDom('button', [['id', 'btnCancela']], ['btnSimNao'], boxDlg, 'beforeend', 'Cancela');
            
            btnErro.addEventListener('click',(e)=>{
                reject('Cancelou')
                dlgSimNao.parentNode.removeChild(dlgSimNao)
            })        

            btnOk.addEventListener('click',(e)=>{
                resolve('Ok')
                dlgSimNao.parentNode.removeChild(dlgSimNao)
            })        

            btnNao.addEventListener('click',(e)=>{
                reject('Cancelou')
                dlgSimNao.parentNode.removeChild(dlgSimNao)
            })        
        }
    })
   
}