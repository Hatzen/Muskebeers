function joinGame(){
    var data = {
        "name": $("#input-username").val()
    }
    if (data["name"] === "") return;

    $.post("/join-game", data, function(data) {
        if (data["status"] === "OK"){
            document.location.reload()
        }
    })
}