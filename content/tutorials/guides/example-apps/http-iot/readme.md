---
title: IoT Light Sensor
description: deepstreamHub HTTP Internet of Things Light Sensor tutorial
tags: [HTTP, IoT, Arduino, ESP8266, WiFi]
navLabel: IoT Light Sensor
contentNav: true
body_class: bright
---

deepstreamHub's HTTP API is perfect for low-frequency data updates in low-power
environments where the cost of establishing and maintaining a WebSocket
connection can be prohibitive.

In this tutorial we'll use a remote, low-power ESP8266-based system-on-chip and
a light sensor to send live light readings to deepstreamHub and display them on
a webpage. Additionally, red and green LEDs will show whether the update has
been successful.

I'd recommend being familiar with the basics of
[Records](/tutorials/core/datasync/records/) before you start.

Here's how it looks:

![circuit](circuit.jpg)


## Hardware

- Get hold of a board with an ESP8266 chip. There are many such boards
  available through merchants and action sites for as little as $5. The one
  we're using is listed as an "Elegiant Nodemcu Lua ESP8266 ESP 12E" and cost
  €10 delivered.
- An electronics breadboard and jumper cables.
- A photoresistor/LDR like [this one](http://uk.farnell.com/excelitas-tech/vt90n1/ldr-200kohm-80mw-vt900-series/dp/2293503).
- 1 x 20kΩ resistor (a pull-up for the photoresistor).
- 2 x status LEDs – 1 red, 1 green.
- 2 x 330Ω resistors for the LEDs.

![Schematic](schematic.png)

The circuit is very simple to put together, just make sure the LEDs are correctly oriented.

## Setting up

We'll be using the Arduino IDE to program the device.

- The Arduino IDE is available from [here](https://www.arduino.cc/en/Main/Software#download).
- To get your board setup with Arduino IDE I recommend following a guide like
  [this one](http://www.instructables.com/id/Quick-Start-to-Nodemcu-ESP8266-on-Arduino-IDE/)
  and try to load up an example sketch like Blink.
- For OSX Yosemite I needed to install the CH340G driver available from
  [here](http://kig.re/2014/12/31/how-to-use-arduino-nano-mini-pro-with-CH340G-on-mac-osx-yosemite.html). 
- With the board now setup, go to `Sketch > Include Library > Manage Libraries...` 
  and search for the ArduinoJson, then click on Install.

Go to `File -> New` to create a new sketch. 
The empty sketch defines two functions:
- `setup()` contains initialization code that is run once when the board is powered on.
- `loop()` is run repeatedly until the device is switched off.

To make debugging easier, we can enable debugging over a serial connection.

To do so, simply add the following to the `setup()` function:

```cpp
Serial.begin(115200);
```

and open `Tools > Serial Monitor` to see any output generated.

## Reading the sensor

To start with, we'll want to read the sensor.

The analog input pin is the one labelled `A0`, and a global variable of the
same name is defined. 

We need to initialize this as an input before we read from it:

```cpp
const int sensorPin = A0;

void setup() {
    Serial.begin(115200);

    // initialize sensor
    pinMode(sensorPin, INPUT);
}
```

Now in `loop()` we can use the function `analogRead(int pin)` to read the value
on the sensor and `Serial.printf()` to print the value.

The variable `readDelayMs` defines the amount of time between readings in milliseconds.

The value will be an integer between 0 and 1024 corresponding to the brightness level.

```cpp
const int readDelayMs = 10000;

void loop() {
    int level = analogRead(sensorPin);
    Serial.printf("Light level: %d\n", level);

    delay(readDelayMs);
}
```

If you build and upload the script now and look in the `Serial Monitor` window
you should see log lines, with the value changing as the light level changes e.g.

```
Light level: 270
Light level: 373
Light level: 384
```

## Connecting to WiFi

To submit this data to deepstreamHub we'll need an internet connection, and for
that we'll use the chip's builtin WiFi and networking functionality. 

Include the following headers:

```cpp
#include <ESP8266WiFiMulti.h>
#include <ESP8266HTTPClient.h>
```

Now we need to initialize the WiFi client, and wait for the connection to be
setup:

```cpp
ESP8266WiFiMulti WiFiMulti;

const char* ssid = "YOUR_NETWORK_SSID";
const char* password = "YOUR_NETWORK_PASSWORD";

void setup() {
    // ...

    // connect to WiFi
    WiFiMulti.addAP(ssid, password);
}

void loop() {
    if (WiFiMulti.run() != WL_CONNECTED) {
      delay(200);
      return;
    }

    // ...
}
```

## Building a request

We're going to be writing the light level into a
[record](/tutorials/core/datasync/records/) each time it's read, so let's create a
function called `updateRecord` that takes the level as an argument, and call it
in `loop()`.

```cpp
void loop() {
    // print level...
    updateRecord(level);
    // delay
}

void updateRecord(int level) {
    // ...
}
```

Now go create a free account through the deepstreamHub dashboard, create an
application and fetch an HTTP URL from the Application Details page.

`markdown:start-deepstream-server.md`

You'll also need to select the relevant TLS fingerprint that relates to the
subdomain in your HTTP URL, or you can follow 
[the instructions here](https://github.com/esp8266/Arduino/issues/2556#issuecomment-271372001)
to generate your own: 

```cpp
const char* deepstreamHubHttpUrl = "<YOUR HTTP URL>";
/*
 * Generated TLS fingerprints:
 *
 * 013.deepstreamhub.com: "3A:FC:6E:78:94:18:C0:A2:36:F3:C7:DF:86:27:4B:5A:CA:CF:28:3F"
 * 035.deepstreamhub.com: "57:18:5A:22:07:94:03:EF:90:C9:C2:56:58:C9:BB:06:66:A6:EA:76"
 * 154.deepstreamhub.com: "3C:65:CA:7C:3F:43:2D:FF:A1:63:38:F3:23:D5:59:25:E4:85:8C:0F"
 */
const char* deepstreamHubTlsFingerprint = "<YOUR HTTP DOMAIN FINGERPRINT>";
```

We have to create a new `HTTPClient` for each message, so we'll create that in
`updateRecord()` and make sure it's closed after.

```cpp
HTTPClient http;

// configure client
http.begin(deepstreamHubHttpUrl, deepstreamHubTlsFingerprint);

// ...

http.end();
```

The deepstreamHub HTTP API uses a JSON payload, so to help us build that we'll
include the `ArduinoJSON` library we installed earlier.

The body we're creating needs to look like this:
```json
{
  "topic": "record",
  "action": "write",
  "recordName": "readings/light-level",
  "path": "value",
  "data": 534 /* value read from the sensor */
}
```

Here's the code to do that:

```cpp
#include <ArduinoJson.h>

void updateRecord(int level) {
    // ...

    // create message body
    StaticJsonBuffer<200> bodyBuff;
    JsonObject& root = bodyBuff.createObject();
    JsonArray& body = root.createNestedArray("body");
    JsonObject& message = body.createNestedObject();
    message["topic"] = "record";
    message["action"] = "write";
    message["recordName"] = "readings/light-level";
    message["path"] = "value";
    message["data"] = level;

    // copy object into array
    size_t bodySize = bodyBuff.size();
    char requestBody[bodySize];
    root.printTo(requestBody, bodySize);
}
```

Now let's put this in a POST request:

```cpp
void updateRecord(int level) {
    // ...

    // set content type
    http.addHeader("Content-Type", "application/json");

    // make request
    int httpCode = http.POST(requestBody);
}
```

## Handling failure

There are three main ways the record update could fail:

- The request could fail e.g. a connection error
  In this case `httpCode` will be negative.

- The request could fail to parse or authenticate on the server.
  In this case `httpCode` will be a 4xx response.

- The record update could fail e.g. the Valve permissions to not allow writes
  In this case `httpCode` will be 200, but the JSON response will indicate a failure.

Let's handle those and log the outcome:

```cpp
void updateRecord(int level) {
    // ...

    if(httpCode == HTTP_CODE_OK) {
        // parse response
        String payload = http.getString();
        StaticJsonBuffer<200> respBuff;
        JsonObject& resp = respBuff.parseObject(payload);
        if (!resp["body"][0]["success"]) {
            // failed to update record
            Serial.printf("Record update error: %s\n", resp["body"][0]["error"]);
            return;
        }
        // record update success
        Serial.println("Record was updated successfully!");
    } else if (httpCode < 0) {
        Serial.printf("Request failed, error: %s\n", http.errorToString(httpCode).c_str());
    } else {
        Serial.printf("Error response %d: %s\n", httpCode, http.getString().c_str());
    }
}
```

Now let's set up the green LED to flash if the update is successful, the red LED otherwise:

```cpp
const int greenLed = D1;
const int redLed = D2;

void setup() {
    // ...

    // initialize LEDs
    pinMode(redLed, OUTPUT);
    pinMode(greenLed, OUTPUT);
    digitalWrite(redLed, LOW);
    digitalWrite(greenLed, LOW);
}

void flashLed(int led) {
    digitalWrite(led, HIGH);
    delay(500);
    digitalWrite(led, LOW);
}

void updateRecord(int level) {
    // httpCode will be negative on error
    if(httpCode == HTTP_CODE_OK) {
        // parse payload
        // ...
        if (!resp["body"][0]["success"]) {
            // failed to update record
            Serial.printf("Record update error: %s\n", resp["body"][0]["error"]);
            flashLed(redLed);
            return;
        }
        // record update success
        Serial.println("Record was updated successfully!");
        flashLed(greenLed);
    } else if (httpCode < 0) {
        Serial.printf("Request failed, error: %s\n", http.errorToString(httpCode).c_str());
        flashLed(redLed);
    } else {
        Serial.printf("Error response %d: %s\n", httpCode, http.getString().c_str());
        flashLed(redLed);
    }
}
```

## Subscribing to updates

Now let's display those updates as they happen using Javascript and log them to the console:

```html
<head>
    <script src="http://code.deepstream.io/js/latest/deepstream.min.js"></script>
    <script type="text/javascript">
      const ds = deepstream('<YOUR APP URL>')
      ds.login()
    
      const record = ds.record.getRecord('readings/light-level')
      record.subscribe('value', (value) => {
        console.log('Light level update:', value)
      })
    </script>
</head>
```

This simple setup has all the elements required to aggregate and display
readings from millions of incoming sensors.

For the full code, please take a look at the GitHub <a href="https://github.com/deepstreamIO/dsh-tutorial-http-iot">repository</a>.
