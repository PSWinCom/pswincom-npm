PSWinCom Gateway node module
============================

node.js module for sending sms messages through PSWinCom SMS Gateway.

## Installation

    $ npm install pswincom-gateway

## Usage

The module exposes a single function called `sendSms` (aliased to `send_sms` and `sendsms` to suit your preference).

    var sendSms = require("pswincom-gateway").sendSms;

`sendSms` can be invoked in several ways

    // 1) Required arguments directly
    gateway.sendsms(user, passwd, sender, receivers, msg);
    
    // 2) ... optionally add a success handler
    gateway.sendsms(user, passwd, sender, receivers, msg,
      function(result) {
        console.log(result);
      });
    
    // 3) ... and an error handler
    gateway.sendsms(user, passwd, sender, receivers, msg,
      function(result) {
        console.log("SMS result: ", result);
      },
      function(error) {
        console.log("SMS error: ", error);
      });
    
    // 4) ... or probably the preferred way; using an object
    //    in which case done and error are still optional
    gateway.sendsms({
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
