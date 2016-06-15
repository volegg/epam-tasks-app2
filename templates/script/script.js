    if(window.innerWidth < 768)
    {
        document.getElementById('form').style.width="100%";
        document.getElementById('table_div').style.width="100%";
        document.getElementById('name').style.width="100%";
        document.getElementById('phone').style.width="100%";
        document.getElementById('email').style.width="100%";
    }


  //adding button-event listiners
    document.getElementById('name').addEventListener('blur', checkName);
    document.getElementById('phone').addEventListener('blur', checkPhone);
    document.getElementById('email').addEventListener('blur', checkEmail);
    document.getElementById('post').addEventListener('click', postData);
    document.getElementById('get').addEventListener('click', getData);
    document.getElementById('clear').addEventListener('click', clearForms);


    
function checkName()
{
    var name_str = document.getElementById("name").value;
    var name_reg = /^\d$/ig;
    document.getElementById('name_error').style.visibility='hidden';
    document.getElementById('name_error').innerHTML=null;
    if(name_str.length == 0)
    {
        document.getElementById('name_error').innerHTML="Please enter valid name (length >0 and contain only symbols";
        document.getElementById('name_error').style.visibility='visible';
        document.getElementById("name").focus();
    }
    else
    {
        name_str = name_str.match(name_reg);
        if(name_str != null)
        {
            document.getElementById('name_error').innerHTML="Please enter valid name (length >0 and contain only symbols";
            document.getElementById('name_error').style.visibility='visible';
            document.getElementById("name").focus(); 
        }

    }
}
function checkEmail()
{
    var email_str = document.getElementById("email").value;
    var email_reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/;
    document.getElementById('email_error').style.visibility='hidden';
    document.getElementById('email_error').innerHTML=null;
    if(email_str.length == 0)
    {
        document.getElementById('email_error').innerHTML="Please enter valid email";
        document.getElementById('email_error').style.visibility='visible';
        document.getElementById("email").focus();
    }
    else
    {
        email_str = email_reg.test(email_str);
        if(email_str != true)
        {
            document.getElementById('email_error').innerHTML="Please enter valid email";
            document.getElementById('email_error').style.visibility='visible';
            document.getElementById("email").focus(); 
        }
    }
}

function checkPhone()
{
    var phone_str = document.getElementById("phone").value;
    var phone_reg = /^\+375(25|29|33|44)\d{7}$/g;
    var phone_reg1 = /^\8017(2|3)\d{6}$/g;
    document.getElementById('phone_error').style.visibility='hidden';
    document.getElementById('phone_error').innerHTML=null;
    var phone_result;
    if(phone.length == 0)
    {
        document.getElementById('phone_error').innerHTML="Please enter valid phone number";
        document.getElementById('phone_error').style.visibility='visible';
        document.getElementById("phone").focus();
    }
    else
    {
        phone_result = phone_reg.test(phone_str);
        if(phone_result != true)
        {
            phone_result = phone_reg1.test(phone_str);
            if(phone_result != true)
            {
                document.getElementById('phone_error').innerHTML="Please enter valid phone number";
                document.getElementById('phone_error').style.visibility='visible';
                document.getElementById("phone").focus();
            } 
        }
    }
}
function postData()
{
    if((document.getElementById('name').value.length > 0) && (document.getElementById('email').value.length > 0) && (document.getElementById('phone').value.length > 0))
    {
        var xhr = new XMLHttpRequest();
        var email = document.getElementById("email").value;
        var name = document.getElementById("name").value;
        var phone = document.getElementById("phone").value;
        
        var postData = 'name=' + encodeURIComponent(name) + '&email=' + encodeURIComponent(email) + '&phone=' + encodeURIComponent(phone);
        console.log("PostData: "+postData);
        xhr.open('POST', '/items');
        xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        xhr.send(postData);
        xhr.onreadystatechange = function()
        {
            if(xhr.readyState != 4) return;
            if(xhr.readyState == 4 && xhr.status == 200)
            {
                clearForms();
                getData();
            }
           
        }
    }
    else
    {
                alert("All the fields are required");
    }
        
}
function getData()
{
    var xhr = new XMLHttpRequest();
    xhr.open('GET', '/items', true);
    xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState==4 && xhr.status==200)
        {
            createList(xhr.responseText);    
        }
    }
    xhr.send(null);

}
function createList(data)
{
    document.getElementById("table_div").innerHTML = null;
    var data_array = JSON.parse(data);
    if(data_array.length >= 1)
    {
        var table = document.createElement("table");
        table.id = "data_list";
        table.setAttribute('class', 'list');
        var head_tr = document.createElement("tr");
        head_tr.appendChild(document.createElement("th")).innerText = "#";
        head_tr.appendChild(document.createElement("th")).innerText = "Name";
        head_tr.appendChild(document.createElement("th")).innerText = "Email";
        head_tr.appendChild(document.createElement("th")).innerText = "Phone";
        head_tr.appendChild(document.createElement("th")).innerText = null;
        head_tr.setAttribute('class', 'border-bottom');
        table.appendChild(head_tr);
        document.getElementById("table_div").appendChild(table);
        for(var i = 0; i < data_array.length; i++)
        {
            table.appendChild(document.createElement("tr")).id = "tr"+i;
            document.getElementById("tr"+i).appendChild(document.createElement("td")).innerText = i+1;
            document.getElementById("tr"+i).childNodes[0].setAttribute('class', 'bold');
            document.getElementById("tr"+i).appendChild(document.createElement("td")).innerText = data_array[i].name;
            document.getElementById("tr"+i).appendChild(document.createElement("td")).innerText = data_array[i].email;
            document.getElementById("tr"+i).appendChild(document.createElement("td")).innerText = data_array[i].phone;
            document.getElementById("tr"+i).appendChild(document.createElement("td")).id = "td"+i;
            var rec_id = data_array[i].id;
            var link = document.createElement('a');
            link.setAttribute('href', '#');
            link.setAttribute('id', rec_id);
            link.appendChild(document.createTextNode("Remove"));
            document.getElementById("td"+i).appendChild(link);
        }
    document.getElementById('data_list').addEventListener('click', getTarget);
    if(window.innerWidth < 768)
    {
        document.getElementById('data_list').style.width="100%";
    }
    document.getElementById("table_div").style.visibility='visible';
    }
}
function clearForms()
{
    document.getElementById("email").value = null;
    document.getElementById("name").value = null;
    document.getElementById("phone").value = null;    
}
function removeItem(id, target)
{
    var xhr = new XMLHttpRequest();
    xhr.open('DELETE', '/items?id='+id, true);
    var dataDelete = 'id='+id;
    xhr.onreadystatechange = function()
    {
        if(xhr.readyState==4 && xhr.status==200)
        {
            removeTableRow(target);
        }
    }
    xhr.send();
}
function getTarget()
{
    if(window.event.target.nodeName == "A")
    {
        var target_obj = window.event.target;
        removeItem(target_obj.id, target_obj);
    }
}
function removeTableRow(target)
{
    var parent_obj = target;
    var ord_num;
    var nodata=false;
    while(parent_obj)
    {
        parent_obj = parent_obj.parentElement;
        if(parent_obj.nodeName == "TR")
        {
            console.log("node: "+parent_obj.childNodes[0].innerHTML);
            document.getElementById('data_list').removeChild(parent_obj);
            if(document.getElementById('data_list').childNodes.length == 1)
                {
                    
                 document.getElementById('data_list').parentElement.removeChild(document.getElementById('data_list'));
                 nodata = true;


                }
            break;
        }
    }
    if(nodata != true)
    {
        var tr_count = document.getElementById('data_list').getElementsByTagName("tr").length;
        console.log("tr_length: "+tr_count);
        for(var count =0; count < tr_count; count++)
        {
            if(count>0)
            {
                document.getElementById('data_list').childNodes[count].childNodes[0].innerHTML = count;
                console.log("tr:"+count);
                console.log(document.getElementById('data_list').childNodes[count].childNodes[0].innerHTML);
            }       
        }
    }
}
