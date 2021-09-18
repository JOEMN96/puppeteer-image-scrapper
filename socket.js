import { Server } from "socket.io";

export default function ioInstance(server) {
  const io = new Server(server);

  io.on("connection", (socket) => {
    console.log("a user connected");
    socket.broadcast.emit("hi");
  });

  return io;
}
