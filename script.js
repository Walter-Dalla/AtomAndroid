var inputElement = document.getElementById("numeroId");
var buttonElement = document.getElementById('requisicao');
var divForm = document.querySelector('#jojo');

function fechar(){
    popUp = document.getElementById('popUp');
    popUp.parentNode.removeChild(popUp);
}

function enviaRespota(ev){
    let array = sendForm(ev);
    let verifica = 0;
    
    for(let i = 0; i < array.length; i++){
        if(array[i].resposta == "")
        {
            verifica += 1;
        }
    }

    if(verifica >= 1)
    {
        let popUp = document.createElement('div');
        popUp.setAttribute('id','popUp');
        popUp.setAttribute('class','centro');
        popUp.setAttribute('onclick','fechar()');
        txt = document.createElement('h3');
        txt.appendChild(document.createTextNode('Preencha todos os campos'));
        popUp.appendChild(txt);
        let div = document.getElementById('main');
        div.appendChild(popUp);
    }else
    {
        axios.post('http://143.106.73.94:5000/formulario/resposta/' + {"idCampoFormulario":formId, "camposResposta":array})
        .then(function(){
            let popUp = document.createElement('div');
            popUp.setAttribute('id','popUp');
            popUp.setAttribute('class','centro');
            popUp.setAttribute('onClick','fechar()');
            popUp.style.color = '#4177f6';
            txt = document.createElement('h3');
            txt.appendChild(document.createTextNode('Resposta enviada, obrigado por contribuir'));
            popUp.appendChild(txt);
            let div = document.getElementById('main');
            div.appendChild(popUp);
            for (let i = 0; i < array.length; i++){
                document.getElementById(array[i].idCampoFormulario).value = "";
            }
        }) 
        .catch(function(error){
            console.warn(error);
        })
    }
}

function sendForm(ev){
    var arrayRespostas = [];
    var i = [];
    var j = [];
    var array = [];
    for (let i = 0; i < ev.path[4].all[12].length; i++) {
        array[i] = ev.path[4].all[12][i]
    }

    for(let n = 0; n < array.length; n++) {
        i[n] = array[n].id;
        j[n] = array[n].value;
    }

    for(var m=0; m<j.length; m++) {
        arrayRespostas[m] = {idCampoFormulario: i[m], resposta: j[m]};
    }
    return(arrayRespostas);
}

function enviaRequisicao(){
    formId = inputElement.value;
    axios.get('http://143.106.73.94:5000/formulario?id=' + formId)
    .then(function(response){
        getTitle(response);
    })
        .catch(function(error){
        console.warn(error);
    })

    axios.get('http://143.106.73.94:5000/formulario/resposta/' + formId)
    .then(function(response){
        printForm(response);
    })
        .catch(function(error){
        console.warn(error);
    })

    inputElement.value = '';
}

function getTitle(json){
    divForm.innerHTML = "";

    var title = document.createElement('h2');
    title.appendChild(document.createTextNode(json.data.content[0].nomeFormulario));
    divForm.appendChild(title);
}

function printForm(json){
    let array = json.data;

    array.forEach(element => {
        var div1 = document.createElement('div');
        div1.setAttribute('class','centro');
        let div2 = document.createElement('div');
        div2.setAttribute('class','formCampo');
        let label = document.createElement('label');
        label.appendChild(document.createTextNode(element.campo.label));
        let input = document.createElement('input');
        input.setAttribute('type',element.campo.type);
        input.setAttribute('placeholder',element.campo.placeholder);
        input.setAttribute('minlenght',element.campo.minlenght);
        input.setAttribute('maxlenght',element.campo.maxlenght);
        input.setAttribute('id',element.id);
        input.setAttribute('class','centro');

        divForm.appendChild(div1);
        div1.appendChild(div2);
        div2.appendChild(label);
        div2.appendChild(document.createElement('br'));
        div2.appendChild(input);
    });
    
    var btnEnviar = document.getElementById('divSecundaria');
    btnEnviar.removeAttribute('disabled');
    btnEnviar.style.visibility = "visible";
}