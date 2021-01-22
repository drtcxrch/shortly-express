const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // checks to see if there is a hash
  let hash = req.cookies.shortlyid;

  // if there is no hash one is created
  if (!hash) {
    models.Sessions.create()
      // then we use the insertId to retrieve the hash that was created from the sessions table
      // the sessions table has 2 columns id and hash, by using insertId we should be able to get the hash back
      .then(results => models.Sessions.get({ id: results.insertId }))
      // need to find a way set a cookie in the response header?!?!
      // https://www.geeksforgeeks.org/express-js-res-cookie-function/
      .then(data => res.cookie('shortlyid', data.hash));
    next();
  } else {
    models.Sessions.get({ hash })
      .then(hasSession => {
        if (hasSession) {
          res.cookie('shortlyid', hasSession.hash);
          next();
        } else {
          models.Sessions.create()
            .then(results => models.Sessions.get({ id: results.insertId }))
            .then(data => res.cookie('shortlyid', data.hash));
          next();
        }
      });
  }
};



// accesses the parsed cookies on the request,
// looks up the user data related to that session,
// and assigns an object to a session property on the request that contains relevant user information. (Ask yourself: what information about the user
// would you want to keep in this session object?)

// CHECK! An incoming request with no cookies should generate a session with a unique hash and store it the sessions database.
// CHECK! I think?!?!?! The middleware function should use this unique hash to set a cookie in the response headers. (Ask yourself: How do I set cookies using Express?).

// CHECK! If an incoming request has a cookie, the middleware should verify that the cookie is valid (i.e., it is a session that is stored in your database).
// CHECK !If an incoming cookie is not valid, what do you think you should do with that session and cookie?



//************************************************************/
// Add additional authentication middleware functions below
//************************************************************/

