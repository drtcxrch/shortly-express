const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // console.log(req.body);

  if (!req.cookies.shortlyid) {
    // create a hash and store it in the sessions db.
    models.Sessions.create()
      // then retrieve the data from the sessions db.
      .then(data => models.Sessions.get({ id: data.insertId }))
      .then(databaseData => {
        // then store the hash in a sessions property under req
        req.session = databaseData;
        // and set the cookie to the header using res.cookie.
        res.cookie('shortlyid', req.session.hash);
        // console.log(databaseData);

        next();
      });

    // if a hash DOES exist...
  } else {
    // retrieve the data from the sessions db.
    models.Sessions.get({ hash: req.cookies.shortlyid })
      .then(databaseData => {
        if (databaseData && databaseData.userId !== null) {
          req.session = databaseData;

          console.log(req);
          models.Users.get({ id: databaseData.userId })
            .then(userData => {
              req.session.username = userData.username;
              next();
            });

          // if the data does NOT exist...
        } else {
          // repeat the steps taken when a hash did NOT exist above.
          models.Sessions.create()
            .then(data => models.Sessions.get({ id: data.insertId }))
            .then(databaseData => {
              req.session = databaseData;
              res.cookie('shortlyid', req.session.hash);
              next();
            });
        }
      });
  }
};


// accesses the parsed cookies on the request,
// looks up the user data related to that session,
// and assigns an object to a session property on the request that contains relevant user information. (Ask yourself: what information about the user
// would you want to keep in this session object?)

// CHECK! An incoming request with no cookies should generate a session with a unique hash and store it the sessions database.
// CHECK! The middleware function should use this unique hash to set a cookie in the response headers. (Ask yourself: How do I set cookies using Express?)

// CHECK! If an incoming request has a cookie, the middleware should verify that the cookie is valid (i.e., it is a session that is stored in your database).
// CHECK If an incoming cookie is not valid, what do you think you should do with that session and cookie?



//************************************************************/
// Add additional authentication middleware functions below
//************************************************************/

