// ==UserScript==
// @name        filmowbjlink
// @namespace   filmowbjlink
// @description Cria um link para pesquisa no BJ2
// @include     http://filmow.com/* 
// @exclude    http://www.imdb.com/title/tt*/
// @exclude    http://bj2.me/*
// @version     1.0 
// @run-at document-start
// ==/UserScript==   

window.onload = addIshountLink();

function addIshountLink(cssString) {

   var titleBlockElem = document.evaluate(
       ".//div[@class='movieTitle']",
       document,
       null,
       XPathResult.FIRST_ORDERED_NODE_TYPE,
       null
   ).singleNodeValue; 
   
   var originalTitleText;
   try {
       originalTitleText = document.evaluate(
           ".//h1[@itemprop='name']/text()",
           titleBlockElem,
           null,
           XPathResult.STRING_TYPE,
           null
       ).stringValue.replace(/^\s*/, "").replace(/\s*$/, "");
   } catch (err) {
       return;
   }
   
   if (originalTitleText == "") {
       originalTitleText = document.evaluate(
           "./text()",
           titleBlockElem,
           null,
           XPathResult.STRING_TYPE,
           null
       ).stringValue.replace(/^\s*/, "").replace(/\s*$/, "");
   }
   //console.debug("3:" + originalTitleText);
   

   var yearElem = document.evaluate(
       "./small[@class='release']",
       titleBlockElem,
       null,
       XPathResult.FIRST_ORDERED_NODE_TYPE,
       null
   ).singleNodeValue;

   
  // console.debug("Criando Elemento link");
   var linkElem = document.createElement("a");
   linkElem.href = "http://www.bj2.me/pesquisa_videos.php?search=" + originalTitleText + "&cat=0&termos=todas&ano=0&audio=0&extensao=0&qualidade=0&codec1=0&codec2=0&idioma=0"; 
   linkElem.setAttribute('target','_blank');

//  var linkElem720p = document.createElement("a");
//  linkElem720p.href = "http://www.bj2.me/pesquisa_videos.php?search=" + originalTitleText + //"&cat=0&termos=todas&ano=0&audio=0&extensao=0&qualidade=1&codec1=0&codec2=0&idioma=0" ;
//  linkElem720p.style.fontSize = "8px";

   var linkElem1080p = document.createElement("a");
   linkElem1080p.href = "http://www.bj2.me/pesquisa_videos.php?search=" + originalTitleText + "&cat=0&termos=todas&ano=0&audio=0&extensao=0&qualidade=14&codec1=0&codec2=0&idioma=0";
   linkElem1080p.setAttribute('target','_blank');
   
    var linkElem3d = document.createElement("a");
    linkElem3d.href = "http://www.bj2.me/pesquisa_videos.php?search=" + originalTitleText + "&cat=0&d3=1&termos=todas&ano=0&audio=0&extensao=0&qualidade=14&codec1=0&codec2=0&idioma=0" ;
   linkElem3d.setAttribute('target','_blank');
   
   //console.debug("Criando Elemento imagem");
   var imgElem = document.createElement("img");
   imgElem.src = "http://i49.tinypic.com/2evssif.png";
   imgElem.width = 50;
   imgElem.height = 24;
   imgElem.alt = "Pesquisar e Baixar no BJ2";
   imgElem.title ="Pesquisar e Baixar no BJ2"; 
   
   //console.debug("Criando elemento imagem 2");
   var imgElemhd = document.createElement("img");
   imgElemhd.src = "http://i49.tinypic.com/erlsh2.png";
   imgElemhd.width = 28;
   imgElemhd.height = 23;
   imgElemhd.alt = "Pesquisar e Baixar no BJ2";
   imgElemhd.title ="Pesquisar e Baixar no BJ2";  
   
   //3d
   var imgElem3d = document.createElement("img");
   imgElem3d.src = "http://i45.tinypic.com/35n33u9.png";
   imgElem3d.width = 28;
   imgElem3d.height = 23;
   imgElem3d.alt = "Pesquisar em 3D?";
   imgElem3d.title ="Pesquisar em 3D?"; 
   
   //console.debug("Inserindo Imagem");
   linkElem.appendChild(imgElem);
   linkElem1080p.appendChild(imgElemhd); 
   linkElem3d.appendChild(imgElem3d);
   
   //console.debug("iInserindo link");
   yearElem.appendChild(document.createTextNode(" "));
   yearElem.appendChild(linkElem);
   yearElem.appendChild(document.createTextNode(" "));
   yearElem.appendChild(linkElem1080p); 
   yearElem.appendChild(document.createTextNode(" "));
   yearElem.appendChild(linkElem3d);
   
   console.debug("IMDbjlink Executado");
}