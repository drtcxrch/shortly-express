const parseCookies = (req, res, next) => {
  let { cookie } = req.headers;

  if (!cookie) {
    req.cookies = {};
    next();
  } else {
    let result = {};
    cookie = cookie.split(';').map(item => item.split('='));

    for (let i = 0; i < cookie.length; i++) {
      let key = cookie[i][0].trim();
      let value = cookie[i][1].trim();

      result[key] = value;
    }
    req.cookies = result;
    next();
  }
};

module.exports = parseCookies;


