var twilioutility = require('../shared/twilioutility.js');

exports.register = function (api) {
    api.post('gettwilioresponse', getTwilioResponse);
}


function getTwilioResponse(request, response) {
    response.set('Content-Type', 'text/xml');
    response.send(200, twilioutility.gettwilioresponse("Your authcode to sign into TrustCircle is " + request.query.code));
}