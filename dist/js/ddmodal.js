/*!
  * DDModal v1.0
  * Author: Nguyen Hieu Dien (nguyenhieudien@hotmail.com)
  * nguyenhieudien.com
  */
 //Constant
 const BOOTSTRAPVER = parseFloat($.fn.modal.Constructor.VERSION);
 const ROOTPATH = getRootWebSitePath();
 const FILEFORMAT = [".html",".xhtml",".xml",".php",".txt",".asp",".aspx",".jsp",".csp",".wml"];
 
 //get path in your website
 var script = document.currentScript.src;
 var path = script.substring(0,script.lastIndexOf("/")+1);
 
 //import DDModal UI setting and DDModal Constructor to use in your page
 var jsfile = [
   "ddmodal-ui.min.js",
   "ddmodal-const.min.js",
 ];
 
 jsfile.forEach(element => {
   var imported = document.createElement('script');
   imported.src = path+element;
   document.head.appendChild(imported);
 });
 
 /**
  * Function use to get Root path of website
  */
 function getRootWebSitePath() {
     //thanks for code of Mr.AkramOnly
     var _location = document.location.toString();
     var applicationNameIndex = _location.indexOf('/', _location.indexOf('://') + 3);
     var applicationName = _location.substring(0, applicationNameIndex) + '/';
     var webFolderIndex = _location.indexOf('/', _location.indexOf(applicationName) + applicationName.length);
     var webFolderFullPath = _location.substring(0, webFolderIndex) + '/';
 
     return webFolderFullPath;
 }