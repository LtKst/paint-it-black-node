/*
* Const variables
*/
const express = require('express');
const app = express();
const server = require('http').createServer(app);

const io = require('socket.io')(server);
const fs = require('fs');

const port = process.env.PORT || 3000;
const viewPath = __dirname + '/views/';

const jsonFile = 'drawing.json';

/*
* Other variables
*/
var sockets = [];

/*
* App
*/
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public/"));

app.get('/', (req, res) => {
  res.render(viewPath + "index");
  res.end();
});

/*
* Connection
*/
io.on('connection', (socket) => {
  // Push the socket into the sockets array
  sockets.push(socket);

  // Load the drawing
  fs.readFile(jsonFile, 'utf8', function (err, data) {
    if (err) {
      return console.log(err);
    }

    socket.emit("recieveUpdate", data);
  });

  // Listen for the drawing being edited
  socket.on('updateDrawing', (data) => {
    fs.writeFile(jsonFile, data, (err) => {
      if (err) {
        throw err;
      }

      console.log('Drawing has been saved');

      // Update the drawing for all sockets
      for (let i = 0; i < sockets.length; i++) {
        sockets[i].emit("recieveUpdate", data);
      }
    });
  });
});

/*
* Disconnection
*/
io.on('disconnect', (socket) => {
  sockets.splice(socket, 1);
});

/*
* Listen
*/
server.listen(port, () => {
  console.log("Using port: " + port);
});
