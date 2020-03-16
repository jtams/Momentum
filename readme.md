# Momentum
A web based speed gauge for a motorcycle.

It's meant to be run off a small computer like a Raspberry Pi on  a local server like a Kiosk.

Raspberry Pi 4 will start in a "Kiosk" mode that will first launch a node server and then load a chromium
browser and connect to that localhost. Node will manage GPIO from the Pi and use Socket.io to send that data
to the browser web page which will handle the graphics and most the calculations.