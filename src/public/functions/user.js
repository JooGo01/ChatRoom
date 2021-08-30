const userRoom = [];

// Join user to chat
function userJoin(id, username, room) {
  const user = { id, username, room };

  userRoom.push(user);

  return user;
}

// Get current user
function getCurrentUser(id) {
  return userRoom.find(user => user.id === id);
}

// User leaves chat
function userLeave(id) {
  const indexRoom = userRoom.findIndex(user => user.id === id);

  if (indexRoom !== -1) {
    return userRoom.splice(indexRoom, 1)[0];
  }
}

// Get room users
function getRoomUsers(room) {
  return userRoom.filter(user => user.room === room);
}

module.exports = {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
};