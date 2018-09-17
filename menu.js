$(document).ready(function($) {
	var field = document.getElementById('calendar-box');
var html = '<div id="header"> <div class="menu">' + 
			'<div class="left-buttons">' +
				'<button type="button" id="back-but" title="Назад" class = "back-button"><span class="icon-before"></span></button>' +
				'<button type="button" id="next-but" title="Далее" class = "next-button"><span class="icon-after"></span></button>'+
				'<button type="button" id="today" title="Текущий месяц">Сегодня</button>'+
			'</div>'+
				'<div class="center-date">'+
				'<h2 id="month-date"></h2>'+
				
			'</div>'+
			'<div id="user"> </div>'+
			'<div class="right-buttons">'+
				'<button type="button" title="Показать весь месяц" id = "month-button">Весь месяц</button>'+
				'<button type="button" title="Показать текущую неделю" id = "week-button">Неделя</button>'+
				'<button type="button" title="Показать день" id = "day-button">День</button>'+
			'</div>'+
		'</div>'+
	'</div><div id="view-container"></div>';

field.innerHTML = html
});