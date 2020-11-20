/*
 * Copyright (c) 2020.  D L ISHARA M
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

/**
 * @author : D L Ishara Madushani <oppoishara02@gmail.com>
 * @since : 11/19/2020
 **/

/*===============================================================================
 * Global Variables
 *===============================================================================*/

var isCxIdValid = false;
var isCxNameValid = false;
var isCxAddValid = false;
var customers = [];
var pageSize = -1;
var currentPageGroup = 1;
var updatingRow = null;
var groupChanged = false;


/*===============================================================================
 * Classes
 *===============================================================================*/

class Customer {
    constructor(id, name, address) {
        this.id = id;
        this.name = name;
        this.address = address;
    }

    getId() {
        return this.id;
    }

    getName() {
        return this.name;
    }

    getAddress() {
        return this.address;
    }
}

/*===============================================================================
 * Init
 *===============================================================================*/

init();

function init() {
    $("#txt-id").focus();
    insertTestData();
}

/*===============================================================================
 * Event Handlers and Timers
 *===============================================================================*/

$('#btn-save').click(function () {
    saveCustomer(new Customer($("#txt-id").val(), $("#txt-name").val(), $("#txt-address").val()));
    $("#btn-clear").click();
});

$("#btn-clear").click(function () {
    clearInputs();
});

$("#txt-id").focus(function () {
    $("#txt-id").removeClass("is-invalid");
    $("#txt-id").removeClass("is-valid");
    $("#helper-txt-id").addClass("text-muted");
    $("#alert-duplicateId").attr('hidden', true);
});

$("#txt-id").focusout(function () {

    if (!$("#txt-id").val().match(/^C\d{3}$/)) {
        isCxIdValid = false;
        $("#txt-id").addClass("is-invalid");
        $("#helper-txt-id").addClass("invalid-feedback");
        $("#helper-txt-id").removeClass("text-muted");
        return;
    }
    if (isCustomerIdExists($("#txt-id").val())) {
        isCxIdValid = false;
        $("#txt-id").addClass("is-invalid");
    } else {
        isCxIdValid = true;
        $("#txt-id").addClass("is-valid");
        $("#helper-txt-id").removeClass("invalid-feedback");
        $("#helper-txt-id").addClass("text-muted");
    }

    enableSaveBtn();
});

$("#txt-name").focus(function () {
    $("#txt-name").removeClass("is-invalid");
    $("#txt-name").removeClass("is-valid");
    $("#helper-txt-name").addClass("text-muted");
});

$("#txt-name").focusout(function () {
    if ($("#btn-save").text() === "Update") {
        isCxIdValid = true;
    }
    if (!$("#txt-name").val().match(/^[A-za-z][A-Za-z .]{3,}$/)) {
        isCxNameValid = false;
        $("#txt-name").addClass("is-invalid");
        $("#helper-txt-name").addClass("invalid-feedback");
        $("#helper-txt-name").removeClass("text-muted");
    } else {
        isCxNameValid = true;
        $("#txt-name").addClass("is-valid");
        $("#helper-txt-name").removeClass("invalid-feedback");
        $("#helper-txt-name").addClass("text-muted");
    }
    enableSaveBtn();
});

$("#txt-address").focus(function () {
    $("#txt-address").removeClass("is-invalid");
    $("#txt-address").removeClass("is-valid");
    $("#helper-txt-address").addClass("text-muted");
});

$("#txt-address").focusout(function () {
    if ($("#btn-save").text() === "Update") {
        isCxIdValid = true;
    }
    if ($("#txt-address").val().trim().length < 4) {
        isCxAddValid = false;
        $("#txt-address").addClass("is-invalid");
        $("#helper-txt-address").addClass("invalid-feedback");
        $("#helper-txt-address").removeClass("text-muted");
    } else {
        isCxAddValid = true;
        $("#txt-address").addClass("is-valid");
        $("#helper-txt-address").removeClass("invalid-feedback");
        $("#helper-txt-address").addClass("text-muted");
    }
    enableSaveBtn();
});

/*===============================================================================
 * Functions
 *===============================================================================*/

function enableSaveBtn() {
    if (isCxIdValid && isCxNameValid && isCxAddValid) {
        $("#btn-save").prop('disabled', false);
    } else {
        $("#btn-save").prop('disabled', true);
    }
}

function isCustomerIdExists(id) {
    for (var customer of customers) {
        if (customer.id === id.trim()) {
            $("#alert-duplicateId").attr('hidden', false);
            $("#alert-duplicateId").fadeIn(2000);
            return true;
        }
    }
    return false;
}

function clearInputs(Customer) {
    isCxIdValid = false;
    isCxNameValid = false;
    isCxAddValid = false;
    $("#txt-id").removeClass("is-valid");
    $("#txt-name").removeClass("is-valid");
    $("#txt-address").removeClass("is-valid");
    $("#txt-id").removeClass("is-invalid");
    $("#txt-name").removeClass("is-invalid");
    $("#txt-address").removeClass("is-invalid");
    $("#btn-save").text("Save");
    $("#txt-id").prop('disabled', false);
    updatingRow = null;
    enableSaveBtn();
}

function saveCustomer(customer) {
    if ($("#btn-save").text() === "Update") {
        updateCustomer(customer);
    } else {
        createRow(customer);
        customers.push(customer);
        selectPageGroup();
        viewTableFooter();
        calculatePageSize()
        viewPaginations();
    }
}

function updateCustomer(customer) {
    for (var cx of customers) {
        if (cx.id === customer.id) {
            cx.name = customer.name;
            cx.address = customer.address;
            updateRow(cx);
            return;
        }
    }
}

function updateRow(customer) {
    let td = $(updatingRow).find("td");
    $(td[1]).text(customer.name);
    $(td[2]).text(customer.address);
}

function selectPageGroup() {
    groupChanged = false;
    if (pageSize !== -1) {
        currentPageGroup = Math.ceil(customers.length / (5 * pageSize));
    }
}

function deleteCustomer(row) {
    var deleteCxId = $(row.firstChild).text();
    for (var i = 0; i < customers.length; i++) {
        if (customers[i].id === deleteCxId) {
            customers.splice(i, 1);
            $(row).remove();
            selectPageGroup();
            viewPaginations();
            viewTableFooter();
            return;
        }
    }
}

function viewTableFooter() {
    if ($("#tbl-customers tbody tr").length > 0) {
        $("#tbl-customers tfoot").hide();
    } else {
        $("#tbl-customers tfoot").show()
        var markup = '<tr>\n' +
            '                        <td class="text-center" colspan="4">\n' +
            '                            📌 <small>There are no records to show. Add a new customer.</small>\n' +
            '                        </td>\n' +
            '                    </tr>';
        $("#tbl-customers tfoot").append(markup);
    }

}

function calculatePageSize() {
    if (pageSize === -1) {
        var tbodyViewHeight = $("body").height() - $("tbody").offset().top - $("nav").height() - 70;
        if ($("tbody").height() > tbodyViewHeight) {
            pageSize = $("#tbl-customers tbody tr").length;
        }
    }
}

function viewPaginations() {
    let customersCount = customers.length;
    if (pageSize === -1 || customersCount <= pageSize) {
        renderPage(1);
        $("#page-navigation-bar").addClass("hidden");
        return;
    }
    var firstPageHtml = '<li class="page-item" id="li-backward-pages">\n' +
        '                        <a class="page-link" href="#">\n' +
        '                            <i class="fas fa-backward"></i>\n' +
        '                        </a>\n' +
        '                    </li>\n';
    var lastPageHtml = '<li class="page-item" id="li-forward-pages">\n' +
        '                        <a class="page-link" href="#">\n' +
        '                            <i class="fas fa-forward"></i>\n' +
        '                        </a>\n' +
        '                    </li>'


    if (customersCount % pageSize === 1 || customersCount % pageSize === 0 || groupChanged) {
        $("#page-navigation-bar ul").empty();
        var noOfPages = Math.ceil(customersCount / pageSize);
        var startingPage = (currentPageGroup - 1) * 5 + 1;

        if (currentPageGroup * 5 * pageSize < customers.length) {
            noOfPages = startingPage + 4;
        }
        for (var i = startingPage; i <= noOfPages; i++) {
            if (i === noOfPages) {
                firstPageHtml += '<li class="page-item active"><a class="page-link" href="#" >' + i + '</a></li>';
                renderPage(noOfPages);
            } else {
                firstPageHtml += '<li class="page-item"><a class="page-link" href="#">' + i + '</a></li>';
            }
        }
        $("#page-navigation-bar ul").append(firstPageHtml + lastPageHtml);
        $("#page-navigation-bar ul li").click(function () {
            if ($.isNumeric($(this).text())) {
                $("#page-navigation-bar ul li.active").removeClass("active");
                $(this).addClass("active");
                renderPage($(this).text());
            }
        });

        $("#li-backward-pages").click(function () {
            if (currentPageGroup > 1) {
                currentPageGroup--;
                groupChanged = true;
                viewPaginations();
            }
        });


        $("#li-forward-pages").click(function () {
            if (currentPageGroup * 5 * pageSize < customers.length) {
                currentPageGroup++;
                groupChanged = true;
                viewPaginations();
            }
        });

    }

    $("#page-navigation-bar").removeClass("hidden");
}

function clearTable() {
    $("#tbl-customers tbody").empty();
    $("#tbl-customers tfoot").empty();
}

function renderPage(activePage) {
    clearTable();
    let index = (activePage - 1) * pageSize;
    var lastIndex;
    if (pageSize === -1) {
        lastIndex = customers.length;
    } else {
        if (customers.length > activePage * pageSize) {
            lastIndex = index + pageSize;
        } else {
            lastIndex = customers.length;
        }
    }

    for (var i = index; i < lastIndex; i++) {
        createRow(customers[i]);
    }
}

function createRow(customer) {
    var markup = '<tr>' +
        '<td>' + customer.getId() + '</td>' +
        '<td>' + customer.getName() + '</td>' +
        '<td>' + customer.getAddress() + '</td>' +
        '<td><div class="trash"></div></td>' +
        '</tr>';
    $("#tbl-customers tbody").append(markup);
    $("#tbl-customers tbody div").click(function () {
        var row = $(this).parents()[1];
        deleteCustomer(row);
    });
    $("#tbl-customers tbody tr").click(function () {
        let td = $(this).find("td");
        clearInputs();
        $(updatingRow).removeClass("selectedRow");
        $(this).addClass("selectedRow");
        $("#txt-id").val($(td[0]).text());
        $("#txt-id").attr('disabled', true);
        $("#txt-name").val($(td[1]).text());
        $("#txt-address").val($(td[2]).text());
        $("#btn-save").text("Update");
        updatingRow = $(this);

    });
}

function insertTestData() {
    saveCustomer(new Customer("C001", "Ishara", "GAlle"));
    saveCustomer(new Customer("C002", "Ishara", "GAlle"));
    saveCustomer(new Customer("C003", "Ishara", "GAlle"));
    saveCustomer(new Customer("C004", "Ishara", "GAlle"));
    saveCustomer(new Customer("C005", "Ishara", "GAlle"));
    saveCustomer(new Customer("C006", "Ishara", "GAlle"));
    saveCustomer(new Customer("C007", "Ishara", "GAlle"));
    saveCustomer(new Customer("C008", "Ishara", "GAlle"));
    saveCustomer(new Customer("C009", "Ishara", "GAlle"));
    saveCustomer(new Customer("C010", "Ishara", "GAlle"));
    saveCustomer(new Customer("C011", "Ishara", "GAlle"));
    saveCustomer(new Customer("C012", "Ishara", "GAlle"));
    saveCustomer(new Customer("C013", "Ishara", "GAlle"));
    saveCustomer(new Customer("C014", "Ishara", "GAlle"));
    saveCustomer(new Customer("C015", "Ishara", "GAlle"));
    saveCustomer(new Customer("C016", "Ishara", "GAlle"));
    saveCustomer(new Customer("C017", "Ishara", "GAlle"));
    saveCustomer(new Customer("C018", "Ishara", "GAlle"));
    saveCustomer(new Customer("C019", "Ishara", "GAlle"));
    saveCustomer(new Customer("C020", "Ishara", "GAlle"));
    saveCustomer(new Customer("C021", "Ishara", "GAlle"));
    saveCustomer(new Customer("C022", "Ishara", "GAlle"));
    saveCustomer(new Customer("C023", "Ishara", "GAlle"));
    saveCustomer(new Customer("C024", "Ishara", "GAlle"));
    saveCustomer(new Customer("C025", "Ishara", "GAlle"));
    saveCustomer(new Customer("C026", "Ishara", "GAlle"));
    saveCustomer(new Customer("C027", "Ishara", "GAlle"));
    saveCustomer(new Customer("C028", "Ishara", "GAlle"));
    saveCustomer(new Customer("C029", "Ishara", "GAlle"));
    saveCustomer(new Customer("C030", "Ishara", "GAlle"));
    saveCustomer(new Customer("C031", "Ishara", "GAlle"));
    saveCustomer(new Customer("C032", "Ishara", "GAlle"));
    saveCustomer(new Customer("C033", "Ishara", "GAlle"));
    saveCustomer(new Customer("C034", "Ishara", "GAlle"));
    saveCustomer(new Customer("C035", "Ishara", "GAlle"));
    saveCustomer(new Customer("C036", "Ishara", "GAlle"));
    saveCustomer(new Customer("C037", "Ishara", "GAlle"));
    saveCustomer(new Customer("C038", "Ishara", "GAlle"));
    saveCustomer(new Customer("C039", "Ishara", "GAlle"));
    saveCustomer(new Customer("C040", "Ishara", "GAlle"));
    saveCustomer(new Customer("C041", "Ishara", "GAlle"));
    saveCustomer(new Customer("C042", "Ishara", "GAlle"));
    saveCustomer(new Customer("C043", "Ishara", "GAlle"));
    saveCustomer(new Customer("C044", "Ishara", "GAlle"));
    saveCustomer(new Customer("C045", "Ishara", "GAlle"));
    saveCustomer(new Customer("C046", "Ishara", "GAlle"));
    saveCustomer(new Customer("C047", "Ishara", "GAlle"));
    saveCustomer(new Customer("C048", "Ishara", "GAlle"));
    saveCustomer(new Customer("C049", "Ishara", "GAlle"));
    saveCustomer(new Customer("C050", "Ishara", "GAlle"));

}
