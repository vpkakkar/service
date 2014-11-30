function generateCode(length) {
    var mask = '012345678901234567890123456789';
    var result = '';
    for (var i = length; i > 0; --i) {
        if (result.length > 0) {
            result += "%20";
        }
        result += mask[Math.round(Math.random() * (mask.length - 1))];
    }
    return result;
}

exports.generateVerificationCode = generateCode;