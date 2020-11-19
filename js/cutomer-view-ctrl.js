/*===============================================================================
 * Global Variables
 *===============================================================================*/

var isCxIdValid=false;
var isCxNameValid=false;
var isCxAddValid=false;
var customers=[];
var pageSize=-1;

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
    createRow(customer);
    customers.push(customer);
    console.log($("tbody").height());
    console.log($("tbody").offset().top);

    viewTableFooter();
    calculatePageSize()
    viewPaginations();

}

function deleteCustomer(row){
    var deleteCxId=$(row.firstChild).text();
    for (var i = 0; i < customers.length; i++) {
        if(customers[i].id === deleteCxId){
            customers.splice(i,1);
            $(row).remove();
            viewTableFooter();
            viewPaginations();
            return ;
        }
    }
}

function viewTableFooter(){
    $("#tbl-customers tbody tr").length > 0 ? $("#tbl-customers tfoot").hide(): $("#tbl-customers tfoot").show();
}

function calculatePageSize(){
    if(pageSize === -1){
        var tbodyViewHeight=$("body").height() - $("tbody").offset().top - $("nav").height() - 70;
        if($("tbody").height() > tbodyViewHeight){
            pageSize=$("#tbl-customers tbody tr").length;
            console.log("Page size : "+ pageSize);
        }
    }
}

function viewPaginations(){
    let customersCount = customers.length;
    if(pageSize === -1 || customersCount <= pageSize) {
        console.log(pageSize + " *** " + customersCount);
        renderPage(1);
        $("#page-navigation-bar").addClass("hidden");
        return;
    }
    var firstPageHtml='<li class="page-item">\n' +
        '                        <a class="page-link" href="#">\n' +
        '                            <i class="fas fa-backward"></i>\n' +
        '                        </a>\n' +
        '                    </li>\n';
    var lastPageHtml='<li class="page-item" id="li-forward-pages">\n' +
        '                        <a class="page-link" href="#">\n' +
        '                            <i class="fas fa-forward"></i>\n' +
        '                        </a>\n' +
        '                    </li>'



        if(customersCount % pageSize === 1 || customersCount % pageSize === 0){
            $("#page-navigation-bar ul").empty();
            var noOfPages=Math.ceil(customersCount/pageSize);
            var startingPage=1;
            var currentPageGroup=1;
            var noOfGroups=1;
            if(noOfPages > 3){
                noOfGroups=Math.ceil(noOfPages/5);
                currentPageGroup=noOfGroups-1;
                startingPage=currentPageGroup*5 + 1;
            }

            for (var i = startingPage; i <= noOfPages; i++) {
                if(i === noOfPages){
                    firstPageHtml += '<li class="page-item active"><a class="page-link" href="#">'+i+'</a></li>';
                    renderPage(noOfPages);
                }else{
                    firstPageHtml += '<li class="page-item"><a class="page-link" href="#">'+i+'</a></li>';
                }
            }
            $("#page-navigation-bar ul").append(firstPageHtml+lastPageHtml);
        }

        $("#page-navigation-bar").removeClass("hidden");
}

function clearTable(){
    $("#tbl-customers tbody").empty();
    $("#tbl-customers tfoot").empty();
}

function renderPage(activePage){
    clearTable();
    for (var i = (activePage-1)*pageSize; i < customers.length; i++) {
        console.log(customers[i]);
        createRow(customers[i]);
    }
}

function createRow(customer){
    var markup = '<tr>' +
        '<td>'+customer.getId()+'</td>' +
        '<td>'+customer.getName()+'</td>' +
        '<td>'+customer.getAddress()+'</td>' +
        '<td><div class="trash"></div></td>' +
        '</tr>';
    $("#tbl-customers tbody").append(markup);
    $("#tbl-customers tbody div").click(function (){
        var row=$(this).parents()[1];
        deleteCustomer(row);
    });
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