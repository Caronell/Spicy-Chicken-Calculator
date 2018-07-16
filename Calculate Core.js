var Angel_Mode = "deg"; //弧度制和角度制
var snd = 0; // 第二模式

//#===============================================
//# ● 栈的模拟
//#===============================================
function Stack()
{
	this.dataStore = [];
	this.count = 0;
	this.push = push;
	this.pop = pop;
	this.size = size;
	this.clear = clear;
	this.top = top;
	this.empty = empty;

	function push(x)
	{
		this.dataStore[this.count++] = x;
	}

	function pop()
	{
		this.count -= 1;
	}

	function size()
	{
		return this.count;
	}

	function clear()
	{
		this.count = 0;
	}

	function top()
	{
		if(this.count == 0)
			throw err = new Error("pop警告：当前栈为空。");
		else
			return this.dataStore[this.count - 1];
	}

	function empty()
	{
		if(this.count == 0)
			return true;
		else
			return false;
	}
}

//#===============================================
//# ● 判断是否为运算符
//#===============================================
function is_operator(x)
{
	if((x >= '0' && x <= '9') || x == 'π' || x == 'e' || x == ' ' || x == '.')
		return false;
	else
		return true;
}

//#===============================================
//# ● 计算阶乘
//#===============================================
function factorial(n)
{
	var t = n.toString().indexOf(".");
	if(n == 0)
		return 1;
	else if(t > 0)
		return Math.sqrt(2 * n * Math.PI) * Math.pow(n / Math.E, n);
	else
		return n * (factorial(n - 1));
}

//#===============================================
//# ● 格式化运算式
//#===============================================
function format(str)
{
	var i;
	var tmp = "";
	for(i = 0; i < str.length; ++i)
	{
		if(is_operator(str[i]))
		{
			if(str[i] == 'a') // 反三角函数
			{
				if(i > 0 && !is_operator(str[i - 1]) && str[i - 1] != ' ')
					tmp = tmp + " × ";
				tmp = tmp + str[i] + str[i + 1] + str[i + 2] + str[i + 3] + " ";
				i += 3;
			}
			else if(str[i] == 's' || str[i] == 'c' || str[i] == 't')
			{
				//三角函数
				if(i > 0 && !is_operator(str[i - 1]) && str[i - 1] != ' ')
					tmp = tmp + " × ";
				tmp = tmp + str[i] + str[i + 1] + str[i + 2] + " ";
				i += 2;
			}
			else if(str[i] == 'l')
			{
				//对数
				if(i > 0 && !is_operator(str[i - 1]) && str[i - 1] != ' ')
					tmp = tmp + " × ";
				tmp = tmp + str[i] + str[i + 1] + " ";
				i += 1;
			}
			else if(str[i] == '√')
			{
				if(i > 0 && !is_operator(str[i - 1]) && str[i - 1] != ' ')
					tmp = tmp + " × ";
				tmp = tmp + str[i] + " ";
			}
			else if(str[i] == '(')
			{
				if(i > 0 && !is_operator(str[i - 1]) && str[i - 1] != ' ')
					tmp = tmp + " × ";
				tmp = tmp + str[i] + " ";
			}
			else if(str[i] == ')')
			{
				tmp = tmp + " " + str[i];
				if(i < str.length - 1 && !is_operator(str[i + 1]) && str[i + 1] != ' ')
					tmp = tmp + " × ";
			}
			else
			{
				if(str[i] == '-') //负数处理
				{
					if(i == 0)
						tmp = tmp + " " + str[i];
					else if(is_operator(str[i - 1]) && str[i - 1] != ')')
						tmp = tmp + " " + str[i];
					else
						tmp = tmp + " " + str[i] + " ";
				}
				else
					tmp = tmp + " " + str[i] + " ";
			}
		}
		else
		{
			if(str[i] == 'π' || str[i] == 'e')
			{
				if(i > 0 && !is_operator(str[i - 1]))
					tmp = tmp + " × ";
				if(i < str.length - 1 && !is_operator(str[i + 1]))
					tmp = tmp + " × "; // 计算式不合法
			}
			tmp = tmp + str[i];
		}
	}
	return tmp;
}

//#===============================================
//# ● 获取运算符优先级
//#===============================================
function get_rank(oper)
{
	var a;
	switch(oper)
	{
		case "+":
		case "-":
			a = 1;
			break;
		case "%":
		case "×":
		case "÷":
			a = 2;
			break;
		case "(":
			a = 4;
			break;
		case ")":
			a = 0;
			break;
		case "^":
		case "√":
		case "!":
		case "tan":
		case "sin":
		case "cos":
		case "asin":
		case "acos":
		case "atan":
		case "lg":
		case "ln":
			a = 3;
			break;
		default:
			a = -1;
			break
	}
	return a;
}

//#===============================================
//# ● 中缀转后缀
//#===============================================
function shift_expression(equ)
{
	var stack = new Stack();
	var str = "";
	var i = 0;
	while(i < equ.length)
	{

		if(equ[i] == ' ')
			i += 1;
		else if((!is_operator(equ[i]) && equ[i] != ' ') || (equ[i] == '-' && !is_operator(equ[i + 1]) && equ[i + 1] != ' '))
		{
			//加入负数处理
			while(equ[i] != ' ')
			{
				str = str + equ[i];
				i += 1;
				if(i >= equ.length)
					break;
			}
			str = str + " ";
		}
		else
		{
			var ts = "";
			if(equ[i] == 'a') //反三角函数
			{
				ts = equ[i] + equ[i + 1] + equ[i + 2] + equ[i + 3];
				i += 4;
			}
			else if(equ[i] == 's' || equ[i] == 'c' || equ[i] == 't')
			{
				// 三角函数
				ts = equ[i] + equ[i + 1] + equ[i + 2];
				i += 3;
			}
			else if(equ[i] == 'l')
			{
				// 对数
				ts = equ[i] + equ[i + 1];
				i += 2;
			}
			else
			{
				// 根号
				ts = equ[i];
				i += 1;
			}
			if(stack.empty())
				stack.push(ts);
			else if(ts == '(')
				stack.push(ts);
			else if(ts == ')')
			{
				while(stack.top() != '(')
				{
					str = str + stack.top() + " ";
					stack.pop();
				}
				stack.pop();
			}
			else if(stack.top() == '(')
			{
				stack.push(ts);
			}
			else if(get_rank(ts) > get_rank(stack.top()))
			{
				stack.push(ts);
			}
			else if(get_rank(ts) <= get_rank(stack.top()))
			{
				while(get_rank(ts) <= get_rank(stack.top()))
				{
					if(stack.top() == '(')
						break;
					str = str + stack.top() + " ";
					stack.pop();
					if(stack.empty())
						break;
				}
				stack.push(ts);
			}
		}
	}
	while(!stack.empty())
	{
		str = str + stack.top() + " ";
		stack.pop();
	}
	str = str.trim();
	return str;
}

//#===============================================
//# ● 计算后缀表达式
//#===============================================
function caculate(str)
{
	var numstack = new Stack();
	var tmp = "";
	var i = 0,
		len = str.length;
	while(i < len)
	{
		if(is_operator(str[i]))
		{
			// 判断负数
			if(str[i] == '-' && !is_operator(str[i + 1]) && str[i + 1] != ' ')
			{
				while(str[i] != ' ')
				{
					tmp = tmp + str[i];
					i += 1;
				}
				var t = parseFloat(tmp);
				numstack.push(t);
				tmp = "";
			}
			// 单目运算符
			else if(str[i] == 'a' || str[i] == 's' || str[i] == 'c' || str[i] == 't' || str[i] == 'l' || str[i] == '√' || str[i] == '!')
			{
				if(numstack.empty())
					return "ERROR: 计算式不合法";
				var ts = "";
				var a;
				a = numstack.top();
				numstack.pop();
				if(str[i] == '√')
				{
					ts = str[i];
					i += 1;
				}
				else if(str[i] == 'l')
				{
					ts = str[i] + str[i + 1];
					i += 2;
				}
				else if(str[i] == '!')
				{
					ts = str[i];
					i += 1;
				}
				else if(str[i] == 'a')
				{
					ts = str[i] + str[i + 1] + str[i + 2] + str[i + 3];
					i += 4;
				}
				else
				{
					ts = str[i] + str[i + 1] + str[i + 2];
					i += 3;
				}
				if(ts == "sin")
				{
					if(Angel_Mode == "deg")
					{
						a %= 360;
						a = a * Math.PI / 180;
					}
					else
						a %= (2 * Math.PI);
					a = Math.sin(a);
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "cos")
				{
					if(Angel_Mode == "deg")
					{
						a %= 360;
						a = a * Math.PI / 180;
					}
					else
						a %= (2 * Math.PI);
					a = Math.cos(a);
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "tan")
				{
					if(Angel_Mode == "deg")
					{
						a %= 180;
						if(a == 90 || a == -90)
							return "ERROR: 无效输入";
						a = a * Math.PI / 180;
					}
					else
					{
						a %= Math.PI;
						if(a == Math.PI / 2 || a == -(Math.PI / 2))
							return "ERROR: 无效输入";
					}
					a = Math.tan(a);
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "ln")
				{
					if(a <= 0)
						return "ERROR: 无效输入";
					a = Math.log(a);
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "lg")
				{
					if(a <= 0)
						return "ERROR: 无效输入";
					a = Math.log10(a);
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "√")
				{
					if(a < 0)
						return "ERROR: 不支持虚数";
					else
					{
						a = Math.sqrt(a);
						a = a.toFixed(9);
						a = parseFloat(a);
						numstack.push(a);
					}
				}
				else if(ts == "!")
				{
					if(a < 0)
						return "ERROR: 不支持负数阶乘";
					else
					{
						a = factorial(a);
						numstack.push(a);
					}
				}
				else if(ts == "asin")
				{
					if(a > 1)
						return "ERROR: 超出反三角函数定义域";
					a = Math.asin(a);
					a = a * 180 / Math.PI;
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "acos")
				{
					if(a > 1)
						return "ERROR: 超出反三角函数定义域";
					a = Math.acos(a);
					a = a * 180 / Math.PI;
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
				else if(ts == "atan")
				{
					a = Math.atan(a);
					a = a * 180 / Math.PI;
					a = a.toFixed(9);
					a = parseFloat(a);
					numstack.push(a);
				}
			}
			else // 双目运算符
			{
				var a, b;
				if(numstack.empty())
					return "ERROR: 计算式不合法";
				a = numstack.top();
				numstack.pop();
				if(numstack.empty())
					return "ERROR: 计算式不合法";
				b = numstack.top();
				numstack.pop();
				if(str[i] == '+')
					numstack.push(a + b);
				else if(str[i] == '-')
					numstack.push(b - a);
				else if(str[i] == '×')
					numstack.push(a * b);
				else if(str[i] == '÷')
				{
					if(a == 0)
						return "ERROR: 除数不能为0";
					else
						numstack.push(b / a);
				}
				else if(str[i] == '^')
					numstack.push(Math.pow(b, a));
				else if(str[i] == '%')
				{
					if(a == 0)
						return "ERROR: 不能对0取余";
					else
						numstack.push(b % a);
				}
				i++;
			}
		}
		else if(str[i] == ' ')
			i++;
		else
		{
			//处理数字
			while(str[i] != ' ')
			{
				tmp = tmp + str[i];
				i += 1;
			}
			var t;
			if(tmp == "π")
				t = Math.PI;
			else if(tmp == "e")
				t = Math.E;
			else
				t = parseFloat(tmp);
			numstack.push(t);
			tmp = "";
		}
	}
	var fin = numstack.top();
	fin = fin.toFixed(9);
	fin = parseFloat(fin); //处理浮点误差
	return fin.toString();
}

//#===============================================
//# ● 判断运算式是否只有数字
//#===============================================
function only_number(str)
{
	var i;
	for(i = 0; i < str.length; ++i)
	{
		if(is_operator(str[i]) || str[i] == 'π' || str[i] == 'e')
			return false;
	}
	return true;
}

//#===============================================
//# ● 获取页面上激活的按键
//#===============================================
function getnum()
{
	var a = event.srcElement;
	var flag = true;
	if(a.id == "0")
		a = document.getElementById("0").textContent;
	else if(a.id == "1")
		a = document.getElementById("1").textContent;
	else if(a.id == "2")
		a = document.getElementById("2").textContent;
	else if(a.id == "3")
		a = document.getElementById("3").textContent;
	else if(a.id == "4")
		a = document.getElementById("4").textContent;
	else if(a.id == "5")
		a = document.getElementById("5").textContent;
	else if(a.id == "6")
		a = document.getElementById("6").textContent;
	else if(a.id == "7")
		a = document.getElementById("7").textContent;
	else if(a.id == "8")
		a = document.getElementById("8").textContent;
	else if(a.id == "9")
		a = document.getElementById("9").textContent;
	else if(a.id == "+")
		a = document.getElementById("+").textContent;
	else if(a.id == "-")
		a = document.getElementById("-").textContent;
	else if(a.id == "×")
		a = document.getElementById("×").textContent;
	else if(a.id == "÷")
		a = document.getElementById("÷").textContent;
	else if(a.id == "(")
		a = document.getElementById("(").textContent;
	else if(a.id == ")")
		a = document.getElementById(")").textContent;
	else if(a.id == ".")
		a = document.getElementById(".").textContent;
	else if(a.id == "sin")
		a = document.getElementById("sin").textContent + "(";
	else if(a.id == "cos")
		a = document.getElementById("cos").textContent + "(";
	else if(a.id == "tan")
		a = document.getElementById("tan").textContent + "(";
	else if(a.id == "ln")
		a = document.getElementById("ln").textContent + "(";
	else if(a.id == "lg")
		a = document.getElementById("lg").textContent + "(";
	else if(a.id == "^")
		a = document.getElementById("^").textContent;
	else if(a.id == "%")
		a = document.getElementById("%").textContent;
	else if(a.id == "√")
		a = document.getElementById("√").textContent;
	else if(a.id == "π")
		a = document.getElementById("π").textContent;
	else if(a.id == "e")
		a = document.getElementById("e").textContent;
	else if(a.id == "!")
		a = document.getElementById("!").textContent;
	else if(a.id == "←")
	{
		flag = false;
		var s = document.getElementById("ans").value;
		if(s.length > 0)
		{
			s = s.substring(0, s.length - 1);
			document.getElementById("ans").value = s;
		}
	}
	else if(a.id == "mode")
	{
		flag = false;
		a = document.getElementById("mode").textContent;
		if(snd == 0)
		{
			if(a == "deg")
			{
				Angel_Mode = "rad";
				document.getElementById("mode").textContent = "rad";
				document.getElementById("2nd").id = "disable";
			}
			else
			{
				Angel_Mode = "deg";
				document.getElementById("mode").textContent = "deg";
				document.getElementById("disable").id = "2nd";
			}
		}
	}
	else if(a.id == "2nd")
	{
		flag = false;
		a = document.getElementById("sin").textContent;
		if(Angel_Mode == "deg")
		{
			if(a == "sin")
			{
				snd = 1;
				document.getElementById("sin").textContent = "asin";
				document.getElementById("cos").textContent = "acos";
				document.getElementById("tan").textContent = "atan";
				document.getElementById("mode").id = "disable";
			}
			else
			{
				snd = 0;
				document.getElementById("sin").textContent = "sin";
				document.getElementById("cos").textContent = "cos";
				document.getElementById("tan").textContent = "tan";
				document.getElementById("disable").id = "mode";
			}
		}
	}
	else if(a.id == "=")
	{
		flag = false;
		var equa = document.getElementById("ans").value;
		if(only_number(equa))
			document.getElementById("ans").value = equa;
		else
		{
			if(equa == "π")
				equa = "1×π";
			else if(equa == "e")
				equa = "1×e";
			equa = format(equa);
			//document.getElementById("ans").value = equa;
			equa = shift_expression(equa);
			//document.getElementById("ans").value = equa;
			equa = caculate(equa);
			if(equa == "NaN")
				equa = "ERROR: 计算式不合法";
			else if(equa == "Infinity")
				equa = "∞";
			if(equa.indexOf("ERROR") != -1)
				equa = "Error";
			document.getElementById("ans").value = equa;
		}
	}
	else if(a.id == "clear")
	{
		flag = false;
		document.getElementById("ans").value = "";
	}
	else
		a = "";
	if(flag)
	{
		var b = document.getElementById("ans").value;
		document.getElementById("ans").value = b + a;
	}
}