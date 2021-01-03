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
```
## Пример кода отображения (файл _demo/test.php)
```HTML+PHP
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <title><?=$title?></title>
        <style>
			body {
				font-family:'Lucida Console', Monaco, monospace
			}
			/*Жирный шрифт. Пример комментария*/
			.bold {
				font-weight:bold
			}
			.red {
				color:red
			}
			.green {
				color:green
			}
			.blue {
				color:blue
			}
			.tab::before {
				content: "\00A0\00A0\00A0\00A0";
			}
			/*Серый шрифт. Пример комментария*/
			.no_active {
				color:lightgray;
				text-decoration:line-through;
			}
		</style>
    </head>
    
    <body>
    	<?php if ($test==1): ?>
            <div><a href="/">На главную</a></div>
            <br />
            <h2>Цикл foreach...endforeach</h2>

            <h4>Пример кода:</h4>
            <div class="bold red">&lt;?</div>
            	<div class="tab"><span class="blue">$row=</span>{key1:<span class="red">1</span>, key2:<span class="red">'text1'</span>, key3:<span class="red">2</span>, key4:<span class="red">'text2'</span>};</div>	
            <div class="bold red">?&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">foreach</span> (<span class="blue">$row</span> <span class="green">as</span> <span class="blue">$key=>$value</span>): <span class="bold red">?&gt;</span></div>
            	<div class="tab">&lt;div&gt;$key=<span class="bold red">&lt;?=</span><span class="blue">$key</span><span class="bold red">?&gt;</span> $value=<span class="bold red">&lt;?=</span><span class="blue">$value</span><span class="bold red">?&gt;</span>&lt;/div&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">endforeach</span>; <span class="bold red">?&gt;</span></div>
            
            <h4>Результат:</h4>
            <?
				$row={key1:1, key2:'text1', key3:2, key4:'text2'};
			?>
            <?php foreach($row as $key=>$value): ?>
            	<div>$key=<?=$key?> $value=<?=$value?></div>
            <?php endforeach; ?>
    	<?php elseif ($test==2): ?>
            <div><a href="/">На главную</a></div>
            <br />
            <h2>Цикл while...endwhile</h2>
            
            <h4>Пример кода:</h4>
            <div class="bold red">&lt;?</div>
            	<div class="tab"><span class="blue">$i=</span><span class="red">10</span>;</div>	
            <div class="bold red">?&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">while </span>(<span class="blue">$i&gt;</span><span class="red">3</span>): <span class="bold red">?&gt;</span></div>
            	<div class="tab">&lt;div&gt;$i=<span class="bold red">&lt;?=</span><span class="blue">$i</span><span class="bold red">?&gt;</span>&lt;/div&gt;</div>
            	<div class="tab bold red">&lt;?</div>
            		<div class="tab"><span class="tab blue">$i--</span>;</div>	
            	<div class="tab bold red">?&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">endwhile</span>; <span class="bold red">?&gt;</span></div>
            
            <h4>Результат:</h4>
            <?
				$i=10;
			?>
            <?php while ($i>3): ?>
            	<div>$i=<?=$i?></div>
                <?
					$i--;
				?>
            <?php endwhile; ?>
    	<?php elseif ($test==3): ?>
            <div><a href="/">На главную</a></div>
            <br />
            <h2>Цикл for...endfor</h2>

            <h4>Пример кода:</h4>
            <div><span class="bold red">&lt;?php</span> <span class="green">for </span>(<span class="blue">$i=</span><span class="red">0</span>; <span class="blue">$i&lt;</span><span class="red">10</span>; <span class="blue">$i++</span>): <span class="bold red">?&gt;</span></div>
            	<div class="tab">&lt;div&gt;$i=<span class="bold red">&lt;?=</span><span class="blue">$i</span><span class="bold red">?&gt;</span>&lt;/div&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">endfor</span>; <span class="bold red">?&gt;</span></div>
            
            <h4>Результат:</h4>
            <?php for($i=0; $i<10; $i++): ?>
            	<div>$i=<?=$i?></div>
            <?php endfor; ?>
			<br />
            
            <h4>Пример кода:</h4>
            <div><span class="bold red">&lt;?php</span> <span class="green">for </span>(<span class="blue">$i=</span><span class="red">0</span>; <span class="blue">$i&lt;</span><span class="red">10</span>; <span class="blue">$i=$i+</span><span class="red">2</span>): <span class="bold red">?&gt;</span></div>
            	<div class="tab">&lt;div&gt;$i=<span class="bold red">&lt;?=</span><span class="blue">$i</span><span class="bold red">?&gt;</span>&lt;/div&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">endfor</span>; <span class="bold red">?&gt;</span></div>

            <h4>Результат:</h4>
            <?php for($i=0; $i<10; $i=$i+2): ?>
            	<div>$i=<?=$i?></div>
            <?php endfor; ?>
			<br />
            
            <h4>Пример кода:</h4>
            <div><span class="bold red">&lt;?php</span> <span class="green">for </span>(<span class="blue">$i=</span><span class="red">10</span>; <span class="blue">$i&gt;</span><span class="red">0</span>; <span class="blue">$i--</span>): <span class="bold red">?&gt;</span></div>
            	<div class="tab">&lt;div&gt;$i=<span class="bold red">&lt;?=</span><span class="blue">$i</span><span class="bold red">?&gt;</span>&lt;/div&gt;</div>
            <div><span class="bold red">&lt;?php</span> <span class="green">endfor</span>; <span class="bold red">?&gt;</span></div>

            <h4>Результат:</h4>
            <?php for($i=10; $i>0; $i--): ?>
            	<div>$i=<?=$i?></div>
            <?php endfor; ?>
    	<?php elseif ($test==4): ?>
            <div><a href="/">На главную</a></div>
            <br />
            <h2>Условие if...elseif...endif</h2>
            <h4>Пример кода:</h4>
            <div><span class="bold red">&lt;?php</span> <span class="green">for </span>(<span class="blue">$i=</span><span class="red">0</span>; <span class="blue">$i&lt;</span><span class="red">10</span>; <span class="blue">$i++</span>): <span class="bold red">?&gt;</span></div>
            	<div class="tab"><span class="bold red">&lt;?php</span> <span class="green">if </span>(<span class="blue">$i==</span><span class="red">0</span>): <span class="bold red">?&gt;</span></div>
            		<div class="tab"><span class="tab">&lt;div&gt;$i=0 Первая строка&lt;/div&gt;</span></div>
            	<div class="tab"><span class="bold red">&lt;?php</span> <span class="green">elseif </span>(<span class="blue">$i&gt;</span><span class="red">0</span> <span class="blue">&&</span> <span class="blue">$i&lt;</span><span class="red">5</span>): <span class="bold red">?&gt;</span></div>
            		<div class="tab"><span class="tab"></span>&lt;div&gt;$i=<span class="bold red">&lt;?=</span><span class="blue">$i</span><span class="bold red">?&gt;</span> Cтрока диапазона 1...4&lt;/div&gt;</div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">if </span>(<span class="blue">$i==</span><span class="red">2</span>): <span class="bold red">?&gt;</span></div>
            			<div class="tab"><span class="tab"></span><span class="tab">&lt;div&gt;...точнее строка 2&lt;/div&gt;</span></div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">elseif </span>(<span class="blue">$i==</span><span class="red">4</span>): <span class="bold red">?&gt;</span></div>
            			<div class="tab"><span class="tab"></span><span class="tab">&lt;div&gt;...точнее строка 4&lt;/div&gt;</span></div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">else</span>: <span class="bold red">?&gt;</span></div>
            			<div class="tab"><span class="tab"></span><span class="tab">&lt;div&gt;...точнее строка 1 или 3&lt;/div&gt;</span></div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">endif</span>; <span class="bold red">?&gt;</span></div>
            	<div class="tab"><span class="bold red">&lt;?php</span> <span class="green">elseif </span>(<span class="blue">$i==</span><span class="red">9</span>): <span class="bold red">?&gt;</span></div>
            		<div class="tab"><span class="tab">&lt;div&gt;$i=9 Последняя строка&lt;/div&gt;</span></div>
                <div class="tab"><span class="bold red">&lt;?php</span> <span class="green">else</span>: <span class="bold red">?&gt;</span></div>
            		<div class="tab"><span class="tab"></span>&lt;div&gt;$i=<span class="bold red">&lt;?=</span><span class="blue">$i</span><span class="bold red">?&gt;</span> Cтрока диапазона 5...8&lt;/div&gt;</div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">if </span>(<span class="blue">$i==</span><span class="red">5</span>): <span class="bold red">?&gt;</span></div>
            			<div class="tab"><span class="tab"></span><span class="tab">&lt;div&gt;...точнее строка 5&lt;/div&gt;</span></div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">elseif </span>(<span class="blue">$i==</span><span class="red">7</span>): <span class="bold red">?&gt;</span></div>
            			<div class="tab"><span class="tab"></span><span class="tab">&lt;div&gt;...точнее строка 7&lt;/div&gt;</span></div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">else</span>: <span class="bold red">?&gt;</span></div>
            			<div class="tab"><span class="tab"></span><span class="tab">&lt;div&gt;...точнее строка 6 или 8&lt;/div&gt;</span></div>
            		<div class="tab"><span class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">endif</span>; <span class="bold red">?&gt;</span></div>
           		<div class="tab"></span><span class="bold red">&lt;?php</span> <span class="green">endif</span>; <span class="bold red">?&gt;</span></div>
            <div><span class="bold red">&lt;?php</span> <span class="green">endfor</span>; <span class="bold red">?&gt;</span></div>
			<br />
            <h4>Результат:</h4>
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
    	<?php elseif ($test==5): ?>
            <div><a href="/">На главную</a></div>
            <br />
            <h2>Пример вывода строк из БД</h2>
            <!--Заголовок-->
            <div class="bold"><?='Привет, Мир!'?></div>
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
        <?php else: ?>
        	<h2>Выберите тест</h2>
            <!--Выбор теста-->
            <div><a href="/1">Демонстрация операторов цикла foreach...endforeach</a></div>
            <div><a href="/2">Демонстрация операторов цикла while...endwhile</a></div>
            <div><a href="/3">Демонстрация операторов цикла for...endfor</a></div>
            <div><a href="/4">Демонстрация условных операторов if...elseif...else...endif</a></div>
            <div><a href="/5">Демонстрация "передачи" объекта и функции в отображение</a></div>
        <?php endif; ?>
    </body>
</html>
<script>
	/*Комментарий*/
	var a1 = 1; //Комментарий
	var a2 = 'http://test.ru'; //Комментарий
</script>
```
## Примеры формирования кода

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

## Запуск тестов
```
node server
```
## Результат
```
http://localhost:2020
```
