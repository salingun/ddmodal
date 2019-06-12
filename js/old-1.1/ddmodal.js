/*!
  * DDModal
  * Author: Nguyen Hieu Dien (nguyenhieudien@hotmail.com)
  * nguyenhieudien.com/ddmodal
  */
 //Constant
const BOOTSTRAPVER = parseFloat($.fn.modal.Constructor.VERSION);
const ROOTPATH = getRootWebSitePath();
const FILEFORMAT = [".html",".xhtml",".xml",".php",".txt",".asp",".aspx",".jsp",".csp",".wml"];

//get path in your website
var script = document.getElementsByTagName("script");
script = script[script.length - 1].src;
var path = script.substring(0,script.lastIndexOf("/")+1);

$(document).ready(function () {
  importDDModalConst();
});

/**
 * Function use to import ddmodal constructor and ddmodal UI settings
 */
function importDDModalConst(){
  //import DDModal UI setting and DDModal Constructor to use in your page
  var jsfile = [
    "ddmodal-ui.js",
    "ddmodal-const.js",
  ];

  jsfile.forEach(function(element) {
    var imported = document.createElement('script');
    imported.src = path+element;
    document.head.appendChild(imported);
  });
}

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