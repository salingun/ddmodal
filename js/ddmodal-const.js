/*!
  * DDModal v1.0
  * Author: Nguyen Hieu Dien (nguyenhieudien@hotmail.com)
  * nguyenhieudien.com/ddmodal
  */
$(document).ready(function () {
    DDModal();
});
/**
 * Constant
 */
const ERR_ELEMENTLOAD = "ERROR WHEN LOAD ELEMENT SELECTOR";
const ERR_URLLOAD = "ERROR WHEN LOAD URL: ";
const ERR_URLELEMENTLOAD = "ERROR WHEN LOAD ELEMENT IN URL";
/**
 * Get request in ddmodal html tag and process it to create ddmodal
 */
var DDModal = function () {
    var tags, xhttp;
    var bttarget, bttype, btclick, btlabel, btclass, mdid, mdtitle, mdinclude, mdclass, resizable, draggable;
    var error = ""; var ddmodal = "";

    tags = document.getElementsByTagName("*");

    for (let i = 0; i < tags.length; i++) {
        ddmodaltag = tags[i];
        bttarget = bttype = btclick = btlabel = btclass = mdid = mdtitle = mdinclude = mdclass = "";
        if ((tags[i].tagName).toUpperCase() === "DDMODAL") {
            //button
            bttarget = ddmodaltag.getAttribute('id') ? ddmodaltag.getAttribute('id') : "";
            bttype = ddmodaltag.getAttribute('bttype') ? ddmodaltag.getAttribute('bttype') : "";
            btclick = ddmodaltag.getAttribute('btclick') ? ddmodaltag.getAttribute('btclick') : "#";
            btlabel = ddmodaltag.getAttribute('btlabel') ? ddmodaltag.getAttribute('btlabel') : "";
            btclass = ddmodaltag.getAttribute('btclass') ? ddmodaltag.getAttribute('btclass') : "";

            //modal
            mdid = ddmodaltag.getAttribute('id') ? ddmodaltag.getAttribute('id') : "";
            mdtitle = ddmodaltag.getAttribute('mdtitle') ? ddmodaltag.getAttribute('mdtitle') : "";
            mdinclude = ddmodaltag.getAttribute('mdinclude') ? ddmodaltag.getAttribute('mdinclude') : "";
            mdclass = ddmodaltag.getAttribute('mdclass') ? ddmodaltag.getAttribute('mdclass') : "";

            //ui
            resizable = ddmodaltag.getAttribute('resizable');
            draggable = ddmodaltag.getAttribute('draggable');

            if (mdid === ""){
                error += "Attribute id is require! ";
            }
            if (mdinclude === ""){
                error += "Attribute mdinclude is require! ";
            }

            if (error === ""){
                ddmodal = createModal(bttarget, bttype, btclick, btlabel, btclass,
                    mdid, mdtitle, mdinclude, mdclass,
                    resizable, draggable);
            } else {
                ddmodal = error;
            }
            ddmodaltag.outerHTML = ddmodal;
            UISet("#" + mdid, resizable, draggable);
        }
    }
}

/**
 * Function use to create html string of ddmodal
 * @param {*} bttarget 
 * @param {*} bttype 
 * @param {*} btclick 
 * @param {*} btlabel 
 * @param {*} btclass 
 * @param {*} mdid 
 * @param {*} mdtitle 
 * @param {*} mdinclude 
 * @param {*} mdclass 
 * @param {*} resizable 
 * @param {*} draggable 
 */
function createModal(bttarget, bttype, btclick, btlabel, btclass, mdid, mdtitle, mdinclude, mdclass, resizable, draggable) {

    var ddmodal = "";
    var modalButton = "";
    var modalForm = "";

    if (bttype || btclick !== "#" || btlabel || btclass) {
        modalButton = ModalButton(bttarget, bttype, btclick, btlabel, btclass);
        ddmodal += modalButton;
    }

    //check content of modal in current file or annother file
    var modalaction = "loadtag";
    FILEFORMAT.forEach(element => {
        if (mdinclude.indexOf(element) !== -1) {
            modalaction = "loadfile";
            return false;
        }
    });

    if (modalaction === "loadtag") {
        //if mdinclude is a element in current file, call getMDContentFromTag() to load this tag
        mdbody = getMDContentFromTag(mdinclude);
    }
    if (modalaction === "loadfile") {
        const spaceindex = mdinclude.indexOf(" ")
        if (spaceindex === -1) {
            //if mdinclude is define mdcontent will be all content of another file, call getMDContentFromFile() to load all content of url
            mdbody = getMDContentFromFile(mdinclude);
        } else {
            //if mdinclude is define mdcontent will be a tag in content of another file, call getMDContentFromFileTag() to load all content of url
            //slipt mdinclude to define filepath and element before load content
            var filepath = mdinclude.substring(0, spaceindex);
            var element = mdinclude.substring(spaceindex + 1);
            mdbody = getMDContentFromFileTag(mdid, filepath, element);
        }
    }
    modalForm = ModalForm(mdid, mdtitle, mdbody, mdclass);
    ddmodal += modalForm;

    return ddmodal;
}

/**
 * Function use to get form content of ddmodal in a tag inside current page
 * @param {*} element 
 */
function getMDContentFromTag(element) {
    var mdbody = "";
    if ($(element).length){
        mdbody = $(element)[0].outerHTML;
        $(element).remove();
    } else {
        mdbody = ERR_ELEMENTLOAD;
    }
    return mdbody;
}

/**
 * Function use to get form content of ddmodal in another page
 * @param {*} filepath
 */
function getMDContentFromFile(filepath) {
    var file = ROOTPATH + filepath;
    var mdbody = "";

    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", file, false);
    // xhttp.addEventListener('load', function () {
    //     mdbody = this.responseText;
    // });
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            // Typical action to be performed when the document is ready:
            mdbody = this.responseText;
        } else {
            mdbody = ERR_URLLOAD+xhttp.status+" "+xhttp.statusText;
        }
    };
    xhttp.send(null);

    return mdbody;
}

/**
 * Function use to get form content of ddmodal in a tag of another page
 * @param {*} mdid 
 * @param {*} filepath 
 * @param {*} element 
 */
function getMDContentFromFileTag(mdid, filepath, element) {
    const ddmodalid = '#' + mdid;
    var mdbody = "";
    var filecontent = getMDContentFromFile(filepath);
    $(ddmodalid).append(filecontent);
    if ($(ddmodalid+" "+element).length){
        mdbody = $(ddmodalid+" "+element)[0].outerHTML;
    } else {
        mdbody = ERR_URLELEMENTLOAD;
    }
    $(ddmodalid).innerHTML = "";
    return mdbody;
}

/**
 * Create View of Button
 * @param {*} bttarget 
 * @param {*} bttype 
 * @param {*} btclick 
 * @param {*} btlabel 
 * @param {*} btclass 
 */
var ModalButton = function (bttarget, bttype, btclick, btlabel, btclass) {
    var html = '';
    btclass = btclass ? btclass : 'btn-primary';
    if (bttype === "button") {
        html += '<' + bttype + ' onclick="' + btclick + '" class="btn ' + btclass + '" data-toggle="modal" data-target="#' + bttarget + '">'
        html += btlabel;
        html += '</' + bttype + '>';
    } else {
        html += '<a href="' + btclick + '" class="btn ' + btclass + '" data-toggle="modal" data-target="#' + bttarget + '">'
        html += btlabel;
        html += '</a>';
    }
    return html;
}

/**
 * Create View of MODAL
 * @param {*} mdid 
 * @param {*} mdtitle 
 * @param {*} mdbody 
 * @param {*} mdclass 
 */
var ModalForm = function (mdid, mdtitle, mdbody, mdclass) {
    var htmlheader, htmlbody, html;
    var mdclass = splitMDClass(mdclass);
    htmlheader = htmlbody = html = "";
    //create header
    if (mdtitle) {
        //Boostrap version 3 and 4 have difference construct of header, so we need check it
        if (BOOTSTRAPVER < 4){
            htmlheader = '<div class="modal-header'+mdclass['headerclass']+'">';
            htmlheader += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            htmlheader += '<h4 class="modal-title">' + mdtitle + '</h4>';
            htmlheader += '</div>';
        } else {
            htmlheader = '<div class="modal-header'+mdclass['headerclass']+'">';
            htmlheader += '<h4 class="modal-title">' + mdtitle + '</h4>';
            htmlheader += '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>';
            htmlheader += '</div>';
        }
    }

    //create body
    htmlbody = '<div class="modal-body'+mdclass['bodyclass']+'">';
    htmlbody += mdbody;
    htmlbody += '</div>';

    //create modal code (construct + header + body)
    html = '<div class="modal fade" id="' + mdid + '" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" data-show="true">';
    html += '<div class="modal-dialog' + mdclass['modalclass'] + '" role="document">';
    html += '<div class="modal-content">';
    html += htmlheader
    html += htmlbody
    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
}

/**
 * Function will process split mdclass to class of header, class of body and class of modal
 * @param {*} mdclass 
 */
function splitMDClass (mdclass){
    var mdclassresult = [];
    mdclassresult['headerclass'] = "";
    mdclassresult['bodyclass'] = "";
    mdclassresult['modalclass'] = "";
    var mdclassarr = mdclass.split(" ");
    mdclassarr.forEach(element => {
        if(element.indexOf("md-header") !== -1){
            mdclassresult['headerclass'] += " "+element;
        } else if (element.indexOf("md-body") !== -1){
            mdclassresult['bodyclass'] += " "+element;
        } else {
            mdclassresult['modalclass'] += " "+element;
        }
    });
    return mdclassresult;
}


