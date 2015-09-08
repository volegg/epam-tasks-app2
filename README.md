#How to start

##Requirements

- [NodeJS](https://nodejs.org/download/)

##Register Github account

[Join to Github](https://github.com/join)

##Clone repository

```
git clone git@github.com:volegg/epam-tasks-app2.git
```

##Create new branch with your name

```
git checkout -b YOUR_NAME
```

##Start app

```
npm start
```

-OR-

```
node app.js
```

##Open URL in browser

http://localhost:8888/

##Create commit for every sub-task

```
git commit -a -m "YOUR MESSAGE"
```

##Push code to the repository

```
git push origin YOUR_NAME:YOUR_NAME
```

##Enjoy;)

* * *

#Tasks description

##Business task (Javascript)

> Use only [Vanilla Javascript](http://habrahabr.ru/post/150594/) (no jQuery or something else)

1. Add logic to create Items via AJAX (XMLHttpRequest/ActiveXObject).
1. Add logic to view Items on the same page in a table.
1. Add ability to remove an Item from the table.
1. All data should be updated on realtime without page reload.
1. Add validation for the email ([RFC-822](https://www.cs.tut.fi/~jkorpela/rfc/822addr.html)) and the phones fields.
1. The phone field allow two type numbers like as +375ZZXXXYYYY and 8017XXXYYYY.
1. Show validation errors below the field.
1. Add items order number.
1. Validate Form field after end of user input instead of submit event.
1. Add input placeholder "Input name", "Your email address" and "+375ZZXXXYYYY" to fields accordingly.
1. Clean form inputs after success result.

##User interface task (CSS/HTML)

> Use only CSS/HTML (no bootstrap or something else)

1. Add styles to the Form like on the [form-picture](https://epam.sharepoint.com/sites/OrgPHPSolutionsTeamMSQ/FrontendCompetency/_layouts/15/Lightbox.aspx?url=https%3A%2F%2Fepam.sharepoint.com%2Fsites%2FOrgPHPSolutionsTeamMSQ%2FFrontendCompetency%2FDocuments%2FTasks-and-Tests%2520data%2Fhtml-form.jpeg).
1. Add styles to the table like on the [table-picture](https://epam.sharepoint.com/sites/OrgPHPSolutionsTeamMSQ/FrontendCompetency/_layouts/15/Lightbox.aspx?url=https%3A%2F%2Fepam.sharepoint.com%2Fsites%2FOrgPHPSolutionsTeamMSQ%2FFrontendCompetency%2FDocuments%2FTasks-and-Tests%2520data%2Fhtml-table.jpg).
1. A table row should be highlighted when cursor on it.
1. Add color stripes to a table row.
1. Add styles to validation errors.
1. If window width >= 768px form "Add item" has width 500px, table .. 800px.
1. If window width < 768px form and table should have width 100% of window.

* * *

#Application Interface

Base url: http://localhost:8888

Pattern:

**http method:** route/path

##Open form

**GET:**   /form

##Add/create items

**POST:**   /items

**Request:**

```json
{
    "name": "string",
    "email": "string",
    "phone": "number"
}
```

**Response 200:**

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "number"
}
```


##Get/fetch items

**GET:**   /items

**Response 200:**

```json
{
    "id": "string",
    "name": "string",
    "email": "string",
    "phone": "number"
}
```

##Remove/delete items

**DELETE:**   /items

**Response 204.**


**DELETE:**   /items?id=X

**Response 200:**

```json
[
    {
        "id": "X",
        "name": "string",
        "email": "string",
        "phone": "number"
    }
]
```

**DELETE:**   /items?id=X,Y,Z

**Response 200:**

```json
[
    {
        "id": "X",
        "name": "string",
        "email": "string",
        "phone": "number"
    },
    {
        "id": "Y",
        "name": "string",
        "email": "string",
        "phone": "number"
    },
    {
        "id": "Z",
        "name": "string",
        "email": "string",
        "phone": "number"
    }
]
```
