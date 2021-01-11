# nodejs-output-view
Препроцессор шаблонов PHP для nodejs

Поддерживает передачу чисел, строк, объектов и функций в файл html(php), например
```JS
var rows = 
[
	{user_id: 11, user_name:'Андрей', 	user_family:'Иванов', 	user_active:1},
	{user_id: 121, user_name:'Петр', 	user_family:'Петров', 	user_active:1},
	{user_id: 13, user_name:'Алексей',	user_family:'Сидоров', 	user_active:1},
	{user_id: 142, user_name:'Сергей', 	user_family:'Алексеев', user_active:1},
	{user_id: 15, user_name:'Герман', 	user_family:'Степанов', user_active:0},
];
res.write(
	output.view({
		//Название файла
		file	: '/test.php', 
		//Переменные
		data	: {
			$count	: 100,
			$title 	: 'Тесты',
			$rows 	: rows,
			width_10: function(str) {
				var count = 10;
				return (new Array( count ).join(' ') + str).substr(-count).replace(/ /g, '&nbsp;');
			}
		},
	})
);
```
Поддерживает использование логических блоков if...elseif...else...endif, например
```HTML+PHP
<?php if($key>10): ?>
	...
<?php elseif($key<5): ?>
	...
<?php else: ?>
	...
<?php endif; ?>
```
Поддерживает использование логических блоков foreach...endforeach, например
```HTML+PHP
<?php foreach($rows as $key=>$value): ?>
	...
<?php endforeach; ?>
```
Поддерживает использование логических блоков for...endfor, например
```HTML+PHP
<?php for($i=0; $i<10; $i++): ?>
	...
<?php endfor; ?>
```
Поддерживает использование логических блоков while...endwhile, например
```HTML+PHP
<?php while($i<100): ?>
	...
	<?
		$i++;
	?>
<?php endfor; ?>
```
Поддерживает любые переменные и выражения на js, например
```HTML+PHP
<?=$название?>
...
<?=$переменная1 * переменная2?>
```
Поддерживает создание и использование переменных внутри кода HTML, например
```HTML+PHP
<?
	var $i=1;
?>
...
<?
	$i++;
?>

<?=$i?>
```
Очищает код от всех комментариев, пробелов и переносов строк (опционально)
Автоматически подсвечиваются php-тэги в любом текстовом редакторе
## Пример подключения (файл _demo/server.js)
```JS
//Конфигурация (глобальная)
myConfig = {};
//Конфигурация сервера
myConfig.server = {
	port		: 2020,
	isDebug		: true,		//Сообшения сервера
};
//Подключение модуля
var output = require('output-view')({
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
```
## Примеры формирования кода (файл _demo/test.php)
### Демонстрация операторов цикла foreach...endforeach
#### Код:
```HTML+PHP
<?
	$row={key1:1, key2:'text1', key3:2, key4:'text2'};
?>
<?php foreach($row as $key=>$value): ?>
	<div>$key=<?=$key?> $value=<?=$value?></div>
<?php endforeach; ?>
```
#### Формирует результат:
```HTML
$key=key1 $value=1
$key=key2 $value=text1
$key=key3 $value=2
$key=key4 $value=text2
```
### Демонстрация операторов цикла while...endwhile
#### Код:
```HTML+PHP
<?
	$i=10;
?>
<?php while ($i>3): ?>
	<div>$i=<?=$i?></div>
	<?
		$i--;
	?>
<?php endwhile; ?>
```
#### Формирует результат:
```HTML
$i=10
$i=9
$i=8
$i=7
$i=6
$i=5
$i=4
```
### Демонстрация операторов цикла for...endfor
#### Код:
```HTML+PHP
<?php for($i=0; $i<10; $i++): ?>
	<div>$i=<?=$i?></div>
<?php endfor; ?>
```
#### Формирует результат:
```
$i=0
$i=1
$i=2
$i=3
$i=4
$i=5
$i=6
$i=7
$i=8
$i=9
```
#### Код:
```HTML+PHP
<?php for($i=0; $i<10; $i=$i+2): ?>
	<div>$i=<?=$i?></div>
<?php endfor; ?>
```
#### Формирует результат:
```
$i=0
$i=2
$i=4
$i=6
$i=8
```
#### Код:
```HTML+PHP
<?php for($i=10; $i>0; $i--): ?>
	<div>$i=<?=$i?></div>
<?php endfor; ?>
```
#### Формирует результат:
```
$i=10
$i=9
$i=8
$i=7
$i=6
$i=5
$i=4
$i=3
$i=2
$i=1
```
### Демонстрация условных операторов if...elseif...else...endif
#### Код:
```HTML+PHP
<?php for($i=0; $i<10; $i++): ?>
	<?php if ($i==0): ?>
		<div>$i=0 Первая строка</div>
	<?php elseif ($i>0 && $i<5 ): ?>
		<div>$i=<?=$i?> Cтрока диапазона 1...4</div>
		<?php if ($i==2): ?>
			<div>...точнее строка 2</div>
		<?php elseif ($i==4 ): ?>
			<div>...точнее строка 4</div>
		<?php else: ?>
			<div>...точнее строка 1 или 3</div>
		<?php endif; ?>
	<?php elseif ($i==9): ?>
		<div>$i=9 Последняя строка</div>
	<?php else: ?>
		<div>$i=<?=$i?> Cтрока диапазона 5...8</div>
		<?php if ($i==5): ?>
			<div>...точнее строка 5</div>
		<?php elseif ($i==7 ): ?>
			<div>...точнее строка 7</div>
		<?php else: ?>
			<div>...точнее строка 6 или 8</div>
		<?php endif; ?>
	<?php endif; ?>
<?php endfor; ?>
```
#### Формирует результат
```
$i=0 Первая строка
$i=1 Cтрока диапазона 1...4
...точнее строка 1 или 3
$i=2 Cтрока диапазона 1...4
...точнее строка 2
$i=3 Cтрока диапазона 1...4
...точнее строка 1 или 3
$i=4 Cтрока диапазона 1...4
...точнее строка 4
$i=5 Cтрока диапазона 5...8
...точнее строка 5
$i=6 Cтрока диапазона 5...8
...точнее строка 6 или 8
$i=7 Cтрока диапазона 5...8
...точнее строка 7
$i=8 Cтрока диапазона 5...8
...точнее строка 6 или 8
$i=9 Последняя строка
```
### Демонстрация "передачи" объекта и функции в отображение
#### Код:
```HTML+PHP
<div><?='Привет, Мир!'?></div>
<br />
<div>Список участников:</div>
<!--Таблица-->
<div>----------------------------------</div>	
<div>|<?=width_10('ID')?>|<?=width_10('ИМЯ')?>|<?=width_10('ФАМИЛИЯ')?>|</div>
<div>----------------------------------</div>	
<?php foreach($rows as $key=>$row): ?>
	<div class="<?=$row['user_active'] ? '' : 'no_active'?>">|<?=width_10($row['user_id'])?>|<?=width_10($row['user_name'])?>|<?=width_10($row['user_family'])?>|</div>
<?php endforeach; ?>
<div>----------------------------------</div>	
```
#### Формирует результат
```
Привет, Мир!

Список участников:
----------------------------------
|        ID|       ИМЯ|   ФАМИЛИЯ|
----------------------------------
|        11|    Андрей|    Иванов|
|       121|      Петр|    Петров|
|        13|   Алексей|   Сидоров|
|       142|    Сергей|  Алексеев|
|        15|    Герман|  Степанов|
----------------------------------
```
## Тестирование
```
Пример серверного кода в папке "_demo".
```
### Запуск
```
node server
```
### Результат
```
http://localhost:2020
```
