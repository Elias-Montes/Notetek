const User = require('./user');
const UserNotes = require('./notes');

User.hasMany(UserNotes, {
  foreignKey: 'user_id',
  onDelete: 'CASCADE'
});

UserNotes.belongsTo(User, {
  foreignKey: 'user_id'
});

module.exports = { User, UserNotes };