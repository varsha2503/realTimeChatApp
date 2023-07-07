const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoute");
const socket = require("socket.io");


const app = express();
require("dotenv").config();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes );
app.use("/api/messages", messageRoutes);


const server = app.listen(process.env.PORT, () => {
  console.log(`Server started on ${process.env.PORT}`)
});

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });


const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();


io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
    socket.broadcast.emit("")
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});


// // io.on("connection", (socket) => {
// //   global.chatSocket = socket;
  
// //   socket.on("add-user", (userId) => {
// //     onlineUsers.set(userId, socket.id);
// //     io.emit("user-added", userId); // Notify all connected clients that a new user has been added
// //   });

// //   socket.on("send-msg", (data) => {
// //     if (data.group) {
// //       // Broadcast the message to all connected clients (group chat)
// //       io.emit("msg-receive", { from: data.from, msg: data.msg });
// //     } else {
// //       const sendUserSocket = onlineUsers.get(data.to);
// //       if (sendUserSocket) {
// //         socket.to(sendUserSocket).emit("msg-receive", { from: data.from, msg: data.msg });
// //       }
// //     }
// //   });

// //   socket.on("disconnect", () => {
// //     // Remove the user from the onlineUsers map when they disconnect
// //     let disconnectedUserId = null;
// //     for (const [userId, socketId] of onlineUsers.entries()) {
// //       if (socketId === socket.id) {
// //         disconnectedUserId = userId;
// //         onlineUsers.delete(userId);
// //         break;
// //       }
// //     }
// //     if (disconnectedUserId) {
// //       io.emit("user-disconnected", disconnectedUserId); // Notify all connected clients that a user has been disconnected
// //     }
// //   });
// // });







// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const userRoutes = require("./routes/userRoutes");
// const messageRoutes = require("./routes/messageRoute");
// const socket = require("socket.io");

// const app = express();
// require("dotenv").config();

// app.use(cors());
// app.use(express.json());

// app.use("/api/auth", userRoutes);
// app.use("/api/messages", messageRoutes);

// const server = app.listen(process.env.PORT, () => {
//   console.log(`Server started on ${process.env.PORT}`);
// });

// mongoose
//   .connect(process.env.MONGO_URL, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => {
//     console.log("DB Connection Successful");
//   })
//   .catch((err) => {
//     console.log(err.message);
//   });

// const io = socket(server, {
//   cors: {
//     origin: "http://localhost:3000",
//     credentials: true,
//   },
// });

// const onlineUsers = new Map();

// io.on("connection", (socket) => {
//   socket.on("add-user", (userId) => {
//     onlineUsers.set(userId, socket.id);
//     io.emit("user-added", userId); // Notify all connected clients that a new user has been added
//   });

//   socket.on("send-msg", (data) => {
//     if (data.group) {
//       // Broadcast the message to all connected clients (group chat)
//       io.emit("msg-receive", { from: data.from, msg: data.msg });
//     } else {
//       const sendUserSocket = onlineUsers.get(data.to);
//       if (sendUserSocket) {
//         socket.to(sendUserSocket).emit("msg-receive", { from: data.from, msg: data.msg });
//       }
//     }
//   });

//   socket.on("disconnect", () => {
//     let disconnectedUserId = null;
//     for (const [userId, socketId] of onlineUsers.entries()) {
//       if (socketId === socket.id) {
//         disconnectedUserId = userId;
//         onlineUsers.delete(userId);
//         break;
//       }
//     }
//     if (disconnectedUserId) {
//       io.emit("user-disconnected", disconnectedUserId); // Notify all connected clients that a user has been disconnected
//     }
//   });
// });

// // Start the server
// server.listen(process.env.PORT, () => {
//   console.log(`Server started on port ${process.env.PORT}`);
// });
