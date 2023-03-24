'use strict';

console.log("BK# BUCKGROUND");

var tmpTimerUrl = "";


function msgReceiver(req, sender, sendRes) {
  
  console.log("BK# Messager receive from popup : " , req); //msg is an obj! be cool 
  console.log("BK# Get keys ", Object.keys(req.data));

  console.log("BK# Get value ", req.data.operation)

  switch(req.data.operation){
    case 'SEARCH': 
      console.log("BK# Dentro il case");
      searchTimerUrl(req.data, sendRes);
      break;
    case "SAVE" : 
      saveTimerUrl();
      break;
    case "EDIT":
      editTimerUrl();
      break;
    case "DELETE" : 
      deleteTimerUrl();    
      break;
      default : break;
  }
}


async function searchTimerUrl(req, sendRes){

  let rep;

  console.log("BK# dentro search :", req, sendRes);

  console.log("BK# url : ", req.url);


 // var value = browser.storage.local.set({ [title] : body }); -> per il salvataggio 

 var objDomainUrl =  browser.storage.local.get([req.url]);

 console.log("BK# Domain get from storage, ", objDomainUrl);


 if(objDomainUrl){
  rep = getDtoResponse(req.url, false, null, null);
 }else{
  rep = "ciao";
  console.log("BK# response");
 }

 console.log("BK# RESPONSE ", rep);




  sendRes({
    response : rep
  });

}


function editTimerUrl(obj){
  
}

function saveTimerUrl(req, sendRes){

  if(req){
    return {};
  }

  let objDomain = browser.storage.local.set()
}  //interrogazione storage


function deleteTimerUrl(obj){

}

function getDtoResponse(id, status, time, timeRemain){
  
  var dto = {
    url : id, // not null
    active : status, // true false 
    timer : time, // millisencond
    time_left : timeRemain // millisecond
  }

  //locked
  //unlockAt

  return dto;
}

function msgSender(req, sender, sendRes) {

 //console.log("BK# req-sender-sendRes-data ", req, sender, sendRes, data);
  let data = {};
  sendRes({
    response: data
  });

}

function handleActivated(activeInfo) {
  
  console.log("BK# Tab " + activeInfo.tabId +
              " was activated");

  console.log("info obj ", activeInfo);

  var query = browser.tabs.query({ currentWindow: true, active: true });

  query
    .then(tabs => getUrl(tabs))
    .then(url => updateTimerUrl(url))
    .catch(error => console.error(error));
}



function updateTimerUrl(url){

  if(url){
    console.log("non valida");
  }

  //controlllo db


}




// url name of the url 
function getTimerUrl(url){


}

function getUrl(tabs){ // tabs is []obj always had data

  var tabURL = tabs[0].url;
  const url = new URL(tabURL);

  return url.hostname;
}


function onSucces(operation){
  console.log("BK# Operation " + operation + " went successfully");
}

function onError(error) {
  console.log(error)
}



browser.tabs.onActivated.addListener(handleActivated);

browser.runtime.onMessage.addListener(msgReceiver);
browser.runtime.onMessage.addListener(msgSender);