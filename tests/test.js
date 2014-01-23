var gateway = require('./../gateway.js');  
gateway.sendsms(
  "user", 
  "pass", 
  "test", 
  [ "4799999999" ], 
  "A test message", 
  function(status) { 
    console.log("Message sent with status: " + JSON.stringify(status));
    process.exit(0); 
  }, 
  function(error) {
    console.log("Error sending: " + error);
    process.exit(1);
  }
);