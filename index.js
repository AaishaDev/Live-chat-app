const http = require("http")
const express = require("express")
const cors = require("cors")
const socketio = require("socket.io");

const users = [{}]

const app=express();

const server = http.createServer(app);

app.use(cors())
app.get("/", (req, res)=>{
    res.send("Well its working")
})

const io = socketio(server);

io.on("connection", (socket)=>{
    console.log("New Connection");

    socket.on("joined", ({user})=>{
      users[socket.id]=user;
      console.log("user has joined : ", user);


      socket.emit("welcome",{user: "Admin :", message: `Welcome to chat ${users[socket.id]}`})

      socket.broadcast.emit("userJoined",{user: `${users[socket.id]}`})

    })

    socket.on("message",({message, id})=>{
      
        io.emit("sendMessage", {user:users[id], message:message,id:id})

    })

    socket.on("disconnect", ()=>{

        socket.broadcast.emit("userLeft", {user : `${users[socket.id]}`})
        console.log(`${users[socket.id]} has left`)
    })

   
})



const port = process.env.PORT


server.listen(port, ()=>{
    console.log("server running on", port);

})
