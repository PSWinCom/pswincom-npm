var http = require('https');
var xml2js = require("xml2js");
var encoding = require("encoding");

function date2timestamp(date) {
  return [
    date.getFullYear(), // YYYY
    ('0' + (date.getMonth() + 1)).slice(-2), // MM
    ('0' + date.getDate()).slice(-2), // DD
    ('0' + date.getHours()).slice(-2), // HH
    ('0' + date.getMinutes()).slice(-2), // mm 
    ].join("");
}

function makeRequestXml(options) {
  
  var requestModel = {
    "SESSION": {
      "CLIENT": options.user,
      "PW": options.password,
      "MSGLST": {
        "MSG": options.receivers.map(function(rcv, i) {
          return {
            "ID": i+1,
            "OP": options.operation || 1,
            "TEXT": options.message,
            "SND": options.sender,
            "RCV": rcv
          };
        })
      },
    }
  };
  
  if (options.deliveryTime) {
    var deliveryTimeStamp = date2timestamp(options.deliveryTime);
    requestModel.SESSION.MSGLST.MSG.forEach(function(m) {
      m.DELIVERYTIME = deliveryTimeStamp;
    });
  }
  
  return new xml2js.Builder({}).buildObject(requestModel);
}

function responseHandler(receivers, callback) {
  return function (err, response) {
    if (typeof callback !== "function") return;
      
    var result = { logon: null, receivers: {}, refs: {} };
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
            result.refs[receiver] = response.SESSION.MSGLST.MSG[_i].REF;
          }
        } else {
          result.receivers[receivers[0]] = response.SESSION.MSGLST.MSG.STATUS;
          result.refs[receivers[0]] = response.SESSION.MSGLST.MSG.REF;
        }
      }
    callback(result);
  };
}

function privateSendSms(smsOptions) {
  var body =  encoding.convert(makeRequestXml(smsOptions), "Latin_1");

  var httpOptions = {
    hostname: process.env.PSW_GW_HOST || "xml.pswin.com",
    path: process.env.PSW_GW_PATH || "",
    port: process.env.PSW_GW_PORT || 443,
    method: "POST",
    headers: { 
      "Content-Type": "text/xml",
      "Content-Length": body.length
    }
  }

  var response = "";

  var req = http.request(httpOptions, function(res) {
    res.setEncoding('utf8');
    res.on('data', function (chunk) {
      response += chunk;
    });
    res.on('end', function() {
      xml2js.parseString(response, { explicitArray: false }, responseHandler(smsOptions.receivers, smsOptions.done));
    });
  });

  req.on('error', function (e) {
    if (typeof smsOptions.error === "function")
      smsOptions.error(e);
  });

  req.write(body);
  req.end();
}

/***
 * Calling options:
 * 
 *  sendsms(user, password, sender, receivers, message);
 *  sendsms(user, password, sender, receivers, message, done);
 *  sendsms(user, password, sender, receivers, message, done, error);
 *  sendsms(args);
 * 
 **/
var sendsms = function (user, password, sender, receivers, message, done, error)
{
  if (arguments.length === 1)
    privateSendSms(user);
  else
    privateSendSms({
      user: user,
      password: password,
      sender: sender,
      receivers: receivers,
      message: message,
      done: done,
      error: error
    });
};

exports.sendsms = sendsms;
exports.sendSms = sendsms;
exports.send_sms = sendsms;
