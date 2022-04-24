'use strict'
    const persons = window.localStorage.getItem('persons') ? JSON.parse(window.localStorage.getItem('persons')) : []; //запрос значений по ключам persons, если значения получены они преобразовываются JSON.parse, если нет то в массив.
    
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
            
        const formData = new FormData(form);                              //преобразовываем формы в формдата
        const person = {};                                                //преобразование formData в обьект
        formData.forEach(function(value, key) {
            person.id = persons.length + 1;                                   //добавляем  идентификатор массива
            person[key] = value;
        });
        persons.push(person);                                             //добавление новых обьектов в конец массива обьектов persons

    window.localStorage.setItem('persons' , JSON.stringify(persons));     //сохранение в памяти браузера ключ:значение
        e.target.reset(); //очистка формы 
    });

///////////////////////////создание таблицы списка контактов//////////////
let myIndex;

    const contactInner  = function () {
        const table = document.querySelector('.table');
        table.innerHTML = null;                                             //чтобы не дублировалась таблица при каждом вызове
        const columnNames = Object.getOwnPropertyNames(persons[0]);         // Объявляем переменную которой  передаем массив со всеми свойствами (Получаем все названия строк = Firstname, LastName и тд.)
            columnNames.forEach(columnName => {
            const th = document.createElement('th');
            th.innerHTML = columnName;
            table.appendChild(th);
        });
        const body = document.createElement('tbody');
        persons.forEach( el => {
            const tr = document.createElement('tr');
            tr.id = el.id
            tr.addEventListener('click', function() {
                myIndex = persons.indexOf(el); 
                console.log(myIndex); 
            });
            columnNames.forEach(columnName => {
                const td = document.createElement('td');
                td.innerHTML = el[columnName];
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });
        table.appendChild(body);
    };
    const btnList = document.querySelector('.btn_list');
    btnList.addEventListener('click', (e) => {
        e.preventDefault();
        contactInner('.table');
    });

    document.querySelector('.btn_remove').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
    });

/////////////////////////////поиск по номеру телефона ///////////////
    const inputSearch = document.querySelector('.search');
    
    const resulttInner  = function () {                                          //функция создания таблицы поиска
        let result = persons.filter( el => el.phone === inputSearch.value);      //фильтруем массив обьектов persons по ключу phone и сравниваем с содержимым  поисковой строки input
        const table = document.querySelector('.search_table');
        table.innerHTML = null;                                                  //чтобы не дублировалась таблица
        const columnNames = Object.getOwnPropertyNames(persons[0]);              // Объявляем переменную которой  передаем массив со всеми свойствами (Получаем все названия строк = Firstname, LastName и тд.)
            columnNames.forEach(columnName => {
                const th = document.createElement('th');
                th.innerHTML = columnName; 
                table.appendChild(th);
        });
        const body = document.createElement('tbody');
            result.forEach( el => {
                const tr = document.createElement('tr');
				tr.id = el.id;
                columnNames.forEach(columnName => {
                    const td = document.createElement('td');
                    td.innerHTML = el[columnName];
                    td.id = (columnName);
                    tr.appendChild(td);
                });
            body.appendChild(tr);
        });
        table.appendChild(body);
};
//назначаем событие на кнопку поиска go
    const btnSearch = document.querySelector('.btn_search');
    btnSearch.addEventListener('click', (e) => {
        e.preventDefault();
        if(inputSearch.value != ''){
            resulttInner();
        inputSearch.value = ''; 
        } else {
            alert('Заполните поле ввода');
        }
    });

//////////////////////////редактирование ячейки ///////////////
   const wrapperTd = document.querySelector('.search_table');                      //родительский элемент таблицы

    wrapperTd.addEventListener("click", function func(e) {
        if(e.target && e.target.tagName == 'TD') {                                 //делегирование событий через родителя(search_table) на ячейку td(tagName == 'TD'), так как таблица сформирована динамически
            const td = e.target;
            const input = document.createElement('input');   
            input.value = td.innerHTML;                                            //аписываем в input содержимое ячейки td
            input['data-property-name'] = td.id;
            input['data-row-id'] = td.parentNode.id;
            td.innerHTML = '';                                                     //очищаем ячейку td от старого значения(содержимого)
            td.append(input);
          
            input.addEventListener('blur', function() {                            //событие на инпут когда убираем фокус
                td.innerHTML = input.value;                                        //записываем содержимое инпута в ячейку, сам инпут затирается своим же сожержимым
                const sok = persons.find(el => el.id == input['data-row-id']);
                sok[input['data-property-name']] = input.value;												
                window.localStorage.setItem('persons' , JSON.stringify(persons));
                contactInner();
            });  
        } 
    }); 

////////////////удаление строки из обьекта/////////////////////
const wrapperTh = document.querySelector('.table');                                     //родительский элемент таблицы

    wrapperTh.addEventListener('click', function func (e) {
        if(e.target && e.target.tagName == 'TD') {                                      //делегирование событий через родителя(table) на ячейку td(tagName == 'TD'), так как таблица сформирована динамически
            const tr = e.target.parentNode;
            const removeTr = document.createElement('batton');                          //создаем кнопку по удалению строки
            removeTr.innerHTML = '<img class="icon_remove" src="./img/delete.svg" alt="remove">';    //вставляем в кнопку картинку
            tr.append(removeTr);                                                        //вставляем кнопку в верстку после строки
            tr.classList.toggle('red');                                                 //добавляем класс red активной строке
            if(removeTr == true) {
            } 
            removeTr.addEventListener('click', (e) => {                                 //вешаем событие на кнопку удаление строки 
                e.preventDefault();
                persons.splice(myIndex, 1);                                             //удаляем обьект по индексу из массива persons
                window.localStorage.setItem('persons' , JSON.stringify(persons));       //пересохраняем persons
                contactInner();                                                         //вызываем построение таблицы, чтобы не обновлять 
            });
            wrapperTh.removeEventListener('click', func);                               //удаляем событие чтобы не дублировались кнопки 
        }                                         
    });

///////////////убегающий крестик на рекламе//////////////////////
    const close = document.querySelector('.close');

    const random = (min, max) => {
        const rand = min + Math.random() * (max - min + 1);
        return Math.floor(rand);
    };
    close.addEventListener('mouseenter', () => {
        close.style.left = ` ${random(0, 40)}% `;
        close.style.top = ` ${random(0, 40)}% `;
    }); 
    //закрыть банер если успеть нажать на крестик
    close.addEventListener('click', () => {
        document.querySelector('.advertising').style.display =  `none`;
    });
///////////////////////////////////////////////////////////////

/////////////////выгружаем контакты на сервер///////////////////// 
const saveJson = document.querySelector('.saveJson');
saveJson.addEventListener('click', e => {
    e.preventDefault();

    fetch('./server.php', {                                   //адрес
        method: "POST",                                     //метод отправки
        headers: {
            'Content-type': 'application/json'              //заголовки добавляются при отправке Json
        },
        body: JSON.stringify(persons),                      //тело отправляемого файла

    })
    .then(data => data.text())                                // data это данные которые взвращаются с сервера преобразовываем в текстовый формат
    .then(data => console.log(data))
    .catch( () => console.log('Ошибка'));                                   //при ошибке
    /* .finally( () => {                                       //действия которые выполняются в любом случае , например очистка формы
    }) */
});
//////////////////////////////////////////////////////////////////////
//console.log(JSON.stringify(persons));

//+ Пол это селект (мужской, женский, оно)
// +Дата рождения (в виде даты рождения!)
//+ В редактировании разрешить ввод только обусловленные параметры
// +Удаление выбранного контакта
// Выгрузка данных из массива в файл (создается новый файл в корневом каталоге)
// Загрузка данных из файла обратно на страницу
// Пагинация страниц (Когда много контактов показывает первые 20 и при нажатии следующая страница)