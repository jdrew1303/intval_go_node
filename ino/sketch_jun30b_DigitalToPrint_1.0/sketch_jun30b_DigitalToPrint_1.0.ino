#include <A4988.h>
#include <BasicStepperDriver.h>
#include <DRV8825.h>
#include <DRV8834.h>
#include <DRV8880.h>
#include <MultiDriver.h>
#include <SyncDriver.h>

const int Pasos = 200;
const int Dir = 3;
const int Step = 4;

const int encendido = 7;

volatile char cmd_char = 'z';

const char cmd_camera = 'c';
const char cmd_cam_forward = 'e';
const char cmd_cam_backward = 'f';

const char cmd_debug = 'd';
const char cmd_connect = 'i';

const char cmd_mcopy_identifier = 'm';
const char cmd_cam_identifier = 'k';
const int serialDelay = 5;

boolean debug_state = false;
volatile boolean cam_dir = true;

A4988 stepper(Pasos, Dir, Step);

void setup() {
  Serial.begin(57600);
  Serial.flush();
  Serial.setTimeout(serialDelay);

  stepper.begin(90,1); //selecciona velocidad (rpm) y modo de pasos (1=fullstepmode)

  pinMode(encendido, INPUT);
  digitalWrite(encendido, LOW);
}

void loop() {
  if (Serial.available()) {
    /* read the most recent byte */
    cmd_char = (char)Serial.read();
  }
  if (cmd_char != 'z') {
    cmd(cmd_char);
    cmd_char = 'z';
  }
  if (digitalRead(encendido)== HIGH) {
      frame();
  } else {
      digitalWrite(Step,LOW);
  }    
}

void cmd (val) {
  if (val == cmd_debug) {
    debug();
  } else if (val == cmd_connect) {
    connect();
  } else if (val == cmd_mcopy_identifier) {
    identify();
  } else if (val == cmd_camera) {
    frame();
  } else if (val == cmd_cam_forward) {
    cam_direction(true); //explicit
  } else if (val == cmd_cam_backward) {
    cam_direction(false);
  }
}

void debug () {
  debug_state = true;
  Serial.println(cmd_debug);
  log("debugging enabled");
}

void connect () {
  Serial.println(cmd_connect);
  log("connect()");
}

void identify () {
  Serial.println(cmd_cam_identifier);
  log("identify()");  
}

void log (String msg) {
  if (debug_state) {
    Serial.println(msg);
  }
}

void cam_direction (boolean state) {
  cam_dir = state;
  if (state) {
    Serial.println(cmd_cam_forward);
    log("cam_direction -> true");
  } else {
    Serial.println(cmd_cam_backward);
    log("cam_direction -> false");
  }
}

void frame () {
  delay(100);
  if (cam_dir) {
    stepper.rotate(360);
  } else {
    stepper.rotate(-360);
  }
  delay(500);
  if (cam_dir) {
    Serial.println(cmd_cam_forward);
  } else {
    Serial.println(cmd_cam_backward);
  }
  log("frame()");
}

