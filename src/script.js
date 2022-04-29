'use strict'
    let persons = window.localStorage.getItem('persons') ? JSON.parse(window.localStorage.getItem('persons')) : []; //запрос значений по ключам persons, если значения получены они преобразовываются JSON.parse, если нет то в массив.
    
    const form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
            
        const formData = new FormData(form);                                      //преобразовываем формы в формдата
        const person = {};                                                        //преобразование formData в обьект
        formData.forEach(function(value, key) {
            person.id = persons.length + 1;                                       //добавляем  идентификатор массива
            person[key] = value;
        });
        persons.push(person);                                                     //добавление новых обьектов в конец массива обьектов persons

    window.localStorage.setItem('persons' , JSON.stringify(persons));             //сохранение в памяти браузера ключ:значение
        e.target.reset(); //очистка формы 
    });

///////////////////////////создание таблицы списка контактов//////////////
    let myIndex;
    function contactInner () {
//////////////пагинация страницы
    let pagination = document.querySelector('#pagination');
    pagination.innerHTML = null;                                                   //чтобы не рисовало повторно li в конце страницы
    let notesOnPage = 5;                                                           //количесво страниц
    let countOfItems = Math.ceil(persons.length / notesOnPage);                    //делим длину массива на количество страниц и округляем к большему числу 
    let items = [];
    for (let i = 1; i <= countOfItems; i++) {                                      //цикл создания li элементов внизу страницы 
        let li = document.createElement('li');
        li.innerHTML = i;                                                          //добавляем нумерацию
        pagination.appendChild(li);
        items.push(li);
    }
    
    for (let item of items) { 
        items[0].click();                                                         //имитируем нажатие на первый li при загручке, чтобы были видны первые контакты 
        item.addEventListener('click', function() {
            let pageNumm = +this.innerHTML;                                       //записываем в переменную значени li на которую кликнули
            let start = (pageNumm - 1) * notesOnPage;                            
            let end = start + notesOnPage;
            let notes = persons.slice(start, end);                                //создаем поверхносную копию массива для вывода в таблицу на страницу

 //////////////////построение таблицы 
            const table = document.querySelector('.table');
            table.innerHTML = null;                                               //чтобы не дублировалась таблица при каждом вызове
            const columnNames = Object.getOwnPropertyNames(persons[0]);           // Объявляем переменную которой  передаем массив со всеми свойствами (Получаем все названия строк = Firstname, LastName и тд.)
                columnNames.forEach(columnName => {
                const th = document.createElement('th');
                th.innerHTML = columnName;
                table.appendChild(th);
            });
            const body = document.createElement('tbody');

            notes.forEach( el => {
                const tr = document.createElement('tr');
                tr.id = el.id
                tr.addEventListener('click', function() {
                    myIndex = persons.indexOf(el);                                //получаем индекс обьекта масива
                });
                
                columnNames.forEach(columnName => {
                    const td = document.createElement('td');
                    td.innerHTML = el[columnName];
                    tr.appendChild(td);
                });
                
                body.appendChild(tr);
            });
            table.appendChild(body);
        });
    }
}
    
    const btnList = document.querySelector('.btn_list');
    btnList.addEventListener('click', (e) => {
        e.preventDefault();
        contactInner();
    });

    document.querySelector('.btn_remove').addEventListener('click', (e) => {
        e.preventDefault();
        localStorage.clear();
    });

///////////////////////поиск по номеру телефона ///////////////
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
            let removeTr = document.createElement('button');                            //создаем кнопку по удалению строки
            removeTr.innerHTML = '<img class="icon_remove" src="./img/delete.svg" alt="remove">';    //вставляем в кнопку картинку
            tr.append(removeTr);                                                        //вставляем кнопку в верстку после строки
                                                              
            if (!!removeTr === true && tr.classList.contains('red') === true) {          
              removeTr.remove();
              tr.classList.add('red');                                                   //добавляем класс red активной строке
             }  

            tr.classList.add('red'); 
            removeTr.addEventListener('click', (e) => {                                 //вешаем событие на кнопку удаление строки 
                persons.splice(myIndex, 1);                                             //удаляем обьект по индексу из массива persons
                window.localStorage.setItem('persons' , JSON.stringify(persons));       //пересохраняем persons
                contactInner();                                                         //вызываем построение таблицы, чтобы не обновлять 
            });
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


//////////////добавление файла из сохраненных /////////////////////////////////
    function showFile(input) {
        let file = input.files[0];
        let reader = new FileReader();

        reader.readAsText(file);                                               //чтоние содержимого файла Blob

        reader.onload = function() {
            persons = JSON.parse(reader.result);                               // атребут result выдает результат метода readAsText в виде строки
            window.localStorage.setItem('persons' , JSON.stringify(persons));
        };
        reader.onerror = function() {
            console.log(reader.error);
        }; 
    }

/////////////////выгружаем контакты на сервер///////////////////// 
    function textToFile (text, name) {
        const b = new Blob([text], { type: 'text/plain' });                   //создаем класс Blob 
        const url = window.URL.createObjectURL(b);                            //создаем и присваиваем url адрес на созданный выше класс =  конвертация Blob-объекта в строку с кодировкой base64
        const a = document.createElement('a');                                //добавляем ссылку
        a.href = url;                                                         //записываем в путь ссылки адрес url нашего созданного класса Blob
        a.download = name || 'text.txt';                                      //по ссылке скачиваем текстовый файл с именем и разрешением txt
        a.type = 'aplication/json';                                           //присваеваем MIME-тип ссылки = json данные
        //a.type = 'text/plain';                                              //присваеваем MIME-тип ссылки = текстовые данные
        setTimeout(() => window.URL.revokeObjectURL(url), 10000);             //удаляем внутреннюю ссылку на  обьект Blob для освобождения памяти
        a.click();                                                            //имитация клика по ссылке
    }
    document.querySelector('.saveJson').addEventListener('click', () => {
        textToFile (JSON.stringify(persons), 'contacts.json');                 //скачиваем файл (тело файла, название)
    });
    
//////////////////////////////////////////////////////////////////////
//console.log(JSON.stringify(persons));

// + Пол это селект (мужской, женский, оно)
// + Дата рождения (в виде даты рождения!)
// + В редактировании разрешить ввод только обусловленные параметры
// + Удаление выбранного контакта
// + Выгрузка данных из массива в файл (создается новый файл в корневом каталоге)
// + Загрузка данных из файла обратно на страницу
// + Пагинация страниц (Когда много контактов показывает первые 20 и при нажатии следующая страница)




    