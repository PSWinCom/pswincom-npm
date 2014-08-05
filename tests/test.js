var gateway = require('./../gateway.js');  
gateway.sendsms({
  user: "", 
  password: "", 
  sender: "test", 
  receivers: [ "4711111111" ], 
  message: "A test message", 
  'done': function(status) { 
    console.log("Message sent with status: " + JSON.stringify(status));
    process.exit(0); 
  }, 
  'error': function(error) {
    console.log("Error sending: " + error);
    process.exit(1);
  }
});


/**

  OLD STYLE (v 1.0.1)
  -------------------

gateway.sendsms(
  "user", 
  "passwd", 
  "sender", 
  [ "4711111111" ], 
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
*/