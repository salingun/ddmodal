/*!
  * DDModal
  * Author: Nguyen Hieu Dien (nguyenhieudien@hotmail.com)
  * nguyenhieudien.com/ddmodal
  */
function UISet(ddmodalid,resizable,draggable) {
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