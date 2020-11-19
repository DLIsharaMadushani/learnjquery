/*===============================================================================
 * Global Variables
 *===============================================================================*/

var isCxIdValid=false;
var isCxNameValid=false;
var isCxAddValid=false;
var customers=[];

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init(){
    $("#txt-id").focus();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

$('#btn-save').click(function (){
    saveCustomer(new Customer($("#txt-id").val(), $("#txt-name").val(),$("#txt-address").val()));
    //$("#btn-clear").click();
});

$("#btn-clear").click(function (){
    clearInputs();
});

$("#txt-id").focus(function (){
    $("#txt-id").removeClass("is-invalid");
    $("#txt-id").removeClass("is-valid");
    $("#helper-txt-id").addClass("text-muted");
    $("#alert-duplicateId").attr('hidden',true);
});

$("#txt-id").focusout(function (){
    if (!$("#txt-id").val().match(/^C\d{3}$/)){
        isCxIdValid=false;
        $("#txt-id").addClass("is-invalid");
        $("#helper-txt-id").addClass("invalid-feedback");
        $("#helper-txt-id").removeClass("text-muted");
        return;
    }
    if(isCustomerIdExists($("#txt-id").val())) {
        isCxIdValid=false;
        $("#txt-id").addClass("is-invalid");
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
 * Functions
 *===============================================================================*/

function enableSaveBtn(){
    if(isCxIdValid && isCxNameValid && isCxAddValid){
        $("#btn-save").prop('disabled',false);
    }else{
        $("#btn-save").prop('disabled',true);
    }
}

function isCustomerIdExists(id){
    for (var customer of customers) {
        if(customer.id === id.trim()){
            $("#alert-duplicateId").attr('hidden',false);
            $("#alert-duplicateId").fadeIn(2000);
            return true;
        }
    }
    return false;
}

function clearInputs(Customer){
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

function saveCustomer(customer){
    var markup = '<tr>' +
        '<td>'+customer.getId()+'</td>' +
        '<td>'+customer.getName()+'</td>' +
        '<td>'+customer.getAddress()+'</td>' +
        '<td><div class="trash"></div></td>' +
        '</tr>'
    $("#tbl-customers tbody").append(markup);
    customers.push(customer);
    console.log($("tbody").height());
    console.log($("tbody").offset().top);

    viewTableFooter();
    viewPageNavigation()
    $("#tbl-customers tbody div").click(function (){
      var row=$(this).parents()[1];
      deleteCustomer(row);
    })
}

function deleteCustomer(row){
    var deleteCxId=$(row.firstChild).text();
    for (var i = 0; i < customers.length; i++) {
        if(customers[i].id === deleteCxId){
            customers.splice(i,1);
            $(row).remove();
            console.log($("tbody").height());
            $("tbody").offset().top
            viewTableFooter();
            viewPageNavigation()
            return ;
        }
    }
}

function viewTableFooter(){
    $("#tbl-customers tbody tr").length > 0 ? $("#tbl-customers tfoot").hide(): $("#tbl-customers tfoot").show();
}

function viewPageNavigation(){
    var tbodyViewHeight=$("body").height() - $("tbody").offset().top - $("nav").height() - 15;
    if($("tbody").height() > tbodyViewHeight){
        $("#page-navigation-bar").removeClass("hidden");
    }else{
        $("#page-navigation-bar").addClass("hidden");
    }
}


/*===============================================================================
 * Classes
 *===============================================================================*/

class Customer{
    constructor(id, name, address) {
        this.id=id;
        this.name=name;
        this.address=address;
    }
    getId(){
        return this.id;
    }

    getName(){
        return this.name;
    }

    getAddress(){
        return this.address;
    }
}