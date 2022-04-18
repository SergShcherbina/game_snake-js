'use strict'
const persons = window.localStorage.getItem('persons') ? JSON.parse(window.localStorage.getItem('persons')) : []; //запрос значений по ключам persons, если значения получены они преобразовываются JSON.parse, если нет то в массив.
const form = document.querySelector('form');
const btnList = document.querySelector('.btn_list');

form.addEventListener('submit', (e) => {
        e.preventDefault();
            
        const formData = new FormData(form);
        const obj = {};
        formData.forEach(function(value, key) {
            obj[key] = value;  //преобразование formData в обьект
        });
        
        persons.push(obj); //добавление новых обьектов в конец массива обьектов persons
        
        window.localStorage.setItem('persons' , JSON.stringify(persons)); //сохранение в памяти браузера ключ:значение
        e.target.reset(); //очистка формы 
        //localStorage.clear(); //очистка памяти браузера  
    });

//функция по созданию таблицы
const contactInner  = function () {
    const table = document.querySelector('.table');
    table.innerHTML = null; //чтобы не дублировалась шапка таблицы (conumNames)
    let columnNames = Object.getOwnPropertyNames(persons[0]);// Объявляем переменную которой  передаем массив со всеми свойствами (Получаем все названия строк = Firstname, LastName и тд.)
        columnNames.forEach(columnName => {
            let th = document.createElement('th');
            th.innerHTML = columnName;
            table.appendChild(th);
    });

    let body = document.createElement('tbody');
    persons.forEach( person => {
        let tr = document.createElement('tr');
        columnNames.forEach(columnName => {
            let td = document.createElement('td');
            td.innerHTML = person[columnName];
            tr.appendChild(td);
        });
        body.appendChild(tr);
    });
    table.appendChild(body);
};
    btnList.addEventListener('click', (e) => {
        e.preventDefault();
        contactInner('.table');
        });


//убегающий крестик на рекламе
    const close = document.querySelector('.close');

    const random = (min, max) => {
        const rand = min + Math.random() * (max - min + 1);
        return Math.floor(rand);
    };

    close.addEventListener('mouseenter', () => {
        close.style.left = ` ${random(0, 30)}% `;
        close.style.top = ` ${random(0, 30)}% `;
    }); 

    //закрыть банер если успеть нажать на крестик
    close.addEventListener('click', () => {
        document.querySelector('.advertising').style.display =  `none`;
    });



//поиск по номеру телефона 
    const btnSearch = document.querySelector('.btn_search');
    const valueSearch = document.querySelector('.search');



//создание таблицы поиска
    const resulttInner  = function () {
        const result = persons.filter( (el) => el.phone === valueSearch.value);
        const table = document.querySelector('.search_table');
        table.innerHTML = null; //чтобы не дублировалась шапка таблицы (conumNames)
        let columnNames = Object.getOwnPropertyNames(persons[0]);// Объявляем переменную которой  передаем массив со всеми свойствами (Получаем все названия строк = Firstname, LastName и тд.)
            columnNames.forEach(columnName => {
                let th = document.createElement('th');
                th.innerHTML = columnName;
                table.appendChild(th);
        });
        let body = document.createElement('tbody');
            result.forEach( result => {
                let tr = document.createElement('tr');
                columnNames.forEach(columnName => {
                    let td = document.createElement('td');
                    td.innerHTML = result[columnName];
                    tr.appendChild(td);
                });
            body.appendChild(tr);
        });
        table.appendChild(body);
}; 
//назначаем событие на кнопку поиска go
    btnSearch.addEventListener('click', (e) => {
        e.preventDefault();
        resulttInner();
    });
