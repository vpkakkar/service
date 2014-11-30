var utility = require('../shared/utility.js');
var twilioutility = require('../shared/twilioutility.js');

exports.register = function (api) {
    api.get('getregisteredfriends', getRegisteredFriends);
    api.post('register', register);
    api.post('confirm', confirm);
    api.post('syncContacts', syncContacts);
    api.post('getusernotifications', getUserNotifications);
    api.post('insertfeedback', insertFeedback);
    api.post('updateappuserprofile', updateAppUserProfile);
}

function register(request, response) {
    var mssql = request.service.mssql;
    var appuserid = request.body.appuserid;
    var verificationCode = "999999"; //utility.generateVerificationCode(6); //
    var re = new RegExp("%20", 'g');
    var cleanedVerificationCode = verificationCode.replace(re, "");
    var params = [request.body.mobileno, request.body.city, request.service.config.appSettings.MAX_REG_ATTMPTS, request.body.zipCode, cleanedVerificationCode, appuserid, request.body.countrycode];
    var sql = "exec dbo.tsp_RegisterUser ?, ?, ?, ?, ?, ?, ?";
    mssql.query(sql, params, {
        success: function (results) {
            var data = {};
            if (results[0].Result == 1) {
                data.issuccess = true;
                data.AppUserId = results[0].AppUserId;

                //                // send verification code
                //                if (request.body.verifymode == "SMS") {
                //                    var message = 'Your Auth Code to signup to TrustCircle is ' + cleanedVerificationCode;
                //                    twilioutility.sendSMS(request.body.isocode + request.body.mobileno, message);
                //                } else {
                //                    twilioutility.makeCall(request.body.isocode + request.body.mobileno, verificationCode);
                //                }

            } else {
                data.issuccess = false;
            }

            request.respond(statusCodes.OK, data);
        },
        error: function (error) {
            console.log(error);
        }
    });
};

function confirm(request, response) {
    var mssql = request.service.mssql;
    var params = [request.body.appUserId, request.body.verificationCode];
    var sql = "exec dbo.tsp_ConfirmUser ?, ?";
    mssql.query(sql, params, {
        success: function (results) {
            //console.log(results);
            var data = {};
            if (results[0].Result == 1) {
                data.issuccess = true;
            } else {
                data.issuccess = false;
            }
            request.respond(statusCodes.OK, data);
        },
        error: function (error) {
            console.log(error);
        }
    });
};

function syncContacts(request, response) {
    var mssql = request.service.mssql;
    var contacts = request.body.contacts;
    //console.log(contacts);
    var contactsxml = '<cs>';

    for (var i = 0; i < contacts.length; i++) {
        contactsxml += '<c>';
        contactsxml += '<n>' + contacts[i].name + '</n>';
        contactsxml += '<pno>' + contacts[i].phoneno.replace(" ", "").replace("-", "") + '</pno>';
        contactsxml += '<dr>' + contacts[i].contactid + '</dr>';
        contactsxml += '</c>';
    }

    contactsxml += '</cs>';
    console.log(contactsxml);

    var params = [request.body.appUserId, contactsxml, request.body.endofSync];
    var sql = "exec dbo.tsp_SyncUserFrens ?, ?, ?";
    mssql.query(sql, params, {
        success: function (results) {
            //console.log(results);
            var data = {};
            data.issuccess = true;
            request.respond(statusCodes.OK, data);
        },
        error: function (error) {
            console.log(error);
        }
    });
};

function getUserNotifications(request, response) {
    var mssql = request.service.mssql;
    var response = {};
    var params = [request.body.appuserid, request.body.recordsperpage, request.body.showunread, request.body.pageno];
    var sql = "exec dbo.tsp_GetAppUserNotifications ?, ?, ?, ?";
    mssql.query(sql, params, {
        success: function (results) {
            //console.log(results);
            response.issuccess = true;
            response.results = results;
            request.respond(statusCodes.OK, response);
        },
        error: function (error) {
            console.log(error);
            response.issuccess = false;
            response.error = error;
            request.respond(statusCodes.OK, response);
        }
    });
}

function insertFeedback(request, response) {
    var mssql = request.service.mssql;
    var response = {};
    var params = [request.body.appuserid, request.body.category, request.body.comment];
    var sql = "exec dbo.tsp_InsertFeedback ?, ?, ?";
    mssql.query(sql, params, {
        success: function (results) {
            //console.log(results);
            response.issuccess = true;
            response.results = results;
            request.respond(statusCodes.OK, response);
        },
        error: function (error) {
            console.log(error);
            response.issuccess = false;
            response.error = error;
            request.respond(statusCodes.OK, response);
        }
    });
}

function updateAppUserProfile(request, response) {
    var mssql = request.service.mssql;
    var response = {};
    var params = [request.body.appuserid, request.body.name];
    var sql = "exec dbo.tsp_UpdateAppUserProfile ?, ?";
    mssql.query(sql, params, {
        success: function (results) {
            //console.log(results);
            response.issuccess = true;
            response.results = results;
            request.respond(statusCodes.OK, response);
        },
        error: function (error) {
            console.log(error);
            response.issuccess = false;
            response.error = error;
            request.respond(statusCodes.OK, response);
        }
    });
}

function getRegisteredFriends(request, response) {
    var mssql = request.service.mssql;
    var response = {};
    var params = [request.query.appuserid];
    var sql = "exec dbo.tsp_GetAppUserRegisteredFrens ?";
    mssql.query(sql, params, {
        success: function (results) {
            //console.log(results);
            response.issuccess = true;
            response.results = results;
            request.respond(statusCodes.OK, response);
        },
        error: function (error) {
            console.log(error);
            response.issuccess = false;
            response.error = error;
            request.respond(statusCodes.OK, response);
        }
    });
}