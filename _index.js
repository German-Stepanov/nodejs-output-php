var Output = function (config) {
	//Текущий объект
	var self = this;

	//Формируем конфигурацию
	this.config = config || {};
	//Расположение папки отображений относительно папки node_modules
	this.config.dir 	= this.config.dir || './';	
	//Режим отладки
	this.config.isDebug  = this.config.isDebug==null ? false : Boolean (this.config.isDebug);
	//Очищать код
	this.config.clear = this.config.clear==null || config.isDebug ? false : Boolean (this.config.clear);

	//Коллекция регулярных выражений
	this.re = {
		html_php 		: /((?!<\?)[\s\S]+?)?(<\?[\s\S]*?\?>|$)/g,
		if				: /<\?(?:php)? +if *\(([\s\S]+?)\) *: *\?>$/,
		elseif			: /<\?(?:php)? +elseif *\(([\s\S]+?)\) *: *\?>$/,
		else			: /<\?(?:php)? +else *: *\?>$/,
		endif			: /<\?(?:php)? +endif[\s\S]*\?>$/,
		foreach			: /<\?(?:php)? +foreach *\( *([^ ]+?) +as +([^= ]+?) *=> *([^) ]+?) *\) *\: *\?>$/,
		endforeach		: /<\?(?:php)? +endforeach[\s\S]*\?>$/,
		for				: /<\?(?:php)? +for *\(([^;]+?);([^;]+?);([^)]+?)\) *\: *\?>$/,
		endfor			: /<\?(?:php)? +endfor[\s\S]*\?>$/,
		while			: /<\?(?:php)? +while *\(([\s\S]+?)\) *: *\?>$/,
		endwhile		: /<\?(?:php)? +endwhile[\s\S]*\?>$/,
		expression		: /(<\?)((?:php)?)(=?)([\s\S]*?)((?:\?>))$/,
		styles			: /(<style\s*(?:[^>]*?)>)([\s\S]*?)(<\/style>)/g,
		scripts			: /(<script\s*(?:[^>]*?)>)([\s\S]*?)(<\/script>)/g,
		comments_html 	: /<!--((?!<!--)[\s\S]*?)-->/g,
		comments_stars 	: /\/\*[\s\S]*?\*\//g,
		comments_slash 	: /(\/\/[^'"]+?)(?:\r|$)/g,
		spaces			: /\s+/g,
	};
	
	this.view = function (params) {
		//Параметры по-умолчанию
		params = params || {};
		params.file 	= params.file || '';
		params.text 	= params.text || '';
		params.data 	= params.data || {};

		//Проверяем существование
		if (params.file && !require('fs').existsSync(self.config.dir + params.file)) {
			console.error('ERROR OUTPUT: Не найден файл "' + self.config.dir + params.file + '"');
			return '';
		}
		
		//Первоначальный код
		var input 		= '';
		//Окончательный код
		var output 		= '';
		//Найденные блоки
		var blocks		= [];
		//Условия
		var conditions  = [];
		//Циклы
		var loops		= [];
		//Возвращает итоговое условие выполнения кода
		var total_conditions = function (conditions) {
			return (conditions.length==0) ? (true) : (eval(conditions.join(' && ')));
		};

		//Считывание файла или текста
		if (params.file) {
			try {
				input = require('fs').readFileSync(self.config.dir + params.file, 'utf8');
			} catch (e) {
				console.error('ERROR OUTPUT: Ошибка чтения файла "' + self.config.dir + params.file + '":', e.toString())
				return '';
			};
		} else {
			input = params.text + '';
		};

		//Определение пользовательских переменных
		var variable_names = Object.keys(params.data);
		for (var i in variable_names) {
			if (typeof(params.data[variable_names[i]])=='function') {
				//Определяем функцию
				var expression = 'var ' + variable_names[i] + ' = ' + params.data[variable_names[i]] + ';';
			} else {
				//Определяем переменную
				var expression = 'var ' + variable_names[i] + ' = ' + JSON.stringify(params.data[variable_names[i]]) + ';';
			};
			//Формируем переменную или функцию
			try {
				eval(expression);
			} catch (e) {
				console.error('ERROR OUTPUT: Ошибка назначения переменной в выражении "' + expression + '"', e.toString());
				return '';
			};
		};

		if (this.config.isDebug) console.log('DEBUG OUTPUT:', 'Входные данные params.data', JSON.stringify(params.data, null, 4));
		if (this.config.isDebug) console.log('DEBUG OUTPUT: Формирование блоков...');

		if (input) {
			//Разбираем код на блоки
			
			//Извлекаем блок кода (с кодом html и php)
			var result = input.replace(self.re['html_php'], function (s, html, php) {
				//Если код не пустой
				if (html) {
					blocks.push({
						type	: 'html',
						html	: html,
					});
				};
				//Если код не пустой
				if (php) {	
				
					//Извлекаем из кода php "if"
					php = php.replace(self.re['if'], function (s, condition) {
						blocks.push ({
							type		: 'if',
							condition	: condition,
							level		: 1,
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем из кода php "elseif". Заменяем блоками else и if
					php = php.replace(self.re['elseif'], function (s, condition) {
						blocks.push ({
							type	: 'else',
						});
						//Поиск индекса ближайшего блока if
						var index = blocks.length-1;
						while (index>=0) {
							if (blocks[index].type=='if') break;
							index--;
						}
						blocks.push ({
							type		: 'if',
							condition	: condition,
							level		: blocks[index].level + 1,
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "else"
					php = php.replace(self.re['else'], function (s) {
						blocks.push ({
							type	: 'else',
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "endif"
					php = php.replace(self.re['endif'], function (s) {
						//Поиск индекса ближайшего блока if
						var index = blocks.length-1;
						while (index>=0) {
							if (blocks[index].type=='if' && blocks[index].level>0) {
								//Вставляем блоки endif нужное число раз
								for (var i=0; i<blocks[index].level; i++) {
									blocks.push ({
										type	: 'endif',
									})
								}
								blocks[index].level--;
								break;
							}
							index--;
						}
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "foreach"
					php = php.replace(self.re['foreach'], function (s, obj_name, key_name, value_name) {
						blocks.push ({
							type		: 'foreach',
							obj_name 	: obj_name,
							key_name	: key_name,
							value_name	: value_name,
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP

					//Извлекаем код "endforeach"
					php = php.replace(self.re['endforeach'], function (s) {
						blocks.push ({
							type		: 'endforeach',
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "for"
					php = php.replace(self.re['for'], function (s, first, limit, next) {
						blocks.push ({
							type	: 'for',
							first 	: first,
							limit	: limit,
							next	: next,
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "endfor"
					php = php.replace(self.re['endfor'], function (s) {
						blocks.push ({
							type	: 'endfor',
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "while"
					php = php.replace(self.re['while'], function (s, limit) {
						blocks.push ({
							type	: 'while',
							limit	: limit,
						})
						return '';//удаляем найденый код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "endwhile"
					php = php.replace(self.re['endwhile'], function (s) {
						blocks.push ({
							type	: 'endwhile',
						})
						return '';//удаляем код
					});
					if (!php) return ''; //удаляем код блока PHP
					
					//Извлекаем код "expression"
					php = php.replace(self.re['expression'], function (s, php_quote_left, php_php, php_equal, php_code, php_quote_right) {
						blocks.push({
							type		: 'expression',
							quote_left 	: php_quote_left,
							php 		: php_php,
							equal 		: php_equal=='=',
							code 		: php_code,
							quote_right : php_quote_right,
						});
						return ''; //удаляем найденый код
					});
					if (php){
						//Неизвестный код
						//Деактивируем теги PHP
						var html = php.replace(/<\?/g, '&lt;?').replace(/\?>/g, '?&gt;');
						//Добавление блоком
						blocks.push({
							type	: 'html',
							html	: html,
						});
						//Сообщение об ошибке
						var line = input.split(php).shift().split('\r\n').length;
						console.error('ERROR OUTPUT:', (params.file) ? ('Файл "' + params.file + '"') : (''), ': cтрока "' + line + '":', 'Не определен код "' + php + '"');
					}
					return '';//удаляем код
				};
				return ''; //удаляем код блока HTML и PHP
			});

			if (this.config.isDebug) {
				for (var i=0; i<blocks.length; i++) {
					var block = blocks[i];
					if (block.type=='html') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', block.html.replace(/\s+/g, ' '));
					} else if (block.type=='expression') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', '<?=' + block.code.replace(/\s+/g, ' ') + '?>');
					} else if (block.type=='foreach') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'FOREACH( ' + block.obj_name + ' as ' + block.key_name + '=>' + block.value_name + ' ):');
					} else if (block.type=='endforeach') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'ENDFOREACH;');
					} else if (block.type=='if') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'IF( ' + block.condition + ' ):');
					} else if (block.type=='else') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'ELSE:');
					} else if (block.type=='endif') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'ENDIF;');
					} else if (block.type=='for') {
						console.log('DEBUG OUTPUT: block[' + i + ']=','FOR( ' + block.first + '; ' + block.limit + '; ' + block.next + ' ):');
					} else if (block.type=='endfor') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'ENDFOR;');
					} else if (block.type=='while') {
						console.log('DEBUG OUTPUT: block[' + i + ']=','WHILE( ' + block.limit + ' ):');
					} else if (block.type=='endwhile') {
						console.log('DEBUG OUTPUT: block[' + i + ']=', 'ENDWHILE;');
					} else {
						console.log('DEBUG OUTPUT: block[' + i + ']=', JSON.stringify(block, null, 4));
					}
				}
			}
			
			//Перебор блоков (используем ТОЛЬКО цикл for для формирования переменных в пространстве окружения)
			if (this.config.isDebug) console.log('DEBUG OUTPUT: Перебор блоков...');
	
			for (var i=0; i<blocks.length; i++) {
				
				//if (this.config.isDebug) console.log('DEBUG OUTPUT: block[' + i + ']=', JSON.stringify(blocks[i], null, 4));
				
				try {
					switch (blocks[i].type) {
						case 'html':
							if (total_conditions(conditions)) {
								output += blocks[i].html;
							};
						break;
						
						case 'expression':
							if (total_conditions(conditions)) {
								//Выполняем выражение
								var result = eval(blocks[i].code);
								//Заменяем теги <?php ?> <? ?> или <?=?> значениями выражений
								output += (blocks[i].equal) ? (result) : ('');
							};
						break;
						
						case 'if':
							//Если все условия выполнены
							if (total_conditions(conditions)) {
								var condition = Boolean (eval(blocks[i].condition));
								conditions.push(condition);
							} else {
								conditions.push(false);
							}
						break;

						case 'else':
							if (conditions.length==0) throw 'Error: Неожиданное появление else';
							//Извлекаем последнее условие
							var condition = conditions.pop();
							//Если все условия выполнены, меняем на противоположное
							if (total_conditions(conditions)) {
								conditions.push(!condition);
							} else {
								conditions.push(false);
							}
						break;

						case 'endif':
							if (conditions.length==0) throw 'Error: Неожиданное появление endif';
							//Извлекаем последнее условие
							conditions.pop();
						break;

						case 'for':
						case 'while':
						case 'foreach':
							//Формируем новый loop
							if (blocks[i].type=='for') {
								var loop = {
									'type'	: 'for',
									'block' : i,
									'first' : 'var ' + blocks[i].first + ';',
									'limit'	: blocks[i].limit,
									'next' 	: blocks[i].next + ';',
								};
							} else if (blocks[i].type=='while') {
								var loop = {
									'type'	: 'while',
									'block'	: i,
									'first'	: '',
									'limit'	: blocks[i].limit,
									'next'	: '',
								};
							} else if (blocks[i].type=='foreach') {
								var loop = {
									'type'			: 'foreach',
									'block' 		: i,
									'first'			: 'var ' + blocks[i].key_name + '=Object.keys(' + blocks[i].obj_name + ')[0];' + 'var ' + blocks[i].value_name + '=' + blocks[i].obj_name + '[' + blocks[i].key_name + '];',
									'limit'			: blocks[i].key_name + '!=null',
									'next'			: 'var ' + blocks[i].key_name + '= Object.keys(' + blocks[i].obj_name + ')[Object.keys(' + blocks[i].obj_name + ').indexOf(' + blocks[i].key_name + ') + 1];' + 'var ' + blocks[i].value_name + '=' + blocks[i].obj_name + '[' + blocks[i].key_name + '];',
								};
							};
							//Добавляем цикл
							loops.push(loop);
							//Если все условия выполнены
							if (total_conditions(conditions)) {
								//Объявляем переменные цикла
								eval(loop.first);
								//Добавляем условие выполнения тела цикла
								conditions.push(eval(loop.limit));
							} else {
								//Не выполняем тело цикла
								conditions.push(false);
							};
						break;
						
						case 'endfor':
						case 'endwhile':
						case 'endforeach':
							//Итерация. Считываем последний цикл
							var loop = loops[Object.keys(loops).length - 1];
							if (!loop || 'end' + loop.type!=blocks[i].type) {
								throw 'Error: Неожиданное появление ' + blocks[i].type;
							};
							//Если все условия выполнены
							if (total_conditions(conditions)) {
								//Изменяем переменные цикла
								eval(loop.next);
								//Проверяем условие продолжения цикла
								if (eval(loop.limit)) {
									//повтор тела цикла
									i = loop.block;
								} else {
									//Завершаем цикл и условие цикла
									loops.pop();
									conditions.pop();
								};
							} else {
								//Завершаем цикл и условие цикла
								loops.pop();
								conditions.pop();
							};
						break;
					};
				} catch (e) {
					//Определяем строку блока
					var line = input.split(blocks[i].text).shift().split('\r\n').length;
					//Выводим ошибку
					console.error('ERROR OUTPUT:', (params.file) ? ('Файл "' + params.file + '"') : (''), 'cтрока "' + line + '"', e.toString());
					//Завершаем цикл
					i = blocks.length;
					break;
				};
			};
			
		};
		
		if (loops.length>0) {
			console.error('ERROR OUTPUT:', params.file ? ('Файл "' + params.file + '"') : '',': Циклы не завершены');
		};
		
		if (conditions.length>0) {
			console.log(conditions.length);
			console.error('ERROR OUTPUT:', params.file ? ('Файл "' + params.file + '"') : '',': Условные операторы не завершены');
		};

		//Очистка кода
		if (this.config.clear) {
			//Удаление комментариев <!-- --> в html
			output = output.replace(self.re['comments_html'], '');
			//Поиск стилей
			output = output.replace(self.re['styles'], function (s, a1, a2, a3) {
				//Удаление комментариев /**/
				a2 = a2.replace(self.re['comments_stars'], '');
				return a1 + a2 + a3;
			});
			//Поиск скриптов
			output = output.replace(self.re['scripts'], function (s, a1, a2, a3) {
				//Удаление комментариев //
				a2 = a2.replace(self.re['comments_slash'], '');
				//Удаление комментариев /**/
				a2 = a2.replace(self.re['comments_stars'], '');
				return a1 + a2 + a3;
			});
			//Удаление лишних пробелов и переносов строк
			output = output.replace(self.re['spaces'], ' ');
		};
		return output;
	};
};
module.exports = function (config) {
	return new Output(config);
};
