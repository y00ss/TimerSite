'use strict';

console.log("PP# POPUP");

// il BK dovrebbe disegnare il layout del popup per le casistiche : 
// 1- (INIT) se URL e' gia esistente la configurazione timer
//    VERO  -> allora inviare valore checkcbox e timer al popup
//    FALSO -> attivare layout di default 

// 2- (SAVE) var tmps == ''
// 3- (EDIT)  var tmps != new
// 4- (DELETE) var tmp != ''  -> attivare pulsanse solo se URL e preisistente 

var idTimer = ""; // name url

//salto questa parte quando comunico con il background
var querying = browser.tabs.query({ currentWindow: true, active: true });

querying
  .then(domainName => getDomainName(domainName))
  .then(url_name => hadActiveTimer(url_name))
  .then(result => activeForm(result))
  .then(active => activeDefault(active))
  .catch((error) => {
    console.error("Timer not valid for this page");
    this.onError(error);
  });

var tActive = document.getElementById('twebsite');
var frmTimer = document.getElementById('timer');

var btnConfirm = document.getElementById('btn-confirm');
var btnReset = document.getElementById('btn-reset');

tActive.addEventListener('click', function(){

  console.log("sono dentro controllo value: " + this.checked);
  if(this.checked) //active 
  {
    document.getElementById('timer').removeAttribute('readonly');

  }else{
    document.getElementById('timer').setAttribute('readonly', true);
  }
  console.log("finito if");
});


btnConfirm.addEventListener('click', function(){

  console.log("dentro pulzante");
  
  var valCheckbox = twebsite.checked; 
  var valTimer = frmTimer.value;

  console.log("valore checkbox " + twebsite.checked + " valore timer" + valTimer);

  //
  if(!valCheckbox){
  
  }

  // base structur
  var data = {
    'id' : idTimer,
    'status': valCheckbox,
    'timer': valTimer,
    'operation': 'SAVE',
    'timestamp': Date.now()
  }

  console.log(data);
  const sending = browser.runtime.sendMessage({
    action: data
  });

  sending.then (
    (background) => {
        console.log("PP# From the background script:", background.response);
        window.close();
    },
    (error) => {
        console.error(`Background script error: ${error}`);
    }
  );
});


// solo se il dominio e valido
function activeForm(obj) {

  console.log("PP# Value obj", obj);

  if (!obj) // is empty
    return false;

  var divForm = document.getElementById("tform");
  var span = document.getElementById("domain-name");

  span.textContent = obj.url;
  divForm.style.display = "block";

  return true;
}


// comunico al bk se il url e' gia preisitente o meno 
async function hadActiveTimer(url_name){

  console.log("PP# Start active timere comunication", url_name);

  if(!url_name){
    console.log("PP# Url not valid");
    return bkResponse; // empty
  }

  let data = {
    url : url_name, 
    operation : 'SEARCH',
    timestamp : Date.now() 
  }

  // INVIO MESSAGGIO  
  let sending =  await browser.runtime.sendMessage({
    data
  }).then(
    (background) => {
      console.log("PP# From the background script:", background.response);
       return background;
    }
  );

  console.log("PP# Print sending ", sending);

  console.log("QUIII", (bkResponse));//bkResponse
  return sending;
}

// se e' false attiva il default
function activeDefault(value) {

  if (value)
    return false;

  console.log("Default div " + value);
  var divDef = document.getElementById("tdefault");
  divDef.style.display = "block";

  return true;
}


function getDomainName(tabs) {

  let url = tabs[0].url;
  let obj = new URL(url);

  idTimer =  obj.hostname;

  return idTimer; // nome dominio... confusoo!!
}


// implementare a modo un funzione di errore
function onError(error) {
  console.log(error);
}