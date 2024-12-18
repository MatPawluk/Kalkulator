const display = document.getElementById('display');
const expressionDisplay = document.getElementById('expression');
const currentInputDisplay = document.getElementById('currentInput');
const buttons = document.querySelectorAll('.button');
const clickSound = document.getElementById('click-sound');


let currentInput = '';
let previousInput = '';
let operator = null;
let isError = false;
let fullExpression = '';

function updateDisplay() {
	let expressionWithSymbols = fullExpression
		.replace('add', '+')
		.replace('subtract', '-')
		.replace('multiply', '*')
		.replace('divide', '/');

	let displayValue = currentInput;

	if (currentInput.length > 9) {
		const numberValue = parseFloat(currentInput);
		if (!isNaN(numberValue)) {
			displayValue = numberValue.toExponential(3);
		} else {
			displayValue = currentInput.slice(0, 9);
		}
	}

	expressionDisplay.textContent = expressionWithSymbols;

	currentInputDisplay.textContent = displayValue;
}

function playClickSound() {
    clickSound.currentTime = 0; 
    clickSound.play(); 
}

buttons.forEach(button => {
    button.addEventListener('click', playClickSound);
});

buttons.forEach(button => {
	button.addEventListener('click', () => {
		const id = button.id;

		if (isError) {
			if (id === 'clear') {
				clearCalculator();
			}
			return;
		}

		if (id === 'clear') {
			clearCalculator();
		} else if (id === 'equals') {
			calculate();
		} else if (id === 'add' || id === 'subtract' || id === 'multiply' || id === 'divide') {
			setOperator(id);
		} else {
			inputNumber(button.textContent);
		}
	});
});

document.addEventListener('keydown', function (event) {
	const key = event.key;

	if (!isNaN(key)) {
		inputNumber(key);
	} else if (key === '+') {
		setOperator('add');
	} else if (key === '-') {
		setOperator('subtract');
	} else if (key === '*') {
		setOperator('multiply');
	} else if (key === '/') {
		setOperator('divide');
	} else if (key === 'Enter' || key === '=') {
		calculate();
	} else if (key === 'Escape' || key === 'c') {
		clearCalculator();
	} else if (key === '.') {
		inputNumber('.');
	}
});

function inputNumber(number) {
	if (currentInput.length >= 9 && number !== '.' && number !== 'e') return;

	if (number === '.' && currentInput.includes('.')) return;

	if (number === 'e' && currentInput.includes('e')) return;

	currentInput += number;
	fullExpression += number;
	updateDisplay();
}

function setOperator(selectedOperator) {
	if (currentInput === '') return;

	if (previousInput !== '') {
		calculate();
	}

	operator = selectedOperator;

	previousInput = currentInput;
	currentInput = '';

	fullExpression = previousInput + ' ' + selectedOperator + ' ';
	updateDisplay();
}

function calculate() {
	let result;

	const prev = parseFloat(previousInput);
	const current = parseFloat(currentInput);

	if (isNaN(prev) || isNaN(current)) return;

	switch (operator) {
		case 'add':
			result = prev + current;
			break;
		case 'subtract':
			result = prev - current;
			break;
		case 'multiply':
			result = prev * current;
			break;
		case 'divide':
			if (current === 0) {
				result = 'LOL.. NO';
				isError = true;
			} else {
				result = prev / current;
			}
			break;
		default:
			return;
	}

	fullExpression = previousInput + ' ' + operator + ' ' + currentInput + ' = ' + result.toString();

	if (!isError) {
		currentInput = result.toString();
	} else {
		currentInput = result;
	}

	operator = null;
	previousInput = '';

	if (!isError) {
		fullExpression = '';
	}

	updateDisplay();
}

function setOperator(selectedOperator) {
	if (currentInput === '' && previousInput === '') return;

	if (operator !== null && currentInput === '') {
		operator = selectedOperator;
		fullExpression = previousInput + ' ' + selectedOperator + ' ';
		updateDisplay();
		return;
	}

	if (previousInput !== '') {
		calculate();
	}

	operator = selectedOperator;

	previousInput = currentInput;
	currentInput = '';

	fullExpression = previousInput + ' ' + selectedOperator + ' ';
	updateDisplay();
}

function clearCalculator() {
	currentInput = '';
	previousInput = '';
	operator = null;
	isError = false;
	fullExpression = '';
	updateDisplay();
}

updateDisplay();
