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
            <h2>Демонстрация операторов цикла foreach...endforeach</h2>

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
            <h2>Демонстрация операторов цикла while...endwhile</h2>
            
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
            <h2>Демонстрация операторов цикла for...endfor</h2>

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
            <h2>Демонстрация условных операторов if...elseif...else...endif</h2>
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
            <h2>Демонстрация "передачи" объекта и функции в отображение</h2>
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
	/*Пример комментария*/
	var a1 = 1; //Пример комментария
	var a2 = 'http://test.ru'; //Пример комментария
</script>