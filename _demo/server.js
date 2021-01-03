//Конфигурация (глобальная)
myConfig = {};
//Конфигурация сервера
myConfig.server = {
	port		: 2020,
	isDebug		: true,		//Сообшения сервера
};
//Подключение модуля
var output = require('../index.js')({
	dir 		: './',		//Папка отображений
	clear 		: true,		//Очищать код от комментариев
	isDebug		: false,	//Режим отладки					
});

var controller = function (req, res) {
	var url = req.url.split('/');
	
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
		output.view({
			text	: 'Hello, World!', 
		})
	);
*/
	res.write(
		output.view({
			//Название файла
			file	: '/test.php', 
			//Переменные
			data	: {
				$test	: url[1],
				$title 	: 'Тесты',
				$rows 	: rows,
				width_10: function(str) {
					var count = 10;
					return (new Array( count ).join(' ') + str).substr(-count).replace(/ /g, '&nbsp;');
				}
			},
		})
	);
	
	res.end();
	
}
//Формируем задачу
var app = function(req, res) {
	var url = req.url.split('/');

	//Заглушка запроса favicon.ico
	if (url[1]=='favicon.ico') return;

	//Установим метку времени
	if (myConfig.server.isDebug) {
		console.log('\nПолучен запрос req.url', req.url);
		console.time('app');
	}
	
	//Вызываем контроллер обработки запроса	
	controller(req, res);
	
	//Выводим общее время
	if (myConfig.server.isDebug) console.timeEnd('app');
};
//Создаем и запускаем сервер для задачи
var server = require('http').createServer(app);
server.listen(myConfig.server.port);
//Отображаем информацию о старте сервера
if (myConfig.server.isDebug) console.log('Server start on port ' + myConfig.server.port + ' ...');
