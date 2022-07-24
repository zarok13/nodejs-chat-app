const users = [];
// addUser, removeUser, getUser, getUsersInRoom

// addUser
const addUser = ({id, username, room}) => {
    // clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // validate the data
    if(!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username;
    });

    // validate username
    if(existingUser) {
        return  {
            error: 'Username is in use'
        }
    }

    // store user
    const user = { id, username, room };
    users.push(user);

    return {user};
}
// removeUser
const removeUser = (id) => {
    const index = users.findIndex((user)=>user.id === id);

    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}
//getUser
const getUser = (id) => {
    const user = users.find((user)=>user.id === id);
    return user;
}
//getUsersInUsers
const getUsersInUsers = (room) => {
    room = room.trim().toLowerCase();

    if(!room) {
        return {
            error: 'room is required!'
        }
    }
    return users.filter((user) => {
        return user.room === room;
    });
}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInUsers
}