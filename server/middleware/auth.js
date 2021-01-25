const models = require('../models');
const Promise = require('bluebird');

module.exports.createSession = (req, res, next) => {
  // console.log(req.body);

  if (!req.cookies.shortlyid) {
    // create a hash and store it in the sessions db.
    // console.log('look at me ********* 1');
    models.Sessions.create()
      // then retrieve the data from the sessions db.
      .then(data => models.Sessions.get({ id: data.insertId }))
      .then(databaseData => {
        // then store the hash in a sessions property under req
        req.session = databaseData;
        // and set the cookie to the header using res.cookie.
        res.cookie('shortlyid', req.session.hash);
        next();
      });

    // if a hash DOES exist...
  } else {
    // retrieve the data from the sessions db.
    models.Sessions.get({ hash: req.cookies.shortlyid })
      .then(databaseData => {

        if (databaseData) {
          // console.log('look at me ********* 2');
          req.session = databaseData;
          next();

          // if the data does NOT exist...
        } else {
          // repeat the steps taken when a hash did NOT exist above.
          // console.log('look at me ********* 3');
          models.Sessions.create()
            .then(results => {
              models.Sessions.get({ id: results.insertId })
                .then(databaseData => {
                  req.session = databaseData;
                  res.cookie('shortlyid', databaseData.hash);
                  next();
                });
            });
        }
      });
  }
};


//************************************************************/
// Add additional authentication middleware functions below
//************************************************************/

module.exports.verifySession = (req, res, next) => {
  if (!models.Sessions.isLoggedIn(req.session)) {
    res.redirect('/login');
  } else {
    next();
  }
};

// LINKS AND CREATE!!!!! Add a verifySession helper function to all server routes that require login,
// CHECK!!!!! redirect the user to a login page as needed.
// Require users to log in to see shortened links and create new ones.
// Do NOT require the user to login when using a previously shortened link.

// Give the user a way to log out.
// What will this need to do to the server session and the cookie saved to the client's browser?
// we have to destroy the session and cookie

