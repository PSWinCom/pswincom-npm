var http = require('https');
var xml2js = require("xml2js");
var encoding = require("encoding");

function makeRequestXml(options) {
  options.text = "" + encoding.convert(options.text, "Latin_1");
  
  var requestModel = {
    "SESSION": {
      "CLIENT": options.user,
      "PW": options.password,
      "MSGLST": {
        "MSG": options.receivers.map(function(rcv, i) {
          return {
            "ID": i+1,
            "TEXT": options.text,
            "SND": options.sender,
            "RCV": rcv
          };
        })
      },
    }
  };
  
  return new xml2js.Builder({}).buildObject(requestModel);
}

function responseHandler(receivers, callback) {
  return function (err, response) {
    if (typeof callback !== "function") return;
      
    var result = { logon: null, receivers: {} };
    if (response.SESSION.LOGON)
      result.logon = response.SESSION.LOGON;
    if (response.SESSION.MSGLST)
      if (response.SESSION.MSGLST.MSG) {
        var receiver, _i, _len;
        if (receivers.length > 1) {
          for (_i = 0, _len = receivers.length; _i < _len; _i++) {
            receiver = receivers[_i];
            if (result.receivers[receiver])
              receiver = receiver + "(" + response.SESSION.MSGLST.MSG[_i].ID + ")";
            result.receivers[receiver] = response.SESSION.MSGLST.MSG[_i].STATUS;
          }
        } else {
          result.receivers[receivers[0]] = response.SESSION.MSGLST.MSG.STATUS;
        }
      }
    callback(result);
  };
}

exports.sendsms = function (user, password, sender, receivers, message, done, error) 
{
  var body = makeRequestXml({
    user: user,
    password: password,
    sender: sender,
    receivers: receivers,
    text: message
  });

  var options = {
    hostname: process.env.PSW_GW_HOST || "gw2-fro.pswin.com",
    path: process.env.PSW_GW_PATH || "",
    port: process.env.PSW_GW_PORT || 8443,
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
        xml2js.parseString(response, { explicitArray: false }, responseHandler(receivers, done));
      });
  });

  req.on('error', function (e) {
    if (typeof error === "function")
      error(e);
  });

  req.write(body);
  req.end();
}