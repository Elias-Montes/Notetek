const router = require('express').Router();
const { Note } = require('../models');
// get route for home page
router.get('/', async (req, res) => {
  try {
    //   res is related to handlebars
    // if user is already logged in
    if (req.session.logged_in) {
      res.render('homepage');
    } else {
      res.render('login');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
router.get('/note', async (req, res) => {
  try {
    const noteData = await Note.findAll({
      where: {user_id:req.session.user_id}
    });
    const userNotes = noteData.map((notes) => notes.get({ plain: true }));
    console.log(userNotes)
    if (req.session.logged_in) {
      res.render('note', {
        userNotes,
        logged_in: req.session.logged_in
      });
    } else {
      res.render('login');
    }
  } catch (err) {
    res.status(500).json(err);
  }
});
module.exports = router;
