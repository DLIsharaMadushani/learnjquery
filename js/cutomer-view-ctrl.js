/*===============================================================================
 * Global Variables
 *===============================================================================*/

var isCxIdValid=false;
var isCxNameValid=false;
var isCxAddValid=false;

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init(){
    $("#txt-id").focus();

}

$('#btn-save').click(function (){

});

$("#btn-clear").click(function (){
    clearInputs();
})
;

$("#txt-id").focus(function (){
    $("#txt-id").removeClass("is-invalid");
    $("#txt-id").removeClass("is-valid");
    $("#helper-txt-id").addClass("text-muted");
});

$("#txt-id").focusout(function (){
    if (!$("#txt-id").val().match(/^C\d{3}$/)){
        isCxIdValid=false;
        $("#txt-id").addClass("is-invalid");
        $("#helper-txt-id").addClass("invalid-feedback");
        $("#helper-txt-id").removeClass("text-muted");
    }else{
        isCxIdValid=true;
        $("#txt-id").addClass("is-valid");
        $("#helper-txt-id").removeClass("invalid-feedback");
        $("#helper-txt-id").addClass("text-muted");
    }
    enableSaveBtn();
});

$("#txt-name").focus(function (){
    $("#txt-name").removeClass("is-invalid");
    $("#txt-name").removeClass("is-valid");
    $("#helper-txt-name").addClass("text-muted");
});

$("#txt-name").focusout(function (){
    if (!$("#txt-name").val().match(/^[A-za-z][A-Za-z .]{3,}$/)){
        isCxNameValid=false;
        $("#txt-name").addClass("is-invalid");
        $("#helper-txt-name").addClass("invalid-feedback");
        $("#helper-txt-name").removeClass("text-muted");
    }else{
        isCxNameValid=true;
        $("#txt-name").addClass("is-valid");
        $("#helper-txt-name").removeClass("invalid-feedback");
        $("#helper-txt-name").addClass("text-muted");
    }
    enableSaveBtn();
});

$("#txt-address").focus(function (){
    $("#txt-address").removeClass("is-invalid");
    $("#txt-address").removeClass("is-valid");
    $("#helper-txt-address").addClass("text-muted");
});

$("#txt-address").focusout(function (){
    if ($("#txt-address").val().trim().length < 4){
        isCxAddValid=false;
        $("#txt-address").addClass("is-invalid");
        $("#helper-txt-address").addClass("invalid-feedback");
        $("#helper-txt-address").removeClass("text-muted");
    }else{
        isCxAddValid=true;
        $("#txt-address").addClass("is-valid");
        $("#helper-txt-address").removeClass("invalid-feedback");
        $("#helper-txt-address").addClass("text-muted");
    }
    enableSaveBtn();
});


/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

// Todo: add all event listeners and handlers here

/*===============================================================================
 * Functions
 *===============================================================================*/

function enableSaveBtn(){
    if(isCxIdValid && isCxNameValid && isCxAddValid){
        $("#btn-save").prop('disabled',false);
    }else{
        $("#btn-save").prop('disabled',true);
    }
}

function clearInputs(){
    isCxIdValid=false;
    isCxNameValid=false;
    isCxAddValid=false;
    $("#txt-id").removeClass("is-valid");
    $("#txt-name").removeClass("is-valid");
    $("#txt-address").removeClass("is-valid");
    $("#txt-id").removeClass("is-invalid");
    $("#txt-name").removeClass("is-invalid");
    $("#txt-address").removeClass("is-invalid");
    enableSaveBtn();
}