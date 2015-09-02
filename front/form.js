/**
 * Created by Yaroslav_Andryushche on 8/26/2015.
 */
/*
(function () {


    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs   = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                    return fToBind.apply(this instanceof fNOP
                            ? this
                            : oThis,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            if (this.prototype) {
                // native functions don't have a prototype
                fNOP.prototype = this.prototype;
            }
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    var form = document.forms.addItem;
    form.onsubmit = onAddItemSubmit;
    form.email.onchange = function(){validateForm(form)};
    form.phone.onchange = function(){validateForm(form)};

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/items", true);
    xhr.onreadystatechange = onItemsRequest;
    xhr.send();

    function onAddItemSubmit(event){
        if (validateForm(this)) {
            var formData = getFromDataURI(this);
            var xhr = new XMLHttpRequest();
            xhr.open("POST", "/items", true);
            xhr.onreadystatechange = onAddRequest;
            xhr.send(formData);
        }
        return false;
    }

    function addItemToTable(item, table) {
        var row = document.createElement('tr');
        row.appendChild(document.createElement('td')).innerText = table.childNodes.length-1;
        for(key in item) {
            if(item.hasOwnProperty(key))
                row.appendChild(document.createElement('td')).innerText = item[key];
        }

        var deleteLink = document.createElement('a');
        deleteLink.setAttribute('class', 'item-delete');
        deleteLink.innerText = 'Remove';
        deleteLink.setAttribute('href', '#');
        deleteLink.onclick = onDelete.bind(this, item.id);
        row.appendChild(document.createElement('td')).appendChild(deleteLink);
        table.appendChild(row);
    }

    function refreshTable(items) {
        var tableWrapper = document.getElementById('items-table-wrapper');
        tableWrapper.innerHTML = '';
        var table = document.createElement('table');
        table.setAttribute('id','items-table');
        table.appendChild(document.createElement('caption')).innerText = 'TABLE';
        var headerRow = document.createElement('tr');
        headerRow.setAttribute('class', 'header')
        headerRow.appendChild(document.createElement('th')).innerText = '#';
        for(key in items[0]) {
            if(items[0].hasOwnProperty(key))
                headerRow.appendChild(document.createElement('th')).innerText = key;
        }
        headerRow.appendChild(document.createElement('th')).innerText = '';
        table.appendChild(headerRow);
        for (var i=0; i<items.length; i++) {
            addItemToTable(items[i],table);
        }

        tableWrapper.appendChild(table);
    }

    function deleteItemsArray(items) {
        for (var i=0; i<items.length; i++) {
            deleteItem(items[i].id);
        }

        renumerateRows(document.getElementById('items-table').children);
    }


    function getIdIndex(header) {
        for (var i=0; i<header.cells.length; i++) {
            if(header.cells[i].innerText.toLowerCase() === 'id') {
                return i;
            }
        }

        return null;
    }
    function deleteItem(itemId) {
        var table = document.getElementById('items-table');
        var rows = table.children;
        var idIndex = getIdIndex(rows[1]);
        for(var i=1; i<rows.length; i++){
            if(rows[i].cells[idIndex].innerText == itemId ) {
                table.children[i].parentElement.removeChild(table.children[i]);
                return true;
            }
        }
        return false;
    }

    function renumerateRows(rows){
        for(var i=2; i<rows.length; i++) {
            rows[i].cells[0].innerText = i-1;
        }
    }

    function onAddRequest() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            console.error(this.status + ': ' + this.statusText);
        } else {
            var item = JSON.parse(this.responseText);
            if (!!item) {
                var table = document.getElementById('items-table');
                addItemToTable(item, table);
                clearForm();
            }
        }
    }

    function onItemsRequest() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            console.error(this.status + ': ' + this.statusText);
        } else {
            var items = JSON.parse(this.responseText);
            if (!!items) {
                refreshTable(items);
            }

        }
    }

    function clearMessages() {
        var messages = document.getElementsByTagName('div');
        for (var i=0; i<messages.length; i++) {
            if (messages[i].getAttribute('class') === 'error-message'){
                messages[i].parentNode.removeChild(messages[i]);
                i = i-1;
            }
        };
    }

    function validateForm(form) {
        clearMessages();
        var res = true;
        if (!isValidEmail(form.email.value)) {
            setErrorMessage('email-wrapper', 'Email format is incorrect');;
            res = false;
        }

        if (!isValidPhone(form.phone.value)) {
            setErrorMessage('phone-wrapper', 'Phone format is incorrect');
            res = false
        }
        return res;
    }

    function setErrorMessage(wrapperId, message) {
        messageSpan = document.createElement('div');
        messageSpan.innerText = message;
        messageSpan.setAttribute('class', 'error-message');
        document.getElementById(wrapperId).appendChild(messageSpan);
    }

    function isValidPhone(phone) {
        return (!!phone.match(/^\+375\d{9}$/) || !!phone.match(/^8017\d{7}$/)) ;
    }

    function isValidEmail(email) {
        return !!(email.match(/^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/));
    }

    function onDelete(id, event){
        request = '/items?id=' + id + '';
        var xhr = new XMLHttpRequest();
        xhr.open("DELETE", request , true);
        xhr.onreadystatechange = onDeleteRequest;
        xhr.send('');


        return false;
    }

    function onDeleteRequest() {
        if (this.readyState != 4) return;

        if (this.status != 200) {
            console.error(this.status + ': ' + this.statusText);
        } else {
            var items = JSON.parse(this.responseText);
            if (!!items) {
                deleteItemsArray(items);
            }

        }
    }


    function getFromDataURI(form){
        var res = "";
        var conjunction = "";
        for (var i=0; i<form.length; i++){
            if (form[i].type === 'text'){
                res += conjunction + form[i].name + '=' + encodeURIComponent(form[i].value);
                if (conjunction === '')
                    conjunction = "&";
            }
        }

        return res;
    }

    function clearForm() {
        for (var i=0; i<form.length; i++){
            if (form[i].type === 'text'){
                form[i].value = "";
            }
        }
    }

})();
*/
var staffApp = angular.module('staffManagementApp', []);

staffApp.controller('itemsCtrl', function ($scope, $http) {
    $scope.items = [];
    $http.get('/items').success(function(data){
        $scope.items = data;
    });

    $scope.deleteItem = function(id) {
        $http.delete('/items?id='+id).success(function(data){
            for (index in $scope.items) {
                if ($scope.items.hasOwnProperty(index) && $scope.items[index].id == id){
                    delete $scope.items[index];
                }
            }
        });
    }

});

