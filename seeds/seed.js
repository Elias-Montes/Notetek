require('dotenv').config();
const sequelize = require('../config/connection');
const { User, UserNotes } = require('../models');

const userData = require('./userData.json');
const noteData = require('./userNotes.json');

const seedDatabase = async () => {
  await sequelize.sync({ force: true });

  const users = await User.bulkCreate(userData, {
    individualHooks: true,
    returning: true,
  });

  for (const note of noteData) {
    await UserNotes.create({
      ...note,
      user_id: users[Math.floor(Math.random() * users.length)].id,
    });
  }

  process.exit(0);
};

seedDatabase();
