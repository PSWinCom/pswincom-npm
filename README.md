pswincom-npm
============

node module for sending sms messages through pswincom gateway


´´´
var gateway=require("pswincom-gateway");
gateway.sendsms("username", "password", "test", [ "4799999999" ], "A test message", function(result) { console.log(result);})
´´´