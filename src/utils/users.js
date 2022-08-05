const users = [];

export const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username && !room) {
    return {
      error: "Username and room are required",
    };
  }
  const existingUser = users.find((user) => {
    return user.room === room && user.username === username;
  });
  if (existingUser) {
    return {
      error: "Username is in use!",
    };
  }

  const user = { id, username, room };
  users.push(user);
  return { user };
};

export const removeUser = (id) => {
  const index = users.findIndex((user) => {
    return user.id === id;
  });

  if (index !== -1) {
    return users.splice(index, 1)[0];
  }
};

export const getUser = (id) => {
  return users.find((user) => {
    return user.id === id;
  });
};

export const getUsersInRoom = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

// addUser({ id: 22, username: "Yogesh", room: "Lotus Zing" });
// addUser({ id: 33, username: "Jatin", room: "Lotus Zing" });
// addUser({ id: 44, username: "Himanshu", room: "Alpha" });
// addUser({ id: 55, username: "Piyush", room: "Alpha" });

// console.log(users);

// const remove = removeUser(22);
// console.log(remove);
// console.log(users);
// const user = getUser(44);
// console.log(user);
// const userList = getUsersInRoom("Lotus zing");
// console.log(userList);
