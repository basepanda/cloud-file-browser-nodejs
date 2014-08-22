/*
###################################################################################
##     Cloud File Browser                                                        ##
###################################################################################

Copyright 2012-2014 Cloud Elements <http://www.cloud-elements.com>          

Licensed under the Apache License, Version 2.0 (the "License"); you may not
use this file except in compliance with the License. You may obtain a copy of
the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
License for the specific language governing permissions and limitations under
the License.

*/
(function(e){e.fn.cloudFileBrowser=function(e){cloudFileBrowser.buildDomEls(this.selector,function(){CloudElements.init(e)})}})(jQuery);var cloudFileBrowser=function(){var e=null,t=null,n=null,r="#services-tabs",i="#services-containers",s={},o="";return{init:function(r,i,s){e=r;t=i;n=s;console.log("Services Installed: ",e);cloudFileBrowser.selectedFiles={};this.buildTabs();this.bindTabs();this.bindProvisionButtons();this.initDragDropHandlers()},initDragDropHandlers:function(){if(window.File){$(".drop-zone").on("dragover",function(e){e.preventDefault();e.stopPropagation()});$(".drop-zone").on("dragenter",function(e){e.preventDefault();e.stopPropagation()})}},buildDomEls:function(e,t){var n='<section id="tab-container"><ul id="services-tabs"></ul><section id="services-containers"></section><section id="file-info"><div class="preview"><a class="close" href="#"></a></div><h2>File Details</h2><div class="fileDetails"></div></section></section><section id="loading"><span><i></i></span></section><section id="error"></section>';$(e).append(n);t()},buildTabs:function(){var s="",o="";for(var u=0;u<e.length;u++){s+='<li class="'+e[u]+(u==0?" on":"")+'"><img src="'+n[u]+'">'+t[u]+"</li>";o+='<div class="'+e[u]+(u==0?" on":"")+' drop-zone" aria-element="'+e[u]+'">'+'<h2><img src="'+n[u]+'"></h2>'+'<a href="#" class="provision" aria-element="'+e[u]+'">Connect to your '+t[u]+" account</a>"+"</div>"}$(r).append(s);$(i).append(o)},bindTabs:function(){$(r+" li").on("click",function(){var e=$(this).index();$("#file-info").removeClass("show");$("div.on, li.on").removeClass("on");$(this).addClass("on");$(i+" > div").eq(e).addClass("on")})},bindProvisionButtons:function(){$(".provision").on("click",function(){var e=$(this).attr("aria-element");cloudFileBrowser.provisionEl(e)})},bindBreadCrumbClick:function(e){$(".breadcrumb ul li.home").on("click",function(){$("#file-info").removeClass("show");$(".addFiles, .addFilesButton, .selectFilesButton").remove();$("#loading").addClass("show");var t={element:e,path:"/"};provision.getDocuments(e,"/",function(e,t){cloudFileBrowser.drawEl(e,t.element,t.path)},t)});$(".breadcrumb ul li.selectedPath").on("click",function(){$("#loading").addClass("show");var t={element:e,path:this.attributes[0].nodeValue};provision.getDocuments(e,this.attributes[0].nodeValue,function(e,t){cloudFileBrowser.drawEl(e,t.element,t.path)},t)})},bindFileInfo:function(e){$(".listTable ul li.foldername").one("click",function(){var t=$(this).text();var n=$(this).next().text();var r={element:e,path:n};$("#file-info").removeClass("show");$(".addFiles, .addFilesButton, .selectFilesButton").remove();$("#loading").addClass("show");provision.getDocuments(e,n,function(e,t){cloudFileBrowser.drawEl(e,t.element,t.path)},r)});$(".listTable ul li.filename").on("click",function(){var t="#file-info";var n=$(this).text();var r=$(this).next().text();var i="<ul><li>Filename:</li><li>"+n+"</li></ul>"+"<ul><li>Location:</li><li>"+r+"</li></ul>"+'<a href="#" class="selectbutton">Select</a>'+'<a href="#" class="downloadbutton">Download</a>';o=n.split(".").pop();$("#file-info .preview img").remove();var s=o.toLowerCase();if(s=="jpg"|s=="gif"|s=="jpeg"|s=="png"){provision.displayFile(e,r,cloudFileBrowser.displayThumbnail)}$(t).addClass("show").find(".fileDetails").html(i);$(t).find(".selectbutton").on("click",function(){provision.fileSelected(e,r)});$(t).find(".downloadbutton").on("click",function(){provision.downloadFile(e,r)})});$("div.preview a.close").on("click",function(){$("#file-info").removeClass("show")});$(".listTable ul li.checkbox").on("change",function(){var t=this.nextSibling.nextSibling.textContent;var n=$.inArray(t,cloudFileBrowser.selectedFiles[e]);if(cloudFileBrowser.selectedFiles[e]==null||cloudFileBrowser.selectedFiles[e]==undefined){cloudFileBrowser.selectedFiles[e]=new Array}if(~n){cloudFileBrowser.selectedFiles[e].splice(n,1)}else{cloudFileBrowser.selectedFiles[e].push(t)}})},displayThumbnail:function(e){var t=o.toLowerCase();if(t=="jpg"|t=="gif"|t=="jpeg"|t=="png"){$("#file-info .preview").append('<img src="'+e.cloudElementsLink+'">')}},provisionEl:function(e){var t={element:e};$("#loading").addClass("show");provision.createInstance(e,cloudFileBrowser.handleOnProvision,t)},handleOnProvision:function(e,t){var n={element:e,path:"/"};provision.getDocuments(e,"/",function(e,t){cloudFileBrowser.drawEl(e,t.element,t.path)},n)},drawEl:function(e,t,n){var r=this.buildTable(e,true,n,t);if(!e||!t)console.warn("Cannot draw element, Data or Element missing!");$("#loading").removeClass("show");$("div."+t+" .listTable, div."+t+" .breadcrumb").remove();$(i+" ."+t).addClass("provisioned").append(r);this.animateTable(t);this.bindFileDragDrop(t,n);this.bindAddFiles(t,n);this.bindBreadCrumbClick(t);this.bindFileInfo(t)},buildTable:function(e,t,n,r){if(t==true){var i="";var s;cloudFileBrowser.selectedFiles[r]=new Array;console.log("table data recieved: ",e);i+='<a href="#" class="selectFilesButton">Select Files</a><input type="file" class="hidden addFiles" multiple></input><a class="addFilesButton" href="#">Add Files</a><div class="breadcrumb">'+"<ul>";if(n!=null||n!=undefined){var o=n.split("/");for(var u=0;u<o.length;u++){var a=o[u];if(u==0&&a==""){s="/";i+='<li class="home">Home</li>'}else if(a!=null&&a!=""){if(s=="/"){s=s+a}else{s=s+"/"+a}i+='<li class="caret"></li>';i+='<li class="selectedPath" name='+s+">"+a+"</li>"}}}else{i+="<li>/</li>"}i+="</ul></div>";i+='<div class="listTable">'+"<ul>"+"<li></li>"+"<li>File</li>"+"<li>Location</li>"+"<li>Modified</li>"+'</ul><div class="scrollPanel">';for(var u=0;u<e.length;u++){var f=e[u];i+='<ul draggable="true">';if(f.directory){i+='<li class="checkbox"></li>'+'<li class="foldername">'}else{i+='<li class="checkbox"><input type="checkbox"></li>'+'<li class="filename">'}i+=f.name+"</li>"+"<li>"+f.path+"</li>"+"<li>"+f.modifiedDate+"</li></ul>"}}else{var i="";var l=$(".listTable ul").length;for(var u=0;u<e.length;u++){i+='<ul draggable="true" class="loading on '+e[u].name+'">'+'<li class="checkbox"><input type="checkbox"></li>'+'<li class="filename">'+e[u].name+"</li>"+"<li>Uploading...</li>"+"</ul>";var c={tableHTML:i,path:n,element:r,currentIndex:l+u};provision.uploadFile(r,n,e[u],cloudFileBrowser.handleUploadComplete,c)}}i+="</div></div>";return i},handleUploadComplete:function(e){var t=$(".listTable ul");var n=t[e.currentIndex];if($(".listTable ul.loading")!=null){$(".listTable ul.loading").removeClass("loading")}if(e.data.name==null||e.data.name==undefined){cloudFileBrowser.displayError(e.data.message);n.innerHTML=null}else if(n!=null){n.innerHTML='<li class="checkbox"><input type="checkbox"></li>'+'<li class="filename">'+e.data.name+"</li>"+"<li>"+e.data.path+"</li>"+"<li>"+e.data.modifiedDate+"</li>"}$(".listTable ul li.filename").off("click",function(){cloudFileBrowser.bindFileInfo(e.element)})},animateTable:function(e){var t=$("div."+e+' .listTable .scrollPanel ul:not(".on")').length;var n=100;for(var r=0;r<t;r++){$("."+e+' .listTable .scrollPanel  ul:not(".on"):eq('+r+")").attr("style","-webkit-transition-delay: "+n+"ms");n+=50}setTimeout(function(){$("."+e+" .listTable .scrollPanel > ul").addClass("on")},50)},bindAddFiles:function(e,t){$(".addFilesButton").unbind("click");$(".addFiles").unbind("change");$(".addFilesButton").on("click",function(){$("."+e+" .addFiles").trigger("click")});$(".addFiles").on("change",function(n){cloudFileBrowser.uploadFiles(e,t,this.files)});$(".selectFilesButton").on("click",function(){provision.fileSelected(e,cloudFileBrowser.selectedFiles[e])})},bindFileDragDrop:function(e,t){$(".drop-zone").unbind("drop");$(".drop-zone").on("drop",function(e){var n=e.originalEvent.dataTransfer.files;var r=$(this).attr("aria-element");$(this).removeClass("drop-helper");e.preventDefault();e.stopPropagation();cloudFileBrowser.uploadFiles(r,t,n)});$(".drop-zone").on("dragover",function(e){e.preventDefault();e.stopPropagation();$(this).addClass("drop-helper")})},displayError:function(e){$("#error").html("<span>"+e+"</span>").addClass("show");setTimeout(function(){$("#error").removeClass("show")},2500)},uploadFiles:function(e,t,n){var r=this.buildTable(n,false,t,e);$("div."+e+" .listTable .scrollPanel").append(r);this.animateTable(e)}}}()