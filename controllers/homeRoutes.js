const router = require('express').Router();

// get route for home page
router.get('/', async (req, res) => { 
    try {
      // Get all projects and JOIN with user data
    //   res is related to handlebars 
      res.render('homepage');
    } catch (err) {
      res.status(500).json(err);
    }
  });

  module.exports = router;
