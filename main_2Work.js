  "use strict"
  /*===================================================================================*/
 /*                   					 M O D E L 				    				  */
/*===================================================================================*/
function monthModel() {
	var self = this;
	var myView = null;
	var Controller = null;
	var name = null;
	var selectedDate = {};
	location
	self.eventHash = {};
/*-----------------------------------
	ВЫБРАННАЯ ДАТА
-----------------------------------*/
	self.nowDate = new Date();
/*-----------------------------------
	НАЗВАНИЕ МЕСЯЦЕВ
-----------------------------------*/
	self.monthName = [
	  'Январь', 'Февраль', 'Март', 'Апрель',
	  'Май', 'Июнь', 'Июль', 'Август',
	  'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
	];
/*-----------------------------------
	НАЗВАНИЕ ДНЕЙ НЕДЕЛИ
-----------------------------------*/
	self.dayName = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	self.init = function (view) {
		myView = view;
//---------инициализируем вошедшего пользователя
		this.userName = sessionStorage.whoLogin;
		getNowDate (); // задаем сегодняшнюю дату
// ------ инициализируем события пользователя		
		// --- определяем есть ли события
		var evHash = JSON.parse(localStorage.getItem(this.userName));
		if ('userEvent' in evHash) {
			self.eventHash = JSON.parse(JSON.parse(localStorage.getItem(this.userName)).userEvent)
		}
// ------ инициализируем даты
		self.titleDate = self.monthName[selectedDate.Month] + ' ' + selectedDate.Year;
		self.totalDays = 32 - new Date(selectedDate.Year, (selectedDate.Month), 32).getDate();
		self.startDay = new Date(selectedDate.Year, selectedDate.Month, 1).getDay()-1; 	// ------- начальный день недели месяца
		self.totalWeek = Math.ceil((self.totalDays+self.startDay)/7); // ------------------------------------- количество недель в месяце
		self.finalIndex = Math.ceil((self.totalDays+self.startDay)/7)*7;	// ------------------------------- количество ячеек в таблице месяца	
		myView.update(selectedDate.Year, selectedDate.Month, selectedDate.Day);
		/*	СОЗДАЕМ КОНТРОЛЛЕР, КОТОРЫЙ ПОТОМ ИНИЦИАЛИЗИРУЕМ ЕГО */	
		if (!Controller) {
			Controller = new CalendarController ();
			Controller.init(self);
		}
	};

	self.updateModel = function (index) {
		if (index == null) {
			getNowDate()
			window.location.hash = name;
		}
		else{
			updateDate (index, name)
		}
		self.titleDate = self.monthName[selectedDate.Month] + ' ' + selectedDate.Year;
		self.totalDays = 32 - new Date(selectedDate.Year, (selectedDate.Month), 32).getDate();
		self.startDay = new Date(selectedDate.Year, selectedDate.Month, 1).getDay()-1; 	// ------- начальный день недели месяца
		self.totalWeek = Math.ceil((self.totalDays+self.startDay)/7); // ------------------------------------- количество недель в месяце
		self.finalIndex = Math.ceil((self.totalDays+self.startDay)/7)*7;	// ------------------------------- количество ячеек в таблице месяца	
		myView.update(selectedDate.Year, selectedDate.Month, selectedDate.Day);
		Controller.update(name);
	}
	
	self.updateView = function (_name) {
		if (myView) {
			name = _name;
			window.location.hash = name;
			if (name != null) {
				myView = null;
				if (name == 'month') {
					myView = new monthView(self);
 					myView.init(self);
				}
				else if (name == 'week') {
					myView = new weekView(self);
	  				myView.init(self);
				}
				else if (name == 'day') {
					myView = new dayView(self);
	  				myView.init(self);
				}
				getNowDate (); // задаем сегодняшнюю дату
			}
		}
	self.titleDate = self.monthName[selectedDate.Month] + ' ' + selectedDate.Year;
	myView.update(selectedDate.Year, selectedDate.Month, selectedDate.Day);
	Controller.update(name);
	}

	var V = new monthView();
	V.init(self);
/*-----------------------------------
	СОБЫТИЯ В ЕЖЕДНЕВНИКЕ 
-----------------------------------	*/
		// создание события в ежедневнике
	self.createEvent = function(el){
		var elem = el;
		var dateEvent = $(elem).attr("data-date");
		if (!dateEvent) { return false}
		var event = prompt ('Введите событие');
			if (event != null & event != '' ) {
				if (!self.eventHash[dateEvent]) {
					self.eventHash[dateEvent] = [];
					self.eventHash[dateEvent].push(event);
				}
				else{
					self.eventHash[dateEvent].push(event);
				}
				var us = JSON.parse(localStorage.getItem(this.userName));
				var eventJSON = JSON.stringify(self.eventHash);
				us.userEvent = eventJSON;
				us = JSON.stringify(us)
				localStorage.setItem(this.userName, us);
	
				myView.createEvent(event,elem);
			}
			else if (event == '') {
				alert ('Укажите событие');
				self.createEvent(el);
			}
	}
	self.createEventMenu = function(EO){
		var td = EO.target.parentNode;
		var posClickX = td.offsetLeft;
		var posClickY = td.offsetTop;
		var title = $(td).attr('data-date');
		var ev = $(td).find('ol:hidden, ol:visible');
	
		myView.createEventMenu(title, ev,posClickX, posClickY );
	}
	function getNowDate() {
		selectedDate = {
				'Day' : self.nowDate.getDate(),
				'Month' : self.nowDate.getMonth(),
				'Year' : self.nowDate.getFullYear()
			};
	}
	function updateDate (index, name) {
		if (name == 'month'|| name == null) {
			self.totalDays = 32 - new Date(selectedDate.Year, (selectedDate.Month), 32).getDate();
			var year = (selectedDate.Month+index>=0 & selectedDate.Month+index<12)?selectedDate.Year:(selectedDate.Year+index);
			var month = (selectedDate.Month+index>=0 & selectedDate.Month+index<12)?(selectedDate.Month+index):(index>0?0:11);
			var day = (selectedDate.Day+index>0 & (selectedDate.Day+index) >= self.totalDays)?(selectedDate.Day+index):(index>0?1:self.totalDays);
		}
		else if (name == 'week') {
			if (index>0) {
				var month = selectedDate.Month<12?selectedDate.Month:selectedDate.Month+1;
				var year = selectedDate.Month>=0?selectedDate.Year:selectedDate.Year+1;
				self.totalDays = 32 - new Date(selectedDate.Year, (selectedDate.Month), 32).getDate();
				var day = (selectedDate.Day+index*7) <= self.totalDays?(selectedDate.Day+index*7):(month +=1, selectedDate.Day=1);
			}
			else if (index<0) {
				var month = (selectedDate.Month>=0 & selectedDate.Month<12)?selectedDate.Month:selectedDate.Month-1;
				var year = (selectedDate.Month>=0 & selectedDate.Month<12)?selectedDate.Year:selectedDate.Year-1;
				var day = (selectedDate.Day+index*7>-6)?(selectedDate.Day+index*7):( month-=1, 32 - new Date(year, (month), 32).getDate());
				
				
			}	
		}
		else if (name == 'day') {
			if (index>0) {
				var month = (selectedDate.Month>=0 & selectedDate.Month<12)?selectedDate.Month:(selectedDate.Month+1);
				var year = (selectedDate.Month>=0 & selectedDate.Month<12)?selectedDate.Year:(selectedDate.Year+1);
				self.totalDays = 32 - new Date(selectedDate.Year, (selectedDate.Month), 32).getDate();
				var day = (selectedDate.Day+index>=0 & (selectedDate.Day+index) <= self.totalDays)?(selectedDate.Day+index):(month +=1, selectedDate.Day=1);
			}
			if (index<0) {
				self.totalDays = 32 - new Date(selectedDate.Year, (selectedDate.Month), 31).getDate();
				var day = (selectedDate.Day+index>0)?(selectedDate.Day+index):( selectedDate.Month-=1, self.totalDays);
				var month = (selectedDate.Month>=0 & selectedDate.Month<12)?(selectedDate.Month):(11);
				var year = (selectedDate.Month>=0 & selectedDate.Month<12)?selectedDate.Year:(selectedDate.Year+index);
			}
		}
		selectedDate = {
					'Day' : day,
					'Month' : month,
					'Year' : year
				}
	}
}

  /*===================================================================================*/
 /*                   				   V I E W  - Month								  */
/*===================================================================================*/
function monthView() {
	var myModel = null;
	var myField = null;
	var self = this;
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ VIEW
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
		myModel.init(this);
	};
/*-----------------------------
	МЕТОД ПОСТРОЕНИЯ КАЛЕНДАРЯ (МЕСЯЦ)
-----------------------------------*/
	this.update = function (_year, _month, _day) {
		var year = _year;
		var month =  _month;
		var day = _day;
		var userField =  document.getElementById ('user');
		userField.innerHTML = myModel.userName;
/*-----------------------------------
	ЗАПИСЫВАЕМ ДАТУ В ШАПКЕ КАЛЕНДАРЯ
------------------------------------*/			
		var date = document.getElementById ('month-date');
		var text = myModel.titleDate + '';
		date.innerHTML = text;
/*-----------------------------------
	НАХОДИМ И ОБНУЛЯЕМ КОНТЕЙНЕР C
	КАЛЕНДАРЕМ, СОЗДАЕМ ПОЛЕ 
------------------------------------*/
		var container = document.getElementById ('view-container');
		container.innerHTML = '';

		myField = document.createElement('table');
		myField.id = 'month';
		container.appendChild(myField);

		var tbody = document.createElement('tbody');
		myField.appendChild(tbody);
/*-----------------------------------
	СОЗДАЕМ ЯЧЕЙКИ КАЛЕНДАРЯ
		day   - числа дней месяца
		index - количество ячеек в месяца, 
				включая пустые
------------------------------------*/
		var curDay = 1;
		var index = 0;
/*-----------------------------------
	СОЗДАЕМ СТРОКИ
------------------------------------*/	
		for (let i = 0; i <= myModel.totalWeek; i++) {
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
/*-----------------------------------
	ЗАПОЛНЯЕМ ПЕРВУЮ СТРОКУ
	ДНЯМИ НЕДЕЛИ ИЗ МОДЕЛИ
------------------------------------*/	
			for (let j = 0; j < 7; j++) {
				var td = document.createElement('td');
				tr.appendChild(td);
				if ( i == 0 ) {				
					tr.className = 'dayName';
					td.innerHTML = myModel.dayName[j];
				};
/*-----------------------------------
	ЗАПОЛНЯЕМ КАЛЕНДАРЬ В ЗАВИСИМОСТИ 
	ОТ КОЛИЧЕСТВА ДНЕЙ
------------------------------------*/	
				if ( i > 0 ) {
					if (!(index < myModel.startDay) & !(index >= myModel.totalDays+myModel.startDay) & index < myModel.finalIndex ) {
						if (curDay == myModel.nowDate.getDate() & 
							month ==  myModel.nowDate.getMonth() &
							year == myModel.nowDate.getFullYear()) {
							td.className = "now-date";
						}
						td.innerHTML = curDay;
						td.dataset.date = curDay+ '/'+month + '/'+ year;
						var ul = document.createElement('ul');
						td.appendChild(ul);
						if (td.dataset.date in myModel.eventHash) {
							for (let i =0; i< myModel.eventHash[td.dataset.date].length; i++) {
								this.createEvent(myModel.eventHash[td.dataset.date][i], td)
							}
						}
						curDay++;
					}
					index++;
	       		}
			}
		}
	}
	self.hideEvent = function(td) {
		var show = document.createElement('button');
		show.className = "show";
		show.innerHTML = '...' 
		td.appendChild(show);
	}
	this.createEvent = function(event,el){
		var td = el;
		var ol = document.createElement('ol');
			ol.innerHTML = event;
			ol.className = 'event';
			$(td).find('ul').each(function(index, el) {
				el.appendChild(ol)
			}).end().find('ol:gt(1)').hide(); 
			if ($(td).find('ol').length>2 & !($(td).find('.show').is('.show'))) {
				self.hideEvent(td)
			}
	}
	this.createEventMenu = function(title, ev,posClickX,posClickY){
		var popup = document.createElement('div');
		var popupBack = document.createElement('div');
		popup.id = 'eventList';
		popupBack.id = 'eventListBack';
		popup.style.left = posClickX +'px';
		popup.style.top = posClickY + 'px';
		document.body.appendChild(popupBack);
		popupBack.appendChild(popup);
		
		var dataTitle = document.createElement('div');
		dataTitle.innerHTML = title;
		dataTitle.id = 'dataTittle';
		popup.appendChild(dataTitle);
		var ul = document.createElement('ul');
		popup.appendChild(ul);
		ev.each(function(index, el) {
			el.style.display = 'block';
		});
		$(ul).append(ev);
	}
}

  /*===================================================================================*/
 /*                   				   V I E W  - Week								  */
/*===================================================================================*/
function weekView() {
	var self = this;
	var myModel = null;
	var myField = null;
	
	var curDay = null;
	var curMonth = null;
	var curYear = null;

	var weekDay = null; //порядковый день недели
/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
	};
/*-----------------------------------
	МЕТОД ПОСТРОЕНИЯ КАЛЕНДАРЯ (Неделя)
-----------------------------------*/
	this.update = function (_year, _month, _day) {
		curYear = _year;
		curMonth =  _month;
		curDay = _day;
/*-----------------------------------
	ЗАПИСЫВАЕМ ДАТУ В ШАПКЕ КАЛЕНДАРЯ
------------------------------------*/	
		var date = document.getElementById ('month-date');
		date.innerHTML = myModel.titleDate;
/*-----------------------------------
	НАХОДИМ И ОБНУЛЯЕМ КОНТЕЙНЕР C
	КАЛЕНДАРЕМ, СОЗДАЕМ ПОЛЕ 
------------------------------------*/
		var container = document.getElementById ('view-container');
		container.innerHTML = '';

		myField = document.createElement('table');
		container.appendChild(myField);

		var tbody = document.createElement('tbody');
		myField.appendChild(tbody);
/*-----------------------------------
	СОЗДАЕМ СТРОКИ
------------------------------------*/	
		for (var i = 0; i < 2; i++) {
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
/*-----------------------------------
	СОЗДАЕМ СЛОЛБЦЫ КАЖДОЙ СТРОКИ
------------------------------------*/
			for (var j = 0; j < 7; j++) {
/*-----------------------------------
	ПЕРВАЯ СТРОКА - ДНИ НЕДЕЛИ ИЗ МОДЕЛИ
------------------------------------*/	
				var td = document.createElement('td');
				tr.appendChild(td);
				if ( i == 0 ) {	
					tr.className = 'dayName';		
					td.innerHTML = myModel.dayName[j];
				}
/*-----------------------------------
	ОСТАЛЬНЫЕ СТРОКИ - ЧИСЛА + МЕСЯЦ
------------------------------------*/				
				else {
					var div = document.createElement('div');
					td.appendChild(div);
					 td.className = 'week'
					td.id = j;
				}
			}
		}
/*-----------------------------------
	ФУНКЦИЯ РАСЧЕТА ДНЯ НЕДЕЛИ
------------------------------------*/
		if (curDay<0) {curDay=1}
		weekDay = new Date(curYear, curMonth, curDay-1).getDay(); 	// -------  день недели 

		var cell = 0;
		for (var i = weekDay; i>=0; i--) {
			var el = $('#'+ cell );
			//---- если число месяца -1, 
			if (curDay-i>0){
				el.text(curDay-i);
				// --- если дата в ячейке совпадает с сегодняшней датой,то красим ячейку
				if ( el.text() == new Date().getDate() & curMonth == myModel.nowDate.getMonth() & curYear == myModel.nowDate.getFullYear() ) {
					el[0].className = "now-date"
				}
				// ---- для каждой ячейки определеяе свойство data-date 
				el.each(function(index, elem) {
					elem.dataset.date = curDay-i + '/'+ curMonth + '/'+ curYear;
					// --- заполняем ячейку событием, если таковое имеется
					var ul = document.createElement('ul');
					elem.appendChild(ul);
					if (elem.dataset.date in myModel.eventHash) {
						for (let i =0; i< myModel.eventHash[elem.dataset.date].length; i++) {
						self.createEvent(myModel.eventHash[elem.dataset.date][i], elem)
						}
					}
				});
			}
			cell++;
		}
		for (var i = 1; i<7; i++) {
			if (curDay +i<= myModel.totalDays) {
				$('#'+ cell ).text(curDay+i);
				$('#'+ cell ).each(function(index, elem) {
					elem.dataset.date = curDay-i + '/'+ curMonth + '/'+ curYear;
					// --- заполняем ячейку событием, если таковое имеется
					var ul = document.createElement('ul');
					elem.appendChild(ul);
					if (elem.dataset.date in myModel.eventHash) {
						for (let i =0; i< myModel.eventHash[elem.dataset.date].length; i++) {
						self.createEvent(myModel.eventHash[elem.dataset.date][i], elem)
						}
					}
				});
				cell++;
			}
		}
	}
	self.hideEvent = function(td) {
		var show = document.createElement('button');
		show.className = "show";
		show.innerHTML = '...' 
		td.appendChild(show);
	}
	self.createEvent = function(event,el){
		var td = el;
		var ol = document.createElement('ol');
			ol.innerHTML = event;
			ol.className = 'event';
			$(td).find('ul').each(function(index, el) {
				el.appendChild(ol)
			}).end().find('ol:gt(18)').hide(); 
			if ($(td).find('ol').length>19 & !($(td).find('.show').is('.show'))) {
				self.hideEvent(td)
			}
	}
	this.createEventMenu = function(title, ev,posClickX,posClickY){
		var popup = document.createElement('div');
		var popupBack = document.createElement('div');
		popup.id = 'eventList';
		popupBack.id = 'eventListBack';
		popup.style.left = posClickX +'px';
		popup.style.top = posClickY + 'px';
		document.body.appendChild(popupBack);
		popupBack.appendChild(popup);
		
		var dataTitle = document.createElement('div');
		dataTitle.innerHTML = title;
		dataTitle.id = 'dataTittle';
		popup.appendChild(dataTitle);
		var ul = document.createElement('ul');
		popup.appendChild(ul);
		ev.each(function(index, el) {
			el.style.display = 'block';
		});
		$(ul).append(ev);
	}
}
  /*===================================================================================*/
 /*                   				   V I E W  - Day								  */
/*===================================================================================*/
function dayView() {
	var self = this;
	var myModel = null;
	var myField = null;

	var curDay = null;
	var curMonth = null;
	var curYear = null;

/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
	};
/*-----------------------------------
	МЕТОД ПОСТРОЕНИЯ КАЛЕНДАРЯ (Неделя)
-----------------------------------*/
	this.update = function (_year, _month, _day) {
		curYear = _year;
		curMonth =  _month;
		curDay = _day;
/*-----------------------------------
	ЗАПИСЫВАЕМ ДАТУ В ШАПКЕ КАЛЕНДАРЯ
------------------------------------*/	
		var date = document.getElementById ('month-date');
		var text =  myModel.titleDate;
		date.innerHTML = text;
/*-----------------------------------
	НАХОДИМ И ОБНУЛЯЕМ КОНТЕЙНЕР C
	КАЛЕНДАРЕМ, СОЗДАЕМ ПОЛЕ 
------------------------------------*/
		var container = document.getElementById ('view-container');
		container.innerHTML = '';

		myField = document.createElement('table');
		container.appendChild(myField);

		var tbody = document.createElement('tbody');
		myField.appendChild(tbody);
/*-----------------------------------
	СОЗДАЕМ ЯЧЕЙКИ КАЛЕНДАРЯ
		day   - числа дней месяца
		index - количество ячеек в месяца, 
				включая пустые
------------------------------------*/
		for (var i = 0; i <= 1; i++) {
			var tr = document.createElement('tr');
			tbody.appendChild(tr);
			var weekDay = new Date(curYear, curMonth, curDay-1).getDay();
			// ---- строим дни недели
			if ( i == 0 ) {		
				tr.className = 'dayName';	
				var td = document.createElement('td');
				tr.appendChild(td);
				td.innerHTML = myModel.dayName[weekDay];
			}
			else {
				var td = document.createElement('td');
				tr.appendChild(td);
				td.className = 'numb-day';
				td.innerHTML = curDay;
				//--- заносим дату в свойство элемента 'data-date' 
				td.dataset.date = curDay + '/'+ curMonth + '/'+ curYear;
				var ul = document.createElement('ul');
						td.appendChild(ul);
				//---- если в базе user'а есть событие с таким именем то создаем элемент
				if (td.dataset.date in myModel.eventHash) {
					for (let i =0; i< myModel.eventHash[td.dataset.date].length; i++) {
						self.createEvent(myModel.eventHash[td.dataset.date][i], td)
					}
				}
       		}
		}		
	}
	self.hideEvent = function(td) {
		var show = document.createElement('button');
		show.className = "show";
		show.innerHTML = '...' 
		td.appendChild(show);
	}
	self.createEvent = function(event,el){
		var td = el;
		var ol = document.createElement('ol');
			ol.innerHTML = event;
			ol.className = 'event';
			$(td).find('ul').each(function(index, el) {
				el.appendChild(ol)
			}).end().find('ol:gt(18)').hide(); 
			if ($(td).find('ol').length>19 & !($(td).find('.show').is('.show'))) {
				self.hideEvent(td)
			}
	}
	this.createEventMenu = function(title, ev,posClickX,posClickY){
		var popup = document.createElement('div');
		var popupBack = document.createElement('div');
		popup.id = 'eventList';
		popupBack.id = 'eventListBack';
		popup.style.left = posClickX +'px';
		popup.style.top = posClickY + 'px';
		document.body.appendChild(popupBack);
		popupBack.appendChild(popup);
		
		var dataTitle = document.createElement('div');
		dataTitle.innerHTML = title;
		dataTitle.id = 'dataTittle';
		popup.appendChild(dataTitle);
		var ul = document.createElement('ul');
		popup.appendChild(ul);
		ev.each(function(index, el) {
		el.style.display = 'block';
		});
		$(ul).append(ev);
	}
}
  /*===================================================================================*/
 /*                   			  C O N T R O L L E R 								  */
/*===================================================================================*/
function CalendarController() {
	var self = this;
	var myModel = null;
	var calendarEvent = null;

	var buttonBack = null;
	var buttonNext = null;
	var buttonNowDate = null;
	var buttonMonth = null;
	var buttonWeek = null;
	var buttonDay = null;

	var td = null;
	var show = null;
	var eventList = null;	
	var hash = location.hash

	self.init = function (model) {
		myModel=model;
 		calendarEvent = new CalendarEvent(myModel);


		window.onhashchange = function () {
			hash = location.hash
		switch (hash) {
			case '#autorize':
			sessionStorage.clear()
			window.location = 'index.html'
			var AutorizeMdl = new modelAutorize();
			break;
			case '#month':
				self.setMonth()
		 		break;
	 		case '#week':
	 			self.setWeek();
	 			break;
		 	case '#day':
		 		self.setDay();
		 		break;
		}
	}
		buttonBack = document.getElementById('back-but');
		buttonBack.addEventListener('click',self.back);

		buttonNext = document.getElementById('next-but');
		buttonNext.addEventListener('click',self.next);

		buttonNowDate = document.getElementById('today');
		buttonNowDate.addEventListener('click',self.nowDate);

		buttonMonth = document.getElementById('month-button');
		buttonMonth.addEventListener('click',self.setMonth);
		
		buttonWeek = document.getElementById('week-button');
		buttonWeek.addEventListener('click',self.setWeek);

		buttonDay = document.getElementById('day-button');
		buttonDay.addEventListener('click',self.setDay);

// Для каждого td устанавливаем события на клик по нему
		$('td').each(function(index, el) {
			el.addEventListener('click', self.newEv);
		});

		initShow()
    }
	function initShow() {
		$('.show').each(function(index, el) {
			el.addEventListener('click', self.showEvent);
			});
		$('td').each(function(index, el) {
			el.addEventListener('click', self.newEv);
		});
	}
	self.showEvent = function(EO) {
		var el = EO.target;
		myModel.createEventMenu(EO);
		eventList = document.getElementById('eventListBack');
		eventList.addEventListener('click', self.hideEvent);
	}	
	self.hideEvent = function() {
		$(eventList).detach();
		myModel.updateView(null);
		initShow()
	}

    self.newEv = function(EO) {
    	var el = EO.target;
    	calendarEvent.createEvent(el);
    	initShow()
    }
   	self.setMonth = function() {
   		window.location.hash = 'month';
   		myModel.updateView('month');
		initShow();
		
	}
	self.setWeek = function() {
		window.location.hash = 'week';
		myModel.updateView('week');
		initShow();
		
	}
	self.setDay = function() {
		window.location.hash = 'day';
		myModel.updateView('day');
		initShow();
	}

//--------- MONTH
	self.back = function() {
		myModel.updateModel(-1);
		initShow()
		}
    self.next = function() {
    	myModel.updateModel(+1);
    	initShow()
	}
	self.nowDate = function () {
		myModel.updateModel(null);
		initShow()
	}
//---------- WEEK
	self.backWeek = function() {
		myModel.updateModel(-7) 
	}
    self.nextWeek = function() {
    	myModel.updateModel(+7) 
	}
	self.nowWeek = function () {
		myModel.updateModel(null);
	}
	self.update = function (name) {
		self.removeEvent();

		$('td').each(function(index, el) {
			el.addEventListener('click', self.newEv);
		});

		if (name == 'month' || name == null || name == 'day') {
		
			buttonBack.addEventListener('click',self.backMonth);
			buttonNext.addEventListener('click',self.nextMoth);
			buttonNowDate.addEventListener('click',self.nowDate);
		}
		else if (name == 'week') {
			buttonBack.addEventListener('click',self.backWeek);
			buttonNext.addEventListener('click',self.nextWeek);
			buttonNowDate.addEventListener('click',self.nowWeek);
		}
	}
 	self.removeEvent = function () {
		buttonBack.removeEventListener('click',self.backMonth);
		buttonNext.removeEventListener('click',self.nextMoth);
		buttonNowDate.removeEventListener('click',self.nowDate);

		buttonBack.removeEventListener('click',self.backWeek);
		buttonNext.removeEventListener('click',self.nextWeek);
		buttonNowDate.removeEventListener('click',self.nowWeek);
	}
}
	
  /*===================================================================================*/
 /*                   					E V E N T 									  */
/*===================================================================================*/
function CalendarEvent(model) {
	var eventHash = {};
	var event = null;
	var myModel = model;
	var self = this;
	var element = null;

	self.createEvent = function (el) {
		myModel.createEvent(el);

	}
}

