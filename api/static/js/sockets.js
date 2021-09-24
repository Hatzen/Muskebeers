$(document).ready(function() {
    var socket = io();
    socket.on("connect", function() {
        create_log_entry("Connected to WebSocket")
        socket.emit("my event", {data: "I'm connected!"});
    });
    socket.on("disconnect", function() {
        create_log_entry("Disconnected!")
    });
    socket.on("welcome", function(data){
        create_log_entry(`Welcome from the Server: ${data}`)
    });
    socket.on("timed", function(data){
        create_log_entry(`${data}`)
    });
});

function create_log_entry(msg){
    var tr = document.createElement("tr")
    var td = document.createElement("td")
    td.appendChild(document.createTextNode(msg))
    tr.appendChild(td)
    document.getElementById("tbody").appendChild(tr)
}
