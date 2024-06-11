/**
 * [[ToBoolean]]
 * 使用场景：将非布尔类型转换为布尔类型
 * 转换规则：
 * 1、undefined、null、NaN、0、""、false -> false；
 * 2、除上述六种falsy值外的任意值 -> true
 *
 * 触发场景：!运算符, if(), for()、while()语句, 三元运算符 ? : 中的条件判断表达式, 逻辑运算符 || 和 && 左边的操作数
 *
 * [[ToString]]
 * 使用场景：将非字符串类型转换为字符串类型
 * 1、基础类型 -> 直接加 ""（极大极小的数字类型值会转化为指数形式如: 1.07 * 1000000000000000000000 -> "1.07e21"）
 * 2、对象类型 -> 调用 [[ToPrimitive]] 方法（优先toString)，获得基础类型值，然后执行1中的操作，[[ToPrimitive]] 失败(无法返回基础类型值) 抛出 TypeError
 *
 * 触发场景：+ ""
 *
 * [[ToNumber]]
 * 使用场景：将非数字类型转换为数字类型
 * 1、undefined -> NaN
 * 2、null -> 0
 * 3、true -> 1; false -> 0
 * 4、"42" -> 42; "abc" -> NaN; "" -> 0
 * 5、对象类型 -> 调用 [[ToPrimitive]] 方法（优先valueOf)，获得基础类型值，然后执行1~4中的操作，[[ToPrimitive]] 失败(无法返回基础类型值) 抛出 TypeError
 *
 * 触发场景: +a, 数字运算符 -,*,/,>,< 等等
 *
 * [[ToPrimitive]]
 * 使用场景：将非基础类型的值转化为基础类型
 * 使用原理：
 * 1、若优先级为 number, 则先尝试调用ValueOf(), 如ValueOf不存在或未返回基础类型值则尝试调用toString(), 同理如果尝试失败则抛出 TypeError
 * 2、若优先级为 string, 则先尝试调用toString(), 如toString不存在或未返回基础类型值则尝试调用ValueOf(), 同理如果尝试失败则抛出 TypeError
 *
 * [[+运算符]]
 * 加号运算符的强制转换规则:
 * 如果运算符两端存在字符串类型值或可以通过 [[ToPrimitive]] 转换为字符串类型的对象类型值时，+运算符执行字符串拼接，否则执行数字加法
 * 布尔类型与数字类型混合时，将布尔类型转化为数字类型
 *
 * [[||运算符]]
 * a || b 等价于 a ? a : b
 *
 * [[&&运算符]]
 * a && b 等价于 a ? b : a
 *
 * [[==运算符]]
 * 1、Type(x) === Type(y); 返回 x === y
 * 2、Type(x) === 'number'; Type(y) === 'string' 返回 x == ToNumber(y)
 * 3、Type(x) === 'boolean'; 返回 ToNumber(x) == y
 * 4、Type(x) === 'undefined' || Type(x) === 'null'; 返回 Type(y) === 'undefined' || Type(y) === 'null'
 * 5、Type(x) === 'object' && (Type(y) === 'number' || Type(y) === 'string'); 返回 ToPrimitive(x) == y
 *
 *
 * 一些常见的面试题目
 *
 * "0" == null              => false
 * "0" == undefined         => false
 * "0" == NaN               => false
 * "0" == false             => true
 * "0" == 0                 => true
 * "0" == ""                => false
 *
 * false == 0               => true
 * false == ""              => true
 * false == []              => true
 * false == {}              => false
 *
 * "" == 0                  => true
 * "" == []                 => true
 * 0 == []                  => true
 * 0 == {}                  => false
 * [] == ![]                => true   ([] == ![] ->  [] == false -> [] == 0 -> "" == 0 -> 0 == 0 -> true)
 * 2 == [2]                 => true
 * "" == [null]             => true   ("" == [null] -> "" == "" -> true)
 *
 * [] + {}                  => "[object Object]"  ([] + {} -> "" + "[object Object]" -> "[object Object]")
 * {} + []                  => 0 ({} + [] -> +[] -> +"" -> 0)
 *
 * [[<运算符]]
 * 使用原理：
 * 1、Type(x) === 'string' && Type(y) === 'string' -> 字符串比较
 * 2、ToNumber(x) < ToNumber(y)
 */
