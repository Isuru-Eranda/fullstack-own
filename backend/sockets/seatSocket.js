module.exports = (io) => {
  io.on("connection", socket => {
    console.log("User connected:", socket.id);

    socket.on("joinShow", showId => {
      socket.join(showId);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
