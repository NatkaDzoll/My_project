jQuery.validator.setDefaults({
  debug: true,
  success: "valid"
});

  /*===================================================================================*/
 /*                   					 M O D E L 				    				  */
/*===================================================================================*/
function modelAutorize() {
	var myView = null;
	this.user = {
		name: null,
		event: {}
	};

/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ MODEL
-----------------------------------*/
	this.init = function (view) {
		myView = view;
		window.location.hash = 'autorize';
	};
/*-----------------------------------
	МЕТОД LOG IN user
-----------------------------------*/	
	this.loginUser = function (_user){
		var user = _user;
		
		if (user.name in localStorage) {

			var localPass = JSON.parse(localStorage[user.name]).password;

			if (user.password == localPass){
				alert('Добро пожаловать в календарь!')
				sessionStorage.setItem('whoLogin', user.name);
				console.log('Вы вошли в календарь');
				myView.updateView();
			}
			
			else if (user.password != localStorage[user.name].password){
				alert ("Проверьте имя пользователя и пароль")
			}
		}
		else {
			alert('Такого пользвателя не существует. Зарегистрируйтесь!')
		}
	}

/*-----------------------------------
	МЕТОД REGISTRATED user
-----------------------------------*/
	this.addUser = function (_user){
		var user = _user;
		var userJSON = JSON.stringify(user);
		localStorage.setItem(user['name'], userJSON);
		alert ('Регистрация прошла успешно. Войдите')
	}

	var View = new viewAutorize();
	View.init(this);
	var Controller = new controllerAutorize();
		Controller.init(this,myView);
}
  /*===================================================================================*/
 /*                   					V I E W 									  */
/*===================================================================================*/
function viewAutorize() {
	var myModel = null;
	var formBox = null;
	var calendar = null;
	var autBox = null; 

	var userName = null;
	var password = null;

/*-----------------------------------
	МЕТОД ИНИЦИАЛИЗАЦИИ VIEW
-----------------------------------*/
	this.init = function (model) {
		myModel = model;
		myModel.init(this);
		
		$('#calendar-box').hide();

		autBox =  document.createElement('div');
		autBox.id = 'autBox';
		document.body.appendChild(autBox);

		var header = document.createElement('div');
		header.id = 'aut-header';
		autBox.appendChild(header);

		var headerText = document.createElement('div');
		headerText.id = 'aut-header-text';
		headerText.innerHTML = 'MyCalendar';
		header.appendChild(headerText);

		formBox = document.createElement('div');
		formBox.id = 'form-box';
		autBox.appendChild(formBox);

		var formTitile = document.createElement('div');
		formTitile.id = 'form-title';
		formTitile.innerHTML = 'Авторизация';
		formBox.appendChild(formTitile);

		var formBody= document.createElement('div');
		formBody.id = 'form-body';
		formBox.appendChild(formBody);

		var form = document.createElement('form');
		form.id = 'aut-form';
		form.name = 'autoriz-form';
		form.className = 'autorize';
		formBody.appendChild(form);
		
//------
		//var errorBox = document.createElement('div');

		var namefield = document.createElement('div');
		namefield.className = 'autorize-row';
		form.appendChild(namefield);

		var label = document.createElement('label');
		label.innerHTML = 'Введите имя ';
		namefield.appendChild(label);

		var input = document.createElement('input');
		input.type = 'text';
		input.name = 'username';
		namefield.appendChild(input);

		var passwordfield = document.createElement('div');
		passwordfield.className = 'autorize-row';
		form.appendChild(passwordfield);

		var label = document.createElement('label');
		label.innerHTML = 'Введите пароль';
		passwordfield.appendChild(label);

		var input = document.createElement('input');
		input.type = 'password';
		input.name= 'password';
		passwordfield.appendChild(input);
/*
		var reapPasswordfield = document.createElement('div');
		reapPasswordfield.className = 'autorize-row';
		myField.appendChild(reapPasswordfield);

		var label = document.createElement('label');
		label.innerHTML = 'Повторите пароль ';
		reapPasswordfield.appendChild(label);

		var input = document.createElement('input');
		input.style.type = 'text';
		reapPasswordfield.appendChild(input);
*/
		var submit = document.createElement('div');
		submit.className = 'submit-box';
		form.appendChild(submit);
		
		var button = document.createElement('button');
		button.className = 'autorize-button';
		button.id = 'submit-button';
		submit.appendChild(button);

		var textButton = document.createElement('span');
		textButton.innerHTML = 'Войти';
		button.appendChild(textButton);

		var button = document.createElement('button');
		button.className = 'autorize-button';
		button.id = 'reg-button';
		submit.appendChild(button);
		
		var textButton = document.createElement('span');
		textButton.innerHTML = 'Зарегистрироваться';
		button.appendChild(textButton);

		
		$('form').validate ({
			rules: {
				username: {required: true, minlength:3 },
				password: {required: true,  minlength:3 }
			},
			
			messages: {
				username: {required: 'Введите имя пользователя',
							minlength: 'Введите не менее 3 символов'},

				password: {required: 'Введите пароль',
							minlength: 'Введите не менее 3 символов'}
			}
		});
	};
//--------------------- вынести в ммодель PAGE
	this.updateView = function(){
		$('#autBox').hide();
		$('#calendar-box').show();
		var calendar = new monthModel();
		window.location.hash = 'month'		
	}
}
  /*===================================================================================*/
 /*                   			  C O N T R O L L E R 								  */
/*===================================================================================*/
function controllerAutorize() {
	
	var myModel = null;
	var myView = null;
	var frm = null;
	var buttonSubmit = null;
	var buttonReg = null;
	var self = this;
	
	this.init = function (model,view) {
		frm = document.forms['autoriz-form'];
		myModel = model;
		myView = view;
		buttonSubmit = document.getElementById('submit-button');
		buttonSubmit.addEventListener('click',this.loginUser);

		buttonReg = document.getElementById('reg-button');
		buttonReg.addEventListener('click',this.registered);

	}
	this.loginUser = function () {
		
		if (!$(frm).valid()){
			alert('Заполните все поля в соответствии с правилами')
		}
		else {
			var user = {
			name: frm.elements[0].value,
			password: frm.elements[1].value
		}
		myModel.loginUser(user);
		}
	}
	this.registered = function () {
		
		if (!$(frm).valid()){
			alert('Заполните все поля в соответствии с правилами')
		}
		else {
			var user = {
			name: frm.elements[0].value,
			password: frm.elements[1].value
		}
		myModel.addUser(user);
		}
		
	}

}
	
