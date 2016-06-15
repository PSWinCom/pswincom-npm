PSWinCom Gateway node module
============================

node.js module for sending sms messages through PSWinCom SMS Gateway.

## Installation

    $ npm install pswincom-gateway

## Usage

The module exposes a single function called `sendSms` (aliased to `send_sms` and `sendsms` to suit your preference).

    var sendSms = require("pswincom-gateway").sendSms;

`sendSms` can be invoked in several ways

#### 1) Required arguments directly

    sendSms(user, passwd, sender, receivers, msg);

where `receivers` is an array of strings (phone numbers including country codes, with no leading zeros or plus sign).

#### 2) Optionally add a success handler

    sendSms(user, passwd, sender, receivers, msg,
      function(result) {
        console.log(result);
      });

#### 3) Optionally add an error handler

    sendSms(user, passwd, sender, receivers, msg,
      function(result) {
        console.log("SMS result: ", result);
      },
      function(error) {
        console.log("SMS error: ", error);
      });

#### 4) Probably the preferred way: using an object

in which case done and error are still optional

    sendSms({
      user: "YOUR_USERNAME", 
      password: "YOUR_PASSWORD", 
      sender: "YOUR_SENDER", 
      receivers: [ "RECEIVER_1" ], 
      message: "A test message",
      done: function(status) { 
        // ...
      }, 
      error: function(error) {
        // ...
      }
    });

When you pass your arguments as an object you may also add some extra arguments that are sometime usefull:

* `deliveryTime` [Date object] for delayed delivery
* `operation` [Number] for operation to perform on message (useful for [unicode messages](https://wiki.pswin.com/Gateway%20XML%20API.ashx#Unicode_messages_26))
* _more to come..._