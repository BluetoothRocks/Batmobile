# BluetoothRocks! Batmobile
Controlling a Lego Batmobile with WebBluetooth


## What do I need?

- [LEGO App-Controlled Batmobile – Set 76122](https://www.lego.com/en-us/themes/dc-superheroes/products/app-controlled-batmobile-76112)
- A browser that support WebBluetooth on your operating system
- Optionally: a Gamepad connected to your computer

Try it out at: https://bluetooth.rocks/batmobile

Even if you don't have any of the items above, you can still check it out in emulation mode. 

Emulation kinda works in the current version of most browsers, but for the best results you kinda have to use Chrome, Opera of Firefox right now.


## How does this work?

The browser can connect to a Bluetooth LE device like the PowerFunctions Hub used by this particular Lego set. Each Bluetooth device has a number of services and characteristics. Think of them like objects with properties. Once connected to the device, the API then exposes these services and characteristics and you can read from and write to those characteristics. 

The PowerFunctions Hub exposes a number of functions including the ability to change the direction and speed of the connected motors.

## But, how does the CSS animation work?

It's actually not that difficult. The animation is applied to the drawing of the car in the DOM. It uses a custom property `--direction` to set the direction. The value of the custom property is then assigned to the `content` property of the `#batmobile` element like this: `content: @var(--direction)`. We can then use `requestAnimationFrame` to query the current state of the animation for each frame using `getComputedStyle`. If the state changes, we send a command to the racer. So the animation runs in the DOM and we get it almost for free.

## So how does the steering work?

The Batmobile does not have a servo motor for steering, but instead it has two motors that directly drive the two tracks. To go forward or backwards you drive the two motors in the same direction. To steer you need to drive one of the motors forwards and the other one backwards or vice-versa. This is the same way a real life tank steers.

It gets a bit tricky because the motors are rotated 180° compared to each other, so if you need to go forward, you need to drive the one clockwise and the other one counter-clockwise. That will make sure they actually turn in the same direction. And for steering both motors need to turn clock-wise or counter-clockwise depending on the direction you want to go in. This makes sure the motors actually turn in the opposite general direction. It's a bit count-intuitive.

## Why??

Because it's fun. And I got to play around with all kinds of new specifications like WebBluetooth, Gamepad API, WebAudio API, Service Workers, CSS Grids, CSS Variables, Viewport units, SVG and animating SVG. Yes, this is a Progressive Web App that fully works offline and can be installed on your Android home screen.
