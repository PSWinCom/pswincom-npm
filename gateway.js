ar http = require('http');
var parsestring = require("xml2js").parseString;

exports.sendsms = function (user, password, sender, receivers, message, done, error) 
{
  var messagelist = "";

  for(i in receivers) {
    messagelist = messagelist + "    <MSG>" +
    "      <ID>" + (parseInt(i) + 1) + "</ID>" +
    "      <TEXT>" + message + "</TEXT>" +
    "      <SND>" + sender + "</SND>" +
    "      <RCV>" + receivers[i] + "</RCV>" +
    "    </MSG>";
  }

  var body = 
    "<?xml version=\"1.0\"?>" +
    "<SESSION>" +
    "  <CLIENT>" + user + "</CLIENT>" +
    "  <PW>" + password + "</PW>" +
    "  <MSGLST>" +
    messagelist +
    "  </MSGLST>" +
    "</SESSION>";

  var options = {
    hostname: "https://gw2-fro.pswin.com",
    path: "",
    port: 8443,
    method: "POST",
    headers: { 
      "Content-Type": "text/xml",
      "Content-Length": Buffer.byteLength(body, "iso-8859-1")
    }
  }

  var response = "";

  var req = http.request(options, function(res) {
      res.setEncoding('utf8');
      res.on('data', function (chunk) {
        response += chunk;
      });
      res.on('end', function() {
        parsestring(response, { explicitArray: false }, function(err, xml) {
          if (typeof done === "function") 
            done(xml.SESSION.MSGLST.MSG.STATUS);
        });
      });
  });

  req.on('error', function (e) {
    if (typeof error === "function")
      error(e);
  });

  req.write(body);
  req.end();
}