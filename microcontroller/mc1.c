// Used for Speedometer, Tachometer, and the lights you never want to see on.
// We are using 2 microcontrollers because we only have 8 analog pins on each with our current resources
void setup() {
    pinMode(A0, INPUT); //Speed
    pinMode(A1, INPUT); //Tach
    pinMode(A2, INPUT); //Fuel Injection LED
    pinMode(A3, INPUT); //Water Temp
    pinMode(A4, INPUT); //Oil Pressure
    Serial.begin(19200);
}

unsigned long speedTimer = millis();
unsigned long tachTimer = millis();
unsigned long LEDTimer = millis();

//speed
unsigned short speed;
unsigned short speedPulseCount;
unsigned char speedStage = 0;

//tach
unsigned short rpm;
unsigned char tachStage = 0;


void loop() {
    char speedPulse = analogPulse(A0) > 100 ? 1 : 0;
    char tachPulse = analogPulse(A1) > 100 ? 1 : 0;

    char fuelLed = analogPulse(A2) > 100 ? 1 : 0;
    char WaterTempLed = analogPulse(A3) > 100 ? 1 : 0;
    char OilLed = analogPulse(A4) > 100 ? 1 : 0;

    //Front Sprocket Pulse Counter
    if (speedStage == 0 && speedPulse == 1) speedStage = 1;
    if (speedStage == 1 && speedPulse == 0) speedStage = 2;
    if (speedStage == 2 && speedPulse == 1) {
        speedPulseCount++;
        speedStage = 1;
    }

    //Engine Rev Pulse Counter
    if (tachStage == 0 && tachPulse == 1) tachStage = 1;
    if (tachStage == 1 && tachPulse == 0) {
        tachStage = 2;
        tachTimer = millis();
    }
    if (tachStage == 2 && tachPulse == 1) {
        tachStage = 0;
        tachTimer = millis() - tachTimer;
        RPM = 60000/timer;
        Serial.print("RPM:");
        Serial.println(RPM);
    }

    //Updates speed every 200 ms
    if (millis() - speedTimer >= 200) {
        Serial.print("speedPulse:");
        Serial.println(speedPulseCount);
        speedTimer = millis();
        speedPulseCount = 0;
    }


    // LED Update
    if (millis() > LEDTimer + 5000) {
        Serial.print("Light:");
        if (fuelLed) Serial.print('FI,');
        if (WaterTempLed) Serial.print('WT,');
        if (OilLed) Serial.print('O,');
        Serial.println("");
        LEDTimer = millis();
    }
}