const socket = io();

socket.on("recieveUpdate", (data) => {
    readJson(data);
});

function updateDrawing(data) {
    socket.emit('updateDrawing', data);
}