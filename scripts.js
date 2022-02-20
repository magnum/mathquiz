let ok = 0
let ko = 0;
let numeroOperazioni = 10;
let numeroMassimoSommeSottrazioni = 100;
let numeroMassimoMoltipliceEDivisioni = 10;
let secondiMaxPerOperazione = 10;
let count;
let domanda = new bootstrap.Modal(document.getElementById('domanda'), {});
let risultato;
let operatore;
const operatori = ["+","-","*","/"];
//const operatori = ["/"];
let operazione;
let numero1;
let numero2;
let inizioTimer;
let timeoutInterval;
let timeoutTimer;
let domandaModal = new bootstrap.Modal(document.getElementById('domanda'), {
  backdrop: "static",
  keyboard: false
});

document.getElementById("inizia").addEventListener("click", (e) => {
  e.preventDefault();
  setup();
})

document.getElementById("ricomincia").addEventListener("click", (e) => {
  e.preventDefault();
  ricomincia();
})

document.getElementById("conferma").addEventListener("click", (e) => {
  e.preventDefault();
  leggiRisposta();
})


document.getElementById("positivo").addEventListener("click", (e) => {
  e.preventDefault();
  let valore = document.getElementById("risposta").value.replace("-","");
  document.getElementById("risposta").value = valore;
})


document.getElementById("negativo").addEventListener("click", (e) => {
  e.preventDefault();
  let valore = document.getElementById("risposta").value.replace("-","");
  document.getElementById("risposta").value = parseInt(`-${valore}`);
})


document.addEventListener('keyup', (event) => {
  const keyName = event.key;
  if (event.keyCode === 13) {
    console.log("enter pressed");
    if(document.getElementById('domanda').classList.contains("show")) document.getElementById("conferma").click();
  }
}, false);


const setup = () => {
  document.getElementById("inizia").classList.toggle('d-none');
  setTimeout(()=>{
    numeroOperazioni = parseInt(window.prompt("quante operazioni vuoi?", numeroOperazioni)) || numeroOperazioni;
    numeroMassimoSommeSottrazioni = parseInt(window.prompt("per + e - numeri grandi fino a...", numeroMassimoSommeSottrazioni)) || numeroMassimoSommeSottrazioni;
    numeroMassimoMoltipliceEDivisioni = parseInt(window.prompt("per * e / secondo operatore < di...", numeroMassimoMoltipliceEDivisioni)) || numeroMassimoMoltipliceEDivisioni;
    secondiMaxPerOperazione = parseInt(window.prompt("tempo massimo per operazione in secondi?", secondiMaxPerOperazione)) || secondiMaxPerOperazione;
    inizia();
  }, 100)
}


const inizia = () => {
  document.getElementById("inizia").classList.add('d-none');
  document.getElementById("ricomincia").classList.remove('d-none');
  count = numeroOperazioni;
  faiDomanda();
}


const ricomincia = () => {
  ok = 0
  ko = 0;
  document.getElementById("inizia").classList.toggle('d-none');
  document.getElementById("ricomincia").classList.toggle('d-none');
  document.getElementById("operazioni").replaceChildren("");
  inizia();
}

const timerRisposta = () => {
  let fineTimer = moment().add(secondiMaxPerOperazione, 'seconds');
  timeoutInterval = setInterval(()=>{
    const tempoRimanente = moment(fineTimer-moment()).format("mm:ss");
    const stingaTimer = `tempo rimanente ${tempoRimanente}s`;
    for (const element of document.getElementsByClassName("timer")){
      element.innerText = stingaTimer;
    }
  }, 100)
  timeoutTimer = setTimeout(()=>{
    document.getElementById("conferma").click();
    clearInterval(timeoutInterval);
  }, secondiMaxPerOperazione*1000)
}


const calcolaRisultato = () => {
  operazione = `${numero1}${operatore}${numero2}`;
  risultato = eval(operazione).toFixed(1);
}

const faiDomanda = () => {
  operatore = operatori[Math.floor(Math.random()*operatori.length)];
  const operatore1Massimo = numeroMassimoSommeSottrazioni;
  const operatore2Massimo = ["+","-"].indexOf(operatore) != -1 ? numeroMassimoSommeSottrazioni : numeroMassimoMoltipliceEDivisioni
  numero1 = Math.round(Math.random()*operatore1Massimo);
  numero2 = Math.round(Math.random()*operatore2Massimo);
  //if(["+","-","/"].indexOf(operatore) != -1 && numero1<numero2) {
  if(["/"].indexOf(operatore) != -1 && numero1<numero2) {
    [numero1, numero2] = [numero2, numero1]
  }
  if(operatore == "/") {
    calcolaRisultato();
    const resto = risultato % 1;
    if(resto > 0) {
      numero1 = (numero1 % numero2)*numero2;
    }
    if(numero2==0) numero2 =1;
  }
  calcolaRisultato();
  document.querySelector("#domanda .content").innerText = operazione;
  document.getElementById("risposta").value = "";
  document.querySelector("#domandaLabel").innerText = `Domanda ${(numeroOperazioni-count)+1}`
  if(!document.getElementById('domanda').classList.contains("show")) domandaModal.show();
  document.querySelector("#risposta").focus();
  console.log(`${operazione} = ${risultato}`);
  clearTimeout(timeoutTimer);
  inizioTimer = moment();
  timerRisposta();
}


const leggiRisposta = () => {
  const risposta = document.querySelector("#risposta").value;
  mostraRisposta(operazione, risultato, risposta);
  aggiornaStato();
  count --;
  if(count>0) {
    setTimeout(() => faiDomanda(), 0);
  } else {
    domandaModal.hide();
  }
  clearTimeout(timeoutTimer);
  clearInterval(timeoutInterval);
}


const mostraRisposta = (operazione, risultato, risposta ) => {
  let classeRisposta = "bg-success";
  let suggerimenti = "";
  if(parseFloat(risposta) == risultato){
    ok ++;
  } else {
    ko ++;
    classeRisposta = "bg-danger";
    suggerimenti = ` ${risultato}`
  }
  const html = `
    <div class="row mb-2">
      <div class="col-12 fs-4">${operazione} = <span class="badge ${classeRisposta}">${risposta}</span>${suggerimenti}</div>
    </div>
  `;
  document.getElementById("operazioni").insertAdjacentHTML('beforeend', html);
}


const aggiornaStato = () => {
  const percentuale = (ok/numeroOperazioni*100).toFixed()
  document.getElementById("stato").innerText = `indovinate ${ok} su ${numeroOperazioni}, pari a ${percentuale}%`;
}