var twilio = require('twilio');
// Twilio Credentials 
var accountSid = 'AC916824b223fbd751400a19aca89f9276';
var authToken = 'fa94118cc2dbbcb076730d49dee970e8';
var twiliono = '+15672450149';

function makeCall(mobileno, message) {

    var client = new twilio.RestClient(accountSid, authToken);
    console.log("AuthCode:" + message);
    client.makeCall({
        to: mobileno,
        from: twiliono,
        url: 'http://trustcircledev.azure-mobile.net/api/opendata/gettwilioresponse/?code=' + message

    }, function (err, responseData) {
        console.log(responseData);
        console.log(err);
    });
};

function sendSMS(mobileno, message) {
    var client = new twilio.RestClient(accountSid, authToken);

    client.sendSms({
        to: mobileno,
        from: twiliono,
        body: message
    }, function (error, message) {

        // The "error" variable will contain error information, if any.
        // If the request was successful, this value will be "false"
        if (!error) {
            console.log('Success! The SID for this SMS message is: ' + message.sid);
            console.log('Message sent on: ' + message.dateCreated);
        } else {
            console.log('Oops! There was an error.');
            console.log(error);
        }
    });
};

function gettwilioresponse(message) {
    var resp = new twilio.TwimlResponse();
    resp.say({
        voice: 'woman'
    }, message);

    return resp.toString();
};

exports.sendSMS = sendSMS;
exports.makeCall = makeCall;
exports.gettwilioresponse = gettwilioresponse;