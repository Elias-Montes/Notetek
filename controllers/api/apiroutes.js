// user routes that will allow you to create new accounts/get user
const router = require('express').Router();
const { User } = require('../../models');

router.post('/', async (req, res) => {
  try {
    const userData = await User.create(req.body);

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.status(200).json(userData);
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/login', async (req, res) => {
  try {
    const userData = await User.findOne({ where: { email: req.body.email } });

    if (!userData) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    const validPassword = await userData.checkPassword(req.body.password);

    if (!validPassword) {
      res
        .status(400)
        .json({ message: 'Incorrect email or password, please try again' });
      return;
    }

    req.session.save(() => {
      req.session.user_id = userData.id;
      req.session.logged_in = true;

      res.json({ user: userData, message: 'You are now logged in!' });
    });
  } catch (err) {
    res.status(400).json(err);
  }
});

router.post('/logout', (req, res) => {
  if (req.session.logged_in) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});


// delete note route
router.delete('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;

    if (!req.session.logged_in) {
      res.status(401).json({ message: 'You must be logged in to delete a note.' });
      return;
    }
    
    if (!note) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    if (note.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to delete this note.' });
      return;
    }
    
    const deleteNote = await Note.delete({
      title,
      content,
      user_id: req.session.user_id,
    });
    res.status(201).json(deleteNote);
    } catch (err) {
      res.status(400).json(err);
    }
});

// get notes
router.get('/notes/:id', async (req, res) => {
  try {
    const noteId = req.params.id;

    // Ensure the user is logged in to get the note (you can modify this as per your authentication mechanism)
    if (!req.session.logged_in) {
      res.status(401).json({ message: 'You must be logged in to get a note.' });
      return;
    }

    const note = await Note.findByPk(noteId);

    // Check if the note exists
    if (!note) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    // Check if the logged-in user owns the note
    if (note.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to get this note.' });
      return;
    }

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});
// new note(post)
router.post('/notes', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Ensure the user is logged in to create a note (you can modify this as per your authentication mechanism)
    if (!req.session.logged_in) {
      res.status(401).json({ message: 'You must be logged in to create a note.' });
      return;
    }

    const newNote = await Note.create({
      title,
      content,
      user_id: req.session.user_id, // Associate the note with the logged-in user
    });

    res.status(201).json(newNote);
  } catch (err) {
    res.status(400).json(err);
  }
});

// update note route (put)
router.put('/notes/:id', async (req, res) => {
  try {
    const { title, content } = req.body;
    const noteId = req.params.id;

    // Ensure the user is logged in to update the note (you can modify this as per your authentication mechanism)
    if (!req.session.logged_in) {
      res.status(401).json({ message: 'You must be logged in to update a note.' });
      return;
    }

    const note = await Note.findByPk(noteId);

    // Check if the note exists
    if (!note) {
      res.status(404).json({ message: 'Note not found.' });
      return;
    }

    // Check if the logged-in user owns the note
    if (note.user_id !== req.session.user_id) {
      res.status(403).json({ message: 'You are not authorized to update this note.' });
      return;
    }

    // Update the note
    note.title = title;
    note.content = content;
    await note.save();

    res.status(200).json(note);
  } catch (err) {
    res.status(400).json(err);
  }
});

module.exports = router;