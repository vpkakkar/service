var twilioutility = require('../shared/twilioutility.js');

exports.register = function (api) {
    api.get('getCities', getCities);
    api.get('getCategories', getCategories);
    api.get('gettwilioresponse', getTwilioResponse);
    api.post('getSubCategories', getSubCategories);
}

function getCities(request, response) {
    var mssql = request.service.mssql;
    var sql = "SELECT * FROM City CT " +
        "INNER JOIN Country C ON CT.CountryId = C.Id " +
        "WHERE C.Code = '" + request.query.country + "'";
    mssql.query(sql, {
        success: function (results) {
            response.send(statusCodes.OK, results);
        },
        error: function (error) {
            response.send(statusCodes.OK, error);
        }
    });
    //response.send(statusCodes.OK, { message : 'Hello World!' });
};

function getCategories(request, response) {
    var mssql = request.service.mssql;
    var sql = "SELECT C1.Name, C2.Name AS ParentCatName FROM Category C1 " +
        "INNER JOIN Category C2  ON C1.ParentCatId = C2.Id " +
        "WHERE ISNULL(C1.ParentCatId,0) <> 0 ORDER BY C2.Name ASC";
    mssql.query(sql, {
        success: function (results) {
            response.send(statusCodes.OK, results);
        },
        error: function (error) {
            response.send(statusCodes.OK, error);
        }
    });
    //response.send(statusCodes.OK, { message : 'Hello World!' });
};

function getSubCategories(request, response) {
    var mssql = request.service.mssql;
    var params = [request.body.catname];
    var sql = "exec dbo.tsp_GetSubCatsbyCatName ?";
    mssql.query(sql, params, {
        success: function (results) {
            response.send(statusCodes.OK, results);
        },
        error: function (error) {
            response.send(statusCodes.OK, error);
        }
    });
    //response.send(statusCodes.OK, { message : 'Hello World!' });
};

function getTwilioResponse(request, response) {
    response.set('Content-Type', 'text/xml');
    response.send(200, twilioutility.gettwilioresponse("Your authcode to sign into TrustCircle is " + request.query.code));
}