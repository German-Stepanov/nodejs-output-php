//Устанавливаем конфигурацию
myConfig = {};
//Конфигурация пользователя (глобальная)
myConfig.data = {
	port		: 2011,
	isDebug		: true,		//Сообшения сервера
};
//Конфигурация модуля Output
myConfig.output = {
	//Папка отображений
	dir 		: require('path').dirname(require.main.filename),
	//Очищать код		
	clear 		: true,
	//Режим отладки
	isDebug		: false,						
};

var output = require('output')(myConfig.output);
//Подключаем нативный модуль http
var http = require('http');
//Формируем задачу
var app = function(req, res) {
	if (myConfig.data.isDebug) {
		console.log('\nПолучен запрос req.url', req.url);
		console.time('app');//Установим метку времени
	}
	req.output = output;

	var rows = 
	[
		{user_id: 11, user_name:'Андрей', 	user_family:'Иванов', 	user_active:1},
		{user_id: 121, user_name:'Петр', 	user_family:'Петров', 	user_active:1},
		{user_id: 13, user_name:'Алексей',	user_family:'Сидоров', 	user_active:1},
		{user_id: 142, user_name:'Сергей', 	user_family:'Алексеев', user_active:1},
		{user_id: 15, user_name:'Герман', 	user_family:'Степанов', user_active:0},
	];

	res.writeHead(200, {'Content-Type': 'text/html; charset=utf-8'});
/*	
	res.write(
		req.output({
			text	: 'Hello, World!', 
		})
	);
*/
	res.write(
		req.output({
			//Название файла
			file	: '/test.php', 
			//Переменные
			data	: {
				$title 	: 'Список участников:',
				$rows 	: rows,
				width_10: function(str) {
					var count = 10;
					return (new Array( count ).join(' ') + str).substr(-count).replace(/ /g, '&nbsp;');
				}
			},
		})
	);
	
	res.end();
	
	if (myConfig.data.isDebug) {
		console.timeEnd('app');
	}
};
//Создаем сервер для задачи
var server = http.createServer(app);
//Запускаем сервер
server.listen(myConfig.data.port);
//Отображаем информацию о старте сервера
if (myConfig.data.isDebug) console.log('Server start on port ' + myConfig.data.port + ' ...');
