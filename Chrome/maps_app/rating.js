// ==UserScript==
// @name          Rattngs links
// @include       *
// @exclude        http://*imdb*/title/*
// @exclude        http://www.imdb.com/*
// @run-at document-end
// ==/UserScript==
if (location.href.match ('bj2.me'))
{
Array.prototype.indexOf = function(obj) {
	var i = this.length;
	while (i--) 
	{
		if (this[i] === obj)
			return i;
	}
	return -1;
} 

addStyle("#imdb_rating_blue {color: #658db4!important; font-weight:bold;background: url('http://img.bj2.me/files/1208mwz732.png') no-repeat scroll 0 0 transparent; display: inline-block;/*float: left;*/font-family: tahoma!important;font-size: 15px!important; font-weight: bold!important; height: 66px; line-height: 66px;padding-right: 5px; text-align: center;vertical-align: middle; width: 66px; text-shadow: 1px 1px 1px #fff!important;}");

addStyle("#imdb_rating_grey {color: #a3a3a3!important; font-weight:bold;background: url('http://img.bj2.me/files/1208mwz732.png') no-repeat scroll 0 0 transparent; display: inline-block;/*float: left;*/font-family: tahoma !important;font-size: 15px!important; font-weight: bold!important; height: 66px; line-height: 66px;padding-right: 5px; text-align: center;vertical-align: middle; width: 66px; text-shadow: 1px 1px 1px #fff!important;}");

addStyle("#imdb_rating_red  {color: #FF0000!important; font-weight:bold;background: url('http://img.bj2.me/files/1208mwz732.png') no-repeat scroll 0 0 transparent; color: black;display: inline-block;/*float: left;*/font-family: verdana!important;font-size: 15px!important; font-weight: bold!important; height: 66px; line-height: 66px;padding-right: 5px; text-align: center;vertical-align: middle; width: 66px; text-shadow: 1px 1px 1px #fff!important;}");

addStyle("#imdb_rating_unava  {font-weight:bold; text-shadow: 1px 1px 1px #fff!important;}");
		
linkifyIMDB();

var uniqueLinks = new Array();
var ratings = new Array();

var imdbSnapshot = document.evaluate("//a[contains(@href,'imdb.com/title/tt')]", document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
var imdbTotal = imdbSnapshot.snapshotLength;
var imdbCurrent = 0;

if (imdbTotal > 0)
{
	processLink(imdbSnapshot.snapshotItem(imdbCurrent));
}

function linkifyIMDB()
{   
	var forbiddenParents = ['a', 'head', 'script', 'style', 'title', 'option', 'iframe', 'textarea'];
	
	var imdbMovieRegex = new RegExp("http:\/\/(?:www\\.|)imdb\\.com\/title\/tt\\d+\/?", "g");
	var altText, tekst, muligtLink;
	
	var path = "//text()[not(parent::" + forbiddenParents.join(" or parent::") + ")]";
	altText = document.evaluate(path, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

	var i = altText.snapshotLength;
	while (i--)  
	{
		tekst = altText.snapshotItem(i);

		muligtLink = tekst.nodeValue; 
		
		if (imdbMovieRegex.test(muligtLink))  
		{
			var span = document.createElement('span');
			var lastLastIndex = 0;
			imdbMovieRegex.lastIndex = 0;
			var myArray = null; 
			
			while (myArray = imdbMovieRegex.exec(muligtLink))
			{
				var link = myArray[0];
				span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex, myArray.index)));
				var a = document.createElement('a');
				a.appendChild(document.createTextNode(link));
				
				a.setAttribute('href', link);
				span.appendChild(a);
				lastLastIndex = imdbMovieRegex.lastIndex; 
			}
			span.appendChild(document.createTextNode(muligtLink.substring(lastLastIndex)));
			tekst.parentNode.replaceChild(span, tekst);
		}
	}
}
	
function processLink(imdbLink)
{ 
	var imdbId = imdbLink.href.match(/tt\d+/)[0];
	
	var i = uniqueLinks.indexOf(imdbId)
	
	if (i >= 0)
	{
		var spanNode = document.createElement("span");
		
		buildRatingNode(spanNode, ratings[i]);	
	    if(i >= 1)
        {	  
		imdbLink.parentNode.insertBefore(spanNode, imdbLink);
		}
				
		imdbCurrent++;
		
		if (imdbCurrent < imdbTotal)
		{
			processLink(imdbSnapshot.snapshotItem(imdbCurrent));
		} 
	}
	else 
	{
     GM_xmlhttpRequest({
			method: 'GET',
			url: 'http://www.imdbapi.com/?i=' + imdbId + '&r=JSON',
			headers: {  
			},  
			onload: function(result) {  
				
				var spanNode = document.createElement("span"); 
				
				var percRating = result.responseText.match(/"imdbRating":"(.+?)"/);
				uniqueLinks.push(imdbId);
				
				if (percRating == null)
				{
					ratings.push(null);
					spanNode.id = 'imdb_rating_unava';
					spanNode.appendChild(document.createTextNode(" [N/A] "));
				}
				else
				{				
					ratings.push(percRating[1]);									
					buildRatingNode(spanNode, percRating[1]); 
				}
				
				imdbLink.parentNode.insertBefore(spanNode, imdbLink);
				
				imdbCurrent++;
				
				if (imdbCurrent < imdbTotal)
				{
					processLink(imdbSnapshot.snapshotItem(imdbCurrent));
				}
			}
		});
	}
				
	
	function buildRatingNode(parentNode, rating)
	{
		//var ratingNode = document.createTextNode(" [" + rating + "/10] ");
		var ratingNode = document.createTextNode(" "+ rating + " "); 
		
		if (rating ==  ' N/A ')
		{
			parentNode.id = 'imdb_rating_unava';
		}
		else		
		{
			if (rating >= 7.0)
				parentNode.id = 'imdb_rating_red';
				
			if ((rating < 7.0) && (rating > 3.0))
				parentNode.id = 'imdb_rating_blue';
				
			if (rating <= 3.0)
				parentNode.id = 'imdb_rating_grey';
		}
		
		parentNode.appendChild(ratingNode);
	}
	
}
// EMULACAO DAS FUNCOES GM_* PARA CHROME E OPERA
// emulate GM functions by TarquinWJ
// version 1.3.1
// see http://www.howtocreate.co.uk/operaStuff/userJavaScript.html for details
/* GM_xmlhttpRequest implementation adapted from the
Turnabout GM compatibility library:
http://www.reifysoft.com/turnabout.php
Used under the following license:

 Copyright (c) 2005, Reify Software, Inc.
 All rights reserved.

 Redistribution and use in source and binary forms,
 with or without modification, are permitted provided
 that the following conditions are met:

 1) Redistributions of source code must retain the
    above copyright notice, this list of conditions
    and the following disclaimer.
 2) Redistributions in binary form must reproduce the
    above copyright notice, this list of conditions
    and the following disclaimer in the documentation
    and/or other materials provided with the
    distribution.
 3) Neither the name of the Reify Software, Inc. nor
    the names of its contributors may be used to
    endorse or promote products derived from this
    software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS
 AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED    
 WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A
 PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL
 THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY
 DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
 PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF
 USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION)
 HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER
 IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
 NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE
 USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY
 OF SUCH DAMAGE.
*/
//yes, I know the domain limitations, but it's better than an outright error
function GM_xmlhttpRequest(details) {
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        var responseState = {
            responseXML:(xmlhttp.readyState==4 ? xmlhttp.responseXML : ''),
            responseText:(xmlhttp.readyState==4 ? xmlhttp.responseText : ''),
            readyState:xmlhttp.readyState,
            responseHeaders:(xmlhttp.readyState==4 ? xmlhttp.getAllResponseHeaders() : ''),
            status:(xmlhttp.readyState==4 ? xmlhttp.status : 0),
            statusText:(xmlhttp.readyState==4 ? xmlhttp.statusText : '')
        }
        if (details["onreadystatechange"]) {
            details["onreadystatechange"](responseState);
        }
        if (xmlhttp.readyState==4) {
            if (details["onload"] && xmlhttp.status>=200 && xmlhttp.status<300) {
                details["onload"](responseState);
            }
            if (details["onerror"] && (xmlhttp.status<200 || xmlhttp.status>=300)) {
                details["onerror"](responseState);
            }
        }
    }
    try {
      //cannot do cross domain
      xmlhttp.open(details.method, details.url);
    } catch(e) {
      if( details["onerror"] ) {
        //simulate a real error
        details["onerror"]({responseXML:'',responseText:'',readyState:4,responseHeaders:'',status:403,statusText:'Forbidden'});
      }
      return;
    }
    if (details.headers) {
        for (var prop in details.headers) {
            xmlhttp.setRequestHeader(prop, details.headers[prop]);
        }
    }
    xmlhttp.send((typeof(details.data)!='undefined')?details.data:null);
} 
function addStyle(css)
{
    var newstyle = document.createElement("style");
    newstyle.setAttribute("type", "text/css");
    newstyle.appendChild(document.createTextNode(css));
    document.getElementsByTagName("head")[0].appendChild(newstyle);
}
}