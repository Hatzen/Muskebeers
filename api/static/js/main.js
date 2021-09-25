/**
 * DEV Fields
 */
 var credits = 10;
 var counter = 0;
 const dummyQuestions = [
     {
         "type": "Feature",
         "properties": {
             "question": "Finde den Turm mit den drei Käfigen",
             "hints": ["Es ist eine Kirche", "https://...."],
             "buffer": 100.0 // Wie nah muss man an dem Punkt sein?
         },
         "geometry": {
             "type": "Point",
             "coordinates": [-104.99404, 39.75621]
         }
     },
     {
         "type": "Feature",
         "properties": {
             "question": "Groß und Rund in MS",
             "hints": ["Kreisel", "https://...."],
             "buffer": 100.0 // Wie nah muss man an dem Punkt sein?
         },
         "geometry": {
             "type": "Point",
             "coordinates": [-110.99404, 50.75621]
         }
     }
 ]
 
 /**
  * Implementation
  */
 
 const STORAGE_KEY_CURRENT_QUESTION = "STORAGE_KEY_CURRENT_QUESTION";
 const QRCODE_VIDEO_ID = "QRCODE_VIDEO_ID"
 
 var currentQuestion = null;
 var qrScanner = null;
 
 function initView () {
     setMainContent(getHTMLCodeForQuestion())
     if (localStorage.getItem(STORAGE_KEY_CURRENT_QUESTION) == null) {
        requestNextQuestion();
     } else {
        currentQuestion = JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT_QUESTION));
        receivedNewQuestion(currentQuestion);
     }
 }

 /**
  * 
  * @param {longitude: double, latitude: double} location 
  */
 function updateGeoLocation (location) {
    if (currentQuestion == null) {
        console.error("Current question is null! UpdateGeoLocation cannot calculate distance.");
    }
    let targetLongitude = currentQuestion.geometry.coordinates[0];
    let targetLatitude = currentQuestion.geometry.coordinates[1];
    let distanceToQuestionTarget = Math.abs(getDistanceFromLatLonInKm(location.longitude, location.latitude, targetLongitude, targetLatitude));
    if (distanceToQuestionTarget <= currentQuestion.buffer) {
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
    let normalizedValue = Math.min(value, MUENSTER_RELEVANT_RADIUS_IN_KM) / MUENSTER_RELEVANT_RADIUS_IN_KM;
    return getColor(normalizedValue);
 }

 /**
  * @param {double} value from 0 green to 0.5 yellow to 1 red
  * @returns color string
  */
 function getColor(value){
    var hue=((1-value)*120).toString(10);
    return ["hsl(",hue,",100%,50%)"].join("");
}

 function receivedNewQuestion (question) {
     debugger
    localStorage.setItem(STORAGE_KEY_CURRENT_QUESTION, JSON.stringify(question));
    if (isGeoLocationSupported()) {
        currentQuestion = JSON.parse(localStorage.getItem(STORAGE_KEY_CURRENT_QUESTION));
        watchPosition(updateGeoLocation);
        setMainContent(getHTMLCodeForQuestion());
     }
 }
 
 async function requestNextQuestion () {
    const dummyDebug = false;
    if (dummyDebug) {
        receivedNewQuestion(dummyQuestions[counter++ % dummyQuestions.length]);
    } else {
        getCurrentPosition(function (position) {
            let location = {
                latitude: null,
                longitude: null,
            };
            location.longitude = position.coords.longitude;
            location.latitude = position.coords.latitude;
            requestNewQuestionByServer(location, receivedNewQuestion);
        });
    }
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
        data = {"scanned_qid": result}
        $.post("/checkpoint-scanned", data, function(data){
            if (data.status === "OK"){
                setMainContent(getHTMLCodeForQuestion())
            }else{
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
    // if (currentQuestion == null) {
    //     return "<center>loading..</center>"
    // }
    let question = currentQuestion.properties.question;
    return "<center><h2 style='margin-top: 25%;'>"
        + question +
        "</h2></center>" +
        "<div style=' display: flex;'> <img src='../static/pictures/qr-code.png' height='90'  alt='QR-Code' " +
        "onclick='alert(currentQuestion)'></div>" +
        "<Button style=' display: outside; left: 50%; color: white; background-color: #3e739d;' onclick='skipQuestion()'>skip</Button>"
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