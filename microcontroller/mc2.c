// Used for lights that need quick updates like indicators and neutral light.
void setup() {
    pinMode(A0, INPUT);
    pinMode(A1, INPUT);
    pinMode(A2, INPUT);
    pinMode(A3, INPUT);

    pinMode(4, OUTPUT);
    pinMode(5, OUTPUT);
    pinMode(6, OUTPUT);
    pinMode(7, OUTPUT);
}

void loop() {
    if (analogRead(A0) > 400) 
        digitalWrite(4, HIGH);
    else 
        digitalWrite(4, LOW);

    if (analogRead(A1) > 400) 
        digitalWrite(5, HIGH);
    else 
        digitalWrite(5, LOW);

    if (analogRead(A2) > 400) 
        digitalWrite(6, HIGH);
    else 
        digitalWrite(6, LOW);

    if (analogRead(A3) > 400) 
        digitalWrite(7, HIGH);
    else 
        digitalWrite(7, LOW);
}