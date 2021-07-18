var net = require("net");
const Stream = require("stream");

// creates the server
var server = net.createServer();

let sendData = [
  "L1",
  "R3",
  "L3",
  "R5",
  "L7",
  "R7",
  "L8",
  "R9",
  "L6",
  "R6",
  "L5",
  "R3",
  "L3",
  "R5",
  "L7",
  "R7",
  "L5",
  "R5",
  "L6",
  "R6",
  "L1",
  "R3",
  "L3",
  "R5",
  "L7",
  "R7",
  "L9",
  "R9",
  "L6",
  "R6",
  "L1",
  "R3",
  "L3",
  "R5",
  "L7",
  "R7",
  "L2",
  "R2",
  "L6",
  "R6",
];

const buffer = Buffer.from(sendData);

// emitted when new client connects
server.on("connection", function (socket) {
  console.log("Server on 'connection'");

  //this property shows the number of characters currently buffered to be written. (Number of characters is approximately equal to the number of bytes to be written, but the buffer may contain strings, and the strings are lazily encoded, so the exact number of bytes is not known.)
  //Users who experience large or growing bufferSize should attempt to "throttle" the data flows in their program with pause() and resume().

  // console.log('Buffer size : ' + socket.bufferSize);

  // console.log('---------server details -----------------');

  // var address = server.address();
  // var port = address.port;
  // var family = address.family;
  // var ipaddr = address.address;
  // console.log('Server is listening at port ' + port);
  // console.log('Server ip : ' + ipaddr);
  // console.log('Server is IP4/IP6 : ' + family);

  // var lport = socket.localPort;
  // var laddr = socket.localAddress;
  // console.log('Server is listening at LOCAL port ' + lport);
  // console.log('Server LOCAL ip : ' + laddr);

  // console.log('------------remote client info --------------');

  // var rport = socket.remotePort;
  // var raddr = socket.remoteAddress;
  // var rfamily = socket.remoteFamily;

  // console.log('REMOTE Socket is listening at port' + rport);
  // console.log('REMOTE Socket ip :' + raddr);
  // console.log('REMOTE Socket is IP4/IP6 : ' + rfamily);

  // console.log('--------------------------------------------')
  //var no_of_connections =  server.getConnections(); // sychronous version
  server.getConnections(function (error, count) {
    console.log("Number of concurrent connections to the server : " + count);
  });

  socket.setEncoding("utf8");

  socket.setTimeout(800000, function () {
    // called after timeout -> same as socket.on('timeout')
    // it just tells that soket timed out => its ur job to end or destroy the socket.
    // socket.end() vs socket.destroy() => end allows us to send final data and allows some i/o activity to finish before destroying the socket
    // whereas destroy kills the socket immediately irrespective of whether any i/o operation is goin on or not...force destry takes place
    console.log("Socket timed out");
  });

  socket.on("connect", function (data) {
    console.log("Connect sent from client");
  });

  socket.on("data", function (data) {
    var bread = socket.bytesRead;
    var bwrite = socket.bytesWritten;
    // console.log('Bytes read: ' + bread);
    // console.log('Bytes written: ' + bwrite);
    //console.log('Data sent to server: ' + data);

    if (data == "M1") {
      console.log("Set M1");
    } else if (data == "exit") {
      console.log("Close connection");
      socket.end();
      //server.close();
    } else {
      //echo data
      // var is_kernel_buffer_full = socket.write("Data:" + data);
      // if (is_kernel_buffer_full) {
      //   console.log(
      //     "Data was flushed successfully from kernel buffer i.e written successfully!"
      //   );
      // } else {
      //   socket.pause();
      // }
    }
  });

  socket.on("drain", function () {
    console.log(
      "write buffer is empty now .. u can resume the writable stream"
    );
    socket.resume();
  });

  socket.on("error", function (error) {
    console.log("Error : " + error);
  });

  socket.on("timeout", function () {
    console.log("Socket timed out !");
    socket.end("Timed out!");
    // can call socket.destroy() here too.
  });

  socket.on("end", function (data) {
    console.log("Socket ended from other end!");
    console.log("End data : " + data);
  });

  socket.on("close", function (error) {
    // var bread = socket.bytesRead;
    // var bwrite = socket.bytesWritten;
    // console.log('Bytes read : ' + bread);
    // console.log('Bytes written : ' + bwrite);
    console.log("Socket closed from on close");
    if (error) {
      console.log("Socket was closed coz of transmission error");
    }
  });

  // setTimeout(function(){
  //   var isdestroyed = socket.destroyed;
  //   console.log('Socket destroyed:' + isdestroyed);
  //   socket.destroy();
  // },12000000);

  function send() {
    // const readable = new Stream.Readable();
    // readable.pipe(process.stdout);
    // sendData.forEach((item) => readable.push(item));
    // // no more data
    // readable.push(null);
    //socket.write(buffer);

    let data = sendData.pop();
    console.log("sending data: ", data);
    if (data == undefined) {
      clearInterval(handle);
      return;
    } else socket.write(data);
  }

  let handle = setInterval(send, 500);
});

//emitted when server closes ...not emitted until all connections closes.
server.on("close", function () {
  console.log("Server closed !");
});

// emits when any error occurs -> calls closed event immediately after this.
server.on("error", function (error) {
  console.log("Error: " + error);
});

//emits when server is bound with server.listen
server.on("listening", function () {
  console.log("Server is listening!");
});

server.maxConnections = 10;

//static port allocation
//server.listen(2222);

server.listen({ port: 2222, host: "127.0.0.1", reuseAddress: true });

//for dyanmic port allocation
// server.listen({ port: 2222, host: '127.0.0.1', reuseAddress: true },
// function(){
//   var address = server.address();
//   var port = address.port;
//   var family = address.family;
//   var ipaddr = address.address;
//   console.log('Server is listening at port' + port);
//   console.log('Server ip :' + ipaddr);
//   console.log('Server is IP4/IP6 : ' + family);
// });

var islistening = server.listening;

if (islistening) {
  console.log("Server is listening");
} else {
  console.log("Server is not listening");
}

// setTimeout(function(){
//   server.close();
// },50000000);
