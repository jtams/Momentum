﻿# Momentum

Momentum is a personal project I'm working on with a few friends to create a "smart" gauge cluster for a motorcycle (or car).

The idea is to mount a display, a computer (Raspberry Pi), and a couple of microcontrollers to a bike.
Then all the wires from the original dash (and anything else we want to control) will be plugged into the GPIO pins
of the computer. The computer would boot into chromium in Kiosk mode a custom splash screen. Chromium will load
localhost:PORT and a Node/Express server will be started in the background that hosts the dash. Using the onoff
library, Node can read and write to GPIO pins. The backend will read the data coming from the bike ECU and make the
necessary calculations before sending that data to the client via a websocket. This is all on the same machine but
as long as it's connected to wifi, another device could connect and view the dash making diagnosing issues easier.
To connect to Wifi, I will use node-wifi.

## Technical

### RPM

Revolutions per minute are the unit for measuring how fast an engine is moving. The bike we are using to test does this with a sensor on the crankshaft. This sensor sends a pulse 2 times per rotation. When we see one pulse, we start a timer. We wait for the pulse to turn off, then we wait for another pulse. After that second pulse we see how long it took in milliseconds and multiply it by 2. We then divide 3.6 million (ms in an hour) by the time it took. And we have the RPM. With our testing this seems like it's more accurate and responsive than the original analog gauge cluster.

### Speed

Speed is more complicated. The speed sensor is on the front sprocket and sends a pulse every time a tooth of the sprocket passes it. To get speed, we need the teeth of the front sprocket, the teeth of the rear sprocket, and the diameter of the rear tire. We use similar methods to the RPM. We get the time between each tooth of the front sprocket. Using that time, we compare that to the ratio of the front sprocket to the rear sprocket. Most bikes are roughly a 1:3 ratio. This means the front sprocket rotates 3 times for every 1 rotation of the rear. The rear sprocket is attached to the rear wheel. So, we know if the front sprocket rotates 3 times then the bike has traveled the diameter of the read wheel. That's the basic idea. We don't wait for 3 full rotations due to latency issues. We get the average time for the front sprocket to pass 5 teeth. This makes the speed responsive and makes up for some error of the GPIO pins not getting the pulse.

### Lights and Other

The remaining parts of the gauge cluster are mostly lights. These signals are inverted so when we get a LOW voltage from the neutral light for example, it means the light is on. This is how all the lights work. Another thing to note is that the indicators blink comes from the wire. The blink is not calculated by the dash but rather the ECU sends blinking voltages.

Bikes also usually include odometer, trip, clock and some include lap timer. This is stored on the gauge cluster (we think) so this data will be stored on the computer. This also means we can log lap times, and have as many trips as we want.

### Electronics

All the wires on the bike use analog to send data. We could use an ADC (analog to digital converter) but I didn't want to buy one so for now we are using an Arduino micro controller to do that for us. The data comes into the Analog pins of the Arduino and we have a program that sees if the value is over 50 then it sends HIGH (or 1) through one of its digital pins that goes to the computer. If it is under 50 it sends LOW (or 0). We haven't tested the limits of this but for now it's working great.

## Things I want to attempt with Momentum

I want to see how far we can push the smart features of a dash system like this. Although the dash isn't "writing" any information to the bike I think we can accomplish far more than the OEM gauge cluster.

Early 2000's supersport motorcycles don't usually include a gear indicator. I know it's possible to know what gear the bike is in based on current speed and RPM. Just not sure on how to calculate that.

Show shift timing. This could be used for saving gas or just to show how efficient your last shift was.

We need both sprocket's teeth counts and the rear wheel dimensions to get the speed. Our computer has Bluetooth. Goal: Create a mobile webapp that sends GPS/accelerometer data to the Momentum computer. Using that data, RPM, and selected gear I believe we could get a very close guess to what size sprockets and tires the bike has without ever having to enter that data manually per bike.

With some of that previous mentioned data collected. I think we could get a pretty accurate throttle position reading.

Using GPS, I also think we could know if the bike is moving backwards or forwards and if the bike is doing a burnout.

Using a gyroscope, we could tell if the bike was leaning, doing a wheelie, or a stoppie. We could also give the user extra information to alert them if the front wheel is about to leave the ground.

Using a proximity sensor like the ones seen on modern cars we could alert the user if they're approaching too fast. We can also collect braking data to see how fast the user can come to a stop.

I believe we could use Bluetooth to control a GoPro/Dashcam and when the bike arrives home it could start uploading the footage.

It wouldn't be hard to allow Momentum to control the blinkers on the bike. I think we could make the blinkers automatically turn off.

Blind spot camera/sensor?

I would also like to see what we could do with machine learning. Might be able to get accurate fuel readings on bikes without a fuel sensor.

Later, instead of having the dash plugged in via the OEM gauge cluster cables, I think we could intercept/piggy-back the ECU. This would let us control the bike as well. We're going to need a lot more GPIO pins.

Finally, something I would like to later attempt to be able to pair Momentum gauge clusters with each other via Bluetooth or some sort of RF transmission. Once they're paired, it could have some racing features like drag racing count downs and include other competitions specifically on a track.
