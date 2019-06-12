/*!
  * DDModal
  * Author: Nguyen Hieu Dien (nguyenhieudien@hotmail.com)
  * nguyenhieudien.com/ddmodal
*/

/**DDModal
 * Constant
 * & Config Varriable will use in life circle
 */
function DDModalConfigClass() {
    this.BOOTSTRAPVER = 4;
    this.ROOTPATH = getRootWebSitePath();
    this.FILEFORMAT = [".html",".xhtml",".xml",".php",".txt",".asp",".aspx",".jsp",".csp",".wml"];
    this.SYMBOLTAGINCLUDE = "::";

    this.setConfigs = function (customConfigs) {
        for(var key in customConfigs) {
            switch(key.toUpperCase()) {
                case "BOOTSTRAPVER":
                    this.BOOTSTRAPVER = customConfigs[key];
                    break;
                case "ROOTPATH":
                    this.ROOTPATH = customConfigs[key];
                    break;
                case "FILEFORMAT":
                    this.FILEFORMAT = customConfigs[key];
                    break;
                case "SYMBOLTAGINCLUDE":
                    this.SYMBOLTAGINCLUDE = customConfigs[key];
                    break;
                default:
                  // code block
            }
        }
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
}
var DDModalConfig = new DDModalConfigClass();

function DDModalConstantClass() {
    this.ERR_ELEMENTLOAD = "ERROR WHEN LOAD ELEMENT SELECTOR";
    this.ERR_URLLOAD = "ERROR WHEN LOAD URL: ";
    this.ERR_URLELEMENTLOAD = "ERROR WHEN LOAD ELEMENT IN URL";
}
var DDModalConstant = new DDModalConstantClass();
//End Constant & Config Varriable will use in life circle


/**DDModal
 * Public Class
 */
var ddmodalArray;
function DDModalClass(ddmodalTag,elementButton,elementModal,extendUI) {
    this.ddmodalTag = ddmodalTag;
    this.elementButton = elementButton;
    this.elementModal = elementModal;
    this.extendUI = extendUI;

    this.getDDModalHTML = function () {
        var html = '';
        html += this.elementButton.getElementButtonHTML();
        html += this.elementModal.getElementModalHTML();
        return html;
    }
}


function ElementButtonClass(bttarget, bttype, btclick, btlabel, btclass) {
    this.bttarget = bttarget;
    this.bttype = bttype;
    this.btclick = btclick;
    this.btlabel = btlabel;
    this.btclass = btclass ? btclass : "btn btn-primary";

    this.getElementButtonHTML = function () {
        var html = '<button></button>';
        if (this.bttype || this.btclick !== "#" || this.btlabel || this.btclass) {
            if (this.bttype === "button"){
                html = '<button type="button" onclick="' + this.btclick + '" class="'+ this.btclass +' btn-ddmodal" data-toggle="modal" data-target="#' + this.bttarget + '">';
                html +=           this.btlabel;
                html += '</button>';
            } else {
                html = '<a type="button" onclick="' + this.btclick + '" class="'+ this.btclass +' btn-ddmodal" data-toggle="modal" data-target="#' + this.bttarget + '">';
                html +=         this.btlabel;
                html += '</a>';
            }
        }
        return html;
    };

}

function ElementModalClass(mdid, mdtitle, mdbody, mdinclude, mdincludeType, mdclass) {
    this.mdid = mdid;
    this.mdtitle = mdtitle;
    this.mdbody = mdbody;
    this.mdinclude = mdinclude;
    this.mdincludeType = mdincludeType;
    this.mdclass = splitMDClass(mdclass);

    this.getElementModalHTML = function () {
        var html = '<div class="modal fade modal-ddmodal" id="' + this.mdid + '" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">';
        html +=        '<div class="modal-dialog ' + this.mdclass['modalclass'] + ' modal-dialog-ddmodal" role="document">';
        html +=             '<div class="modal-content modal-content-ddmodal">';
        html +=                 '<! -- header here -->';
        html +=                 this.getModalHeaderHTML();
        html +=                 '<div class="modal-body' + this.mdclass['bodyclass'] + ' modal-body-ddmodal">';
        html +=                     '<! -- body here -->';
        html +=                     'Loading ' + this.mdinclude;
        html +=                 '</div>';
        html +=                 '<! -- footer here -->';
        html +=             '</div>';
        html +=         '</div>';
        html +=     '</div>';
        return html;
    };

    this.getModalHeaderHTML = function () {
        var html, innerhtml;
        html = innerhtml = '';
        if (this.mdtitle) {
            if (DDModalConfig.BOOTSTRAPVER < 4){
                innerhtml = '<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                innerhtml +=    '<span aria-hidden="true">&times;</span>';
                innerhtml +='</button>';
                innerhtml +='<h5 class="modal-title modal-title-ddmodal" id="exampleModalLabel">' + this.mdtitle +  '</h5>';
            }
            else {
                innerhtml = '<h5 class="modal-title modal-title-ddmodal" id="exampleModalLabel">' + this.mdtitle +  '</h5>';
                innerhtml +='<button type="button" class="close" data-dismiss="modal" aria-label="Close">';
                innerhtml +=    '<span aria-hidden="true">&times;</span>';
                innerhtml +='</button>';
            }
            html = '<div class="modal-header ' + this.mdclass['headerclass'] + '">';
            html +=     '<! -- header here -->';
            html +=     innerhtml;
            html += '</div>';
        }
        return html;
    }

    this.loadBodyContent = function () {
        /**mdincludeType
         * 0 load tag in current page
         * 1 load all other page
         * 2 load tag in other page
         */
        if (this.mdincludeType === 0) {
            //if mdinclude is a element in current file, call getMDContentFromTag() to load this tag
            this.mdbody = getMDContentFromTag(this.mdinclude);
        }
        if (this.mdincludeType === 1) {
            this.mdbody = getMDContentFromFile(this.mdinclude);
        }
        if (this.mdincludeType === 2) {
            var symbolIndex = this.mdinclude.indexOf(DDModalConfig.SYMBOLTAGINCLUDE);
            var filepath = this.mdinclude.substring(0, symbolIndex);
            var element = this.mdinclude.substring(symbolIndex + DDModalConfig.SYMBOLTAGINCLUDE.length);
            this.mdbody = getMDContentFromFileTag(this.mdid, filepath, element);
        }
        var selectorModalBody = "#"+this.mdid+" .modal-body-ddmodal";
        $(selectorModalBody).html(this.mdbody);
    }

    function getMDContentFromTag(element) {
        var mdbody = "";
        if ($(element).length){
            $(element).show();
            mdbody = $(element)[0].outerHTML;
            $(element).remove();
        } else {
            mdbody = DDModalConstant.ERR_ELEMENTLOAD+" "+element;
        }
        return mdbody;
    }

    function getMDContentFromFile(filepath) {
        var file = DDModalConfig.ROOTPATH + filepath;
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
                mdbody = DDModalConstant.ERR_URLLOAD+xhttp.status+" "+xhttp.statusText+" "+file;
            }
        };
        xhttp.send(null);
    
        return mdbody;
    }

    function getMDContentFromFileTag(mdid, filepath, element) {
        var ddmodalid = '#' + mdid;
        var mdbody = "";
        var filecontent = getMDContentFromFile(filepath);
        $(ddmodalid+" .modal-body-ddmodal").html(filecontent);
        if ($(ddmodalid+" .modal-body-ddmodal "+element).length){
            mdbody = $(ddmodalid+" .modal-body-ddmodal "+element)[0].outerHTML;
        } else {
            mdbody = DDModalConstant.ERR_URLELEMENTLOAD+" "+element+" in "+filepath;
        }
        return mdbody;
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
        mdclassarr.forEach(function(element) {
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
}

function DDModalExtendUIClass(draggable, resizable) {
    this.draggable = draggable;
    this.resizable = resizable;

    this.affectExtendUI = function (mdid) {
        var ddmodalid = "#"+mdid;
        if(resizable != null){
            $(ddmodalid+' .modal-content').resizable({
              //alsoResize: ".modal-dialog",
              minHeight: 300,
              minWidth: 300
            });
        }
        
        if(draggable != null){
            $(ddmodalid+' .modal-dialog').draggable();
        }
        
        $(ddmodalid).on('show.bs.modal', function() {
            $(this).find('.modal-body').css({
            'max-height': '100%'
            });
        });
    }
}

function DDModalServiceClass () {
    this.renderAllDDModal = function () {
        var bttarget, bttype, btclick, btlabel, btclass, mdid, mdtitle, mdbody, mdinclude, mdincludeType, mdclass, resizable, draggable;
        var error = ""; var ddmodal = "";
        ddmodalArray = [];

        var tags = document.getElementsByTagName("ddmodal");
    
        while (tags.length > 0) {
            ddmodalTag = tags[0];
            bttarget = bttype = btclick = btlabel = btclass = mdid = mdtitle = mdbody = mdinclude = mdincludeType = mdclass = "";
            
            //button
            bttarget = ddmodalTag.getAttribute('id') ? ddmodalTag.getAttribute('id') : "";
            bttype = ddmodalTag.getAttribute('bttype') ? ddmodalTag.getAttribute('bttype') : "";
            btclick = ddmodalTag.getAttribute('btclick') ? ddmodalTag.getAttribute('btclick') : "";
            btlabel = ddmodalTag.getAttribute('btlabel') ? ddmodalTag.getAttribute('btlabel') : "";
            btclass = ddmodalTag.getAttribute('btclass') ? ddmodalTag.getAttribute('btclass') : "";
    
            //modal
            mdid = ddmodalTag.getAttribute('id') ? ddmodalTag.getAttribute('id') : "";
            mdtitle = ddmodalTag.getAttribute('mdtitle') ? ddmodalTag.getAttribute('mdtitle') : "";
            mdinclude = ddmodalTag.getAttribute('mdinclude') ? ddmodalTag.getAttribute('mdinclude') : "";
            mdincludeType = checkMdincludeType(mdinclude);
            mdclass = ddmodalTag.getAttribute('mdclass') ? ddmodalTag.getAttribute('mdclass') : "";
    
            //ui
            resizable = ddmodalTag.getAttribute('resizable');
            draggable = ddmodalTag.getAttribute('draggable');
    
            if (mdid === ""){
                error += "Attribute id is require! ";
            }
            if (mdinclude === ""){
                error += "Attribute mdinclude is require! ";
            }
            //check if mdinclude is load file
            if (mdincludeType === 0) {
                if ($(mdinclude).length) {
                    $(mdinclude).hide();
                }
            }
    
            if (error === ""){
                var elementButton = new ElementButtonClass(bttarget, bttype, btclick, btlabel, btclass);
                var elementModal = new  ElementModalClass(mdid, mdtitle, mdbody, mdinclude, mdincludeType, mdclass);
                var extendUI = new DDModalExtendUIClass(draggable,resizable);
                ddmodal = new DDModalClass(ddmodalTag,elementButton,elementModal,extendUI);
                ddmodalArray.push(ddmodal);
                ddmodalTag.outerHTML = ddmodal.getDDModalHTML();
                extendUI.affectExtendUI(mdid);
            } else {
                ddmodalTag.outerHTML = error;
            }
        }
    }

    this.fetchAll = function () {
        return ddmodalArray;
    }

    this.getElementModalByBttarget = function (bttaget) {
        var elementModal;
        ddmodalArray.forEach(function(element) {
            if (bttaget == "#"+element.elementModal.mdid) {
                elementModal = element.elementModal;
                return false;
            }
        });
        return elementModal;
    }
    this.getMdincludeByMdid = function (mdid) {
        var mdinclude = "";
        ddmodalArray.forEach(function(element) {
            if (mdid === element.elementModal.mdid) {
                mdinclude = element.elementModal.mdinclude;
                return false;
            }
        });
        return mdinclude;
    }

    function checkMdincludeType(mdinclude) {
        /**mdincludeType
         * 0 load tag in current page
         * 1 load all other page
         * 2 load tag in other page
         */
        var mdincludeType = 0;
        (DDModalConfig.FILEFORMAT).forEach(function(element) {
            if (mdinclude.indexOf(element) > -1) {
                if (mdinclude.indexOf(DDModalConfig.SYMBOLTAGINCLUDE) === -1) {
                    mdincludeType = 1;
                    return false;
                } else {
                    mdincludeType = 2;
                    return false;
                }
            }
        });
        return mdincludeType;
    }
}
//End Public Class

//Main Function
$(function(){
    //Here the code run on start
    var DDModalService = new DDModalServiceClass();
    //Duyệt qua các thẻ ddmodal tạo thành thẻ modal bootstrap hoàn chỉnh
    DDModalService.renderAllDDModal();
    
    $(document).on("click", "button", function(event){
        if ($(event.currentTarget).hasClass('btn-ddmodal')){
            var elementModal = DDModalService.getElementModalByBttarget(event.currentTarget.getAttribute('data-target'));
            elementModal.loadBodyContent();
        }
    });

    $(document).on("click", "a", function(event){
        if ($(event.currentTarget).hasClass('btn-ddmodal')){
            var elementModal = DDModalService.getElementModalByBttarget(event.currentTarget.getAttribute('data-target'));
            elementModal.loadBodyContent();
        }
    });
    
});
//End Main Function