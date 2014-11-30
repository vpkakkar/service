 exports.register = function (api) {
     api.get('getdetails', getdetails);
     api.get('getdetailsbyid', getdetailsbyid);
     api.get('getcontactreviewsbyid', getcontactreviewsbyid);
     api.get('getmanagedcontacts', getmanagedcontacts);
     api.get('getusernotifications', getuserNotifications);
     api.get('insertcontactedlog', insertcontactedlog);
     api.post('search', search);
     api.post("bulksave", bulksave);
     api.post("insertcontactreview", insertcontactreview);
     api.post("updatecontact", updatecontact);
     api.post("manageuserfavoritecontact", manageUserFavoriteContact);

 }

 function getdetails(request, response) {
     var mssql = request.service.mssql;
     var params = [request.query.mobileno];
     var sql = "exec dbo.tsp_GetTrustedContactDetails ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function getmanagedcontacts(request, response) {
     var mssql = request.service.mssql;
     var params = [request.query.appuserid, request.query.searchtext];
     var sql = "exec dbo.tsp_GetManagedContactsByAppUserId ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function getdetailsbyid(request, response) {
     var mssql = request.service.mssql;
     var params = [request.query.contactid, request.query.appuserid];
     var sql = "exec dbo.tsp_GetContactDetailsByContactId ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function getcontactreviewsbyid(request, response) {
     var mssql = request.service.mssql;
     var params = [request.query.contactid, request.query.appuserid];

     var sql = "exec dbo.tsp_GetReviewsdByContactId ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             console.log(error);
             response.send(statusCodes.OK, error);
         }
     });
 };

 function insertcontactreview(request, response) {
     var mssql = request.service.mssql;
     var params = [request.body.contactreview.appuserid, request.body.contactreview.contactid, request.body.contactreview.rating, request.body.contactreview.comment];

     var sql = "exec dbo.tsp_InsertContactReview ?, ?, ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             console.log(error);
             response.send(statusCodes.OK, error);
         }
     });
 };

 function bulksave(request, response) {
     var mssql = request.service.mssql;

     var contactsXml = '';

     if (request.body.contacts != null && request.body.contacts.length > 0) {
         contactsXml = '<tcs>';
         //console.log(request.body.contacts.length);
         for (var i = 0; i < request.body.contacts.length; i++) {
             contactsXml += '<tc>';

             contactsXml += '<n>' + request.body.contacts[i].name + '</n>';
             contactsXml += '<pno>' + request.body.contacts[i].phoneno + '</pno>';
             contactsXml += '<ci>' + request.body.contacts[i].city + '</ci>';
             contactsXml += '<zc>' + request.body.contacts[i].zipcode + '</zc>';
             contactsXml += '<rt>' + request.body.contacts[i].rating + '</rt>';
             contactsXml += '<cmnt>' + request.body.contacts[i].comment + '</cmnt>';
             contactsXml += '<ctgy>' + request.body.contacts[i].category + '</ctgy>';

             contactsXml += '</tc>';
         }
         contactsXml += '</tcs>';
         //console.log(request.body.appuserid);
         //console.log(contactsXml);
         var params = [request.body.appuserid, contactsXml];
         var sql = "exec dbo.tsp_SaveBulkTrustedContacts ?, ?";
         mssql.query(sql, params, {
             success: function (results) {
                 //console.log(results);
                 response.send(statusCodes.OK, results);
             },
             error: function (error) {
                 console.log(error);
                 response.send(statusCodes.OK, error);
             }
         });
     }
 };


 function search(request, response) {
     var mssql = request.service.mssql;
     var searchparams = request.body.searchparams;
     var contacts = '';

     if (searchparams.contacts != null && searchparams.contacts.length > 0) {
         contacts = '<cs>';

         for (var i = 0; i < searchparams.contacts.length; i++) {
             contacts += '<id>' + searchparams.contacts[i].id + '</id>';
         }

         contacts += '</cs>';
     }

     var params = [searchparams.appuserid, searchparams.city, searchparams.zipcode, searchparams.category, contacts, searchparams.searchtext];

     var sql = "exec dbo.tsp_SearchContacts ?, ?, ?, ?, ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function updatecontact(request, response) {
     var mssql = request.service.mssql;
     var contactdetails = request.body.contactdetails;

     var params = [request.body.appuserid, contactdetails.id, contactdetails.FirstName, contactdetails.phoneno, contactdetails.city, contactdetails.countrycode, contactdetails.zipcode, contactdetails.category, null];

     var sql = "exec dbo.tsp_UpdateContact ?, ?, ?, ?, ?, ?, ?, ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function manageUserFavoriteContact(request, response) {
     var mssql = request.service.mssql;

     var params = [request.body.appuserid, request.body.contactid, request.body.isfavorite];

     var sql = "exec dbo.tsp_ManageUserFavoriteContact ?, ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function getuserNotifications(request, response) {
     var mssql = request.service.mssql;

     var params = [request.query.appuserid, request.query.recordsperpage, request.query.showunread, request.query.pageno];

     var sql = "exec dbo.tsp_GetAppUserNotifications ?, ?, ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };

 function insertcontactedlog(request, response) {
     var mssql = request.service.mssql;

     var params = [request.query.appuserid, request.query.contactid, request.query.phoneno];

     var sql = "exec dbo.tsp_InsertContactedLog ?, ?, ?";
     mssql.query(sql, params, {
         success: function (results) {
             response.send(statusCodes.OK, results);
         },
         error: function (error) {
             response.send(statusCodes.OK, error);
         }
     });
 };