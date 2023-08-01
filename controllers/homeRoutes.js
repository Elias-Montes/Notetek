const router = require('express').Router();
// get route for home page
router.get('/', async (req, res) => {
  try {
    //   res is related to handlebars
    // if user is already logged in
    if (req.session.loggedIn) {
      res.render('homepage');
    } else {
      res.render('login');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
