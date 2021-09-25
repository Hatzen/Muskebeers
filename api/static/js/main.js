/**
 * DEV Fields
 */
 var credits = 10;
 var counter = 0;
 
 /**
  * Implementation
  */
 
 const QRCODE_VIDEO_ID = "QRCODE_VIDEO_ID"
 
 var currentQuestion = null;
 var qrScanner = null;
 
 $(document).ready(function(){
     $.get("/active-question", function(data){
         if (data.status === "OK"){
             currentQuestion = data.question
         }else{
             console.error(data.status)
         }
     })
 })

 function initView () {
    setMainContent(getHTMLCodeForQuestion())
    requestNextQuestion()
 }

 /**
  * 
  * @param {longitude: double, latitude: double} location 
  */
 function updateGeoLocation (location) {
    if (currentQuestion == null) {
        console.error("Current question is null! UpdateGeoLocation cannot calculate distance.");
        return
    }
    console.info(`Current Location: ${location.longitude}-${location.latitude}`)
    let targetLongitude = currentQuestion.geometry.coordinates[0];
    let targetLatitude = currentQuestion.geometry.coordinates[1];
    let distanceToQuestionTarget = Math.abs(getDistanceFromLatLonInKm(location.longitude, location.latitude, targetLongitude, targetLatitude));
    console.info(`Current Distance: ${distanceToQuestionTarget}`)
    if (distanceToQuestionTarget <= currentQuestion.properties.buffer) {
        requestCheckpointReached(function () {
            if (currentQuestion.alreadyReached == true ) {
                currentQuestion.alreadyReached = true;
                credits += 5;
                alert("Ziel erreicht! Scanne den QrCode oder gehe weiter zur nächsten Frage!")
                alert("Du hast 5 Credits erhalten");
            }
        })
    }
    let currentColor = getColorForValue(distanceToQuestionTarget);
    $("body").css({'background-color': currentColor});
 }

 /**
  * 
  * @param {double} value value between 0 and infinity 
  */
 function getColorForValue (value) {
    var x = 2 * Math.min(value, MUENSTER_RELEVANT_RADIUS_IN_KM) / MUENSTER_RELEVANT_RADIUS_IN_KM - 1
    let normalizedValue = 0.5 * (1 + x / (1 + x**5));
    return getColor(normalizedValue);
 }

 /**
  * @param {double} value from 0 green to 0.5 yellow to 1 red
  * @returns color string
  */
 function getColor(value){
    // var hue=((1-value)*120).toString(10);
    return `rgba(${255*(1-value)}, 0, ${255*value})`
}

 function receivedNewQuestion (question) {
    currentQuestion = question;
    if (isGeoLocationSupported()) {
        watchPosition(updateGeoLocation);
        setMainContent(getHTMLCodeForQuestion());
    }else{
        console.warn("GeoLocation is not Supported!")
    }
 }
 
 async function requestNextQuestion () {
    getCurrentPosition(function (position) {
        let location = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        };
        requestNewQuestionByServer(location, receivedNewQuestion);
    });
 }
 
 function setMainContent(htmlCode) {
     if (!isGeoLocationSupported()) {
        $("main").html('<center> Please enable location detection</center>');
     }
     if ($("#" + QRCODE_VIDEO_ID).length) {
        deinitQrCodeScanner();
     }
     $("main").html(htmlCode);

     // When there is a video element we have the qr view activated.
     if ($("#" + QRCODE_VIDEO_ID).length) {
         initQrCodeScanner();
     }
     if ($("#highscore") !== null){
        requestCurrentScore()
        updateUserScore()
     }
     hideMenu();
 }
 
 function initQrCodeScanner() {
     const videoElem = $("#" + QRCODE_VIDEO_ID).get(0)
     // TODO: This leads to an error 
     // 1523qr-scanner.umd.min.js:14 DOMException: Failed to construct 'Worker': Script at 'file:///C:/Users/kaiha/Desktop/mshack/Muskebeers/app/qr-scanner-worker.min.js' cannot be accessed from origin 'null'.
     // Because chrome doesnt let you run workers on local files.
     // https://stackoverflow.com/a/23206866/8524651
    QrScanner.WORKER_PATH = "../static/js/qr-scanner-worker.min.js";
     qrScanner = new QrScanner(videoElem, result => {
        qrScanner.stop()
        data = {"scanned_qid": result}
        $.post("/checkpoint-scanned", data, function(data){
            if (data.status === "OK"){
                setMainContent(getHTMLCodeForQuestion())
            }else{
                qrScanner.start();
                alert(data.status)
            }
        })
     });
     qrScanner.start();
 }
 
 // TODO: Use.
 function deinitQrCodeScanner() {
     qrScanner.stop();
     qrScanner = null;
 }
 
 function getHtmlCodeForQrScanner () {
     return "<video" + 
         " style='width: 100%; min-height: 150px; height: 100%; background: #241;' " + // TODO: Move style to class.
         " id='" + QRCODE_VIDEO_ID + "'></video>";
 }

function getHTMLCodeForQuestion () {
    var text = currentQuestion === null ? "Loading..." : currentQuestion.properties.question
    return "<center><h2 style='margin-top: 25%;'>"
        + text +
        "</h2></center>" +
        "<div style=' display: flex;'> <img src='../static/pictures/qr-code.png' height='90'  alt='QR-Code' " +
        "onclick='alert(currentQuestion)'></div>" +
        "<Button class='btn' onclick='skipQuestion()'>skip</Button>"
}

function getHTMLCodeForScoreboard() {
    return "<table class='table table-striped'><thead>" +
        "<th></th><th>Player</th><th>Score</th></thead>" +
        "<tbody id='highscore'>" +
        "<tr><td></td><td id='user'></td><td id='score'></td></tr>" +
        "</tbody></table>"
}

function updateUserScore(){
    $.get("get-score", function (data) {
        if (data.status === "OK") {
            $("#user").text(data.user)
            $("#score").text(data.score)
        }
    })
}

function skipQuestion () {
    if(credits >= 5){
        credits -= 5;
        if(credits <= 10){
        alert("Du hast noch " + credits + " Credits übrig. Nutze Sie weise!")
        }else{
            alert("Du hast noch " + credits + " übrig. Wow ist das noch viel!")
        }
    }
}
 $(document).ready(function() {
     $("body").on('click', '.top', toggleMenu);
     initView();
 });
