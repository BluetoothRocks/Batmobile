/* Pills */

document.getElementById('control').addEventListener('click', (e) => {
	document.body.classList.remove('control', 'customize');
	document.body.classList.add('control');
});

document.getElementById('customize').addEventListener('click', (e) => {
	document.body.classList.remove('control', 'customize');
	document.body.classList.add('customize');
});




var emulateState = false;
var lightsState = false;






/* Watch CSS animations */

var lastDirection = 'stop';

var batmobile = document.getElementById('batmobile');

function watcher() {
	direction = window.getComputedStyle(batmobile).content;

	if (direction.substring(0, 1) == '"') {
		direction = direction.substring(1, direction.length - 1);
	}
	
	if (direction != lastDirection) {
		lastDirection = direction;
		executeCommand(direction);
	}

	window.requestAnimationFrame(watcher);
}

window.requestAnimationFrame(watcher);





/* Keyboard events */

document.addEventListener('keydown', handleKeyEvent);
document.addEventListener('keyup', handleKeyEvent);			

var lastKey = null;

var activeKeys = {
    'ArrowUp':    false,
    'ArrowDown':  false,
    'ArrowLeft':  false,
    'ArrowRight': false
}

function handleKeyEvent(event) {
    if (event.target.tagName == 'STYLE') return;
    if (event.type != 'keydown' && event.type != 'keyup') return;

	if (event.key == 'l' && event.type == 'keydown') {
		executeCommand('lights');
		event.preventDefault();

		return;
	}

	if (activeKeys.hasOwnProperty(event.key)) {
		activeKeys[event.key] = event.type == 'keydown';

		if (event.type == 'keydown') {
			lastKey = event.key;
		}

		event.preventDefault();
	}
	
	evaluateCommands();
}




/* Gamepad support */

var activeButtons = {
    'ArrowUp':    false,
    'ArrowDown':  false,
    'ArrowLeft':  false,
    'ArrowRight': false
}

const gamepad = new Gamepad();

gamepad.on('press', 'd_pad_up', () => { activeButtons.ArrowUp = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_up', () => { activeButtons.ArrowUp = false; evaluateCommands(); } );
gamepad.on('press', 'd_pad_left', () => { activeButtons.ArrowLeft = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_left', () => { activeButtons.ArrowLeft = false; evaluateCommands(); } );
gamepad.on('press', 'd_pad_right', () => { activeButtons.ArrowRight = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_right', () => { activeButtons.ArrowRight = false; evaluateCommands(); } );
gamepad.on('press', 'd_pad_down', () => { activeButtons.ArrowDown = true; evaluateCommands(); } );
gamepad.on('release', 'd_pad_down', () => { activeButtons.ArrowDown = false; evaluateCommands(); } );

gamepad.on('press', 'button_1', () => executeCommand('lights') );






/* Mouse events */
var controls = document.getElementById('controls');

controls.addEventListener('mousedown', handleMouseEvent);
controls.addEventListener('mouseup', handleMouseEvent);
controls.addEventListener('touchstart', handleMouseEvent);
controls.addEventListener('touchend', handleMouseEvent);

function handleMouseEvent(event) {
    if (event.target.tagName != 'BUTTON') {
        return;
    }
    
    var type = event.type == 'mousedown' || event.type == 'touchstart' ? 'down' : 'up'
    var command = event.target.dataset[type];
    executeCommand(command);

    event.preventDefault();
}





/* Connect to device */

document.getElementById('connect')
	.addEventListener('click', () => {
		PoweredUp.connect()
			.then(()=> {
				document.body.classList.add('connected');
			});
	});

document.getElementById('emulate')
	.addEventListener('click', () => {
	    emulateState = true;
		document.body.classList.add('connected');
	});


	
	
	
/* Handle commands */


var lastCommand = 'stop';

function evaluateCommands() {
	command = 'stop';
	if (activeKeys.ArrowUp || activeButtons.ArrowUp) command = 'forward';
	if (activeKeys.ArrowDown || activeButtons.ArrowDown) command = 'reverse';
	if (activeKeys.ArrowLeft || activeButtons.ArrowLeft) command = 'left';
	if (activeKeys.ArrowRight || activeButtons.ArrowRight) command = 'right';
	
	
    if (lastCommand != command) {
        executeCommand(command);
        lastCommand = command;
    }
}

function updateCommand(value) {
	document.body.classList.remove('forward');
	document.body.classList.remove('reverse');
	document.body.classList.remove('left');
	document.body.classList.remove('right');
	
	if (value) {
		document.body.classList.add(value);
	}
}

function executeCommand(value) {
	let turn = document.getElementById('turn').checked;
	
    switch (value) {
        case 'forward':
        	updateCommand('forward');
        	
			if (PoweredUp.isConnected()) {		            	
				PoweredUp.drive(
					126, -126
				);
			}
				
			break;
        
        case 'reverse':
        	updateCommand('reverse');
        	
			if (PoweredUp.isConnected()) {		            	
            	PoweredUp.drive(
					-126, 126
				);
			}
				
			break;
        
        case 'right':
        	updateCommand('right');
        	
			if (PoweredUp.isConnected()) {		            	
            	PoweredUp.drive(
					turn ? -126 : 30, -126
				);
			}
				
			break;
        
        case 'left':
        	updateCommand('left');

			if (PoweredUp.isConnected()) {		            	
            	PoweredUp.drive(
					126, turn ? 126 : -30
				);
			}
				
			break;
        
        case 'stop':
        	updateCommand();

			if (PoweredUp.isConnected()) {		            	
            	PoweredUp.stop();
            }
            
			break;
        
    }
}
