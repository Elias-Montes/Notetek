const router = require('express').Router();

const userRoutes = require('./userRoutes');
const notesRoutes = require('./notesRoutes');

router.use('/user', userRoutes);
router.use('/notes', notesRoutes);

module.exports = router;
