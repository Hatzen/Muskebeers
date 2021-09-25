/**
 * Server calls to get the data from.
 */

/**
 * 
 * @param {longitude, latitude} location 
 * @returns {
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
 */
async function requestNewQuestionByServer(location, callback) {
    // TODO: add parameter &categories=strasse
    let params = null // TODO: pass params instead of string concatination
    $.get("/active-question", params, function(data) {
        if (data.status === "OK"){
            callback(data.feature)
        } else {
            $.get("/question?position=" + location.longitude + "&position=" + location.latitude + "&radius=5000000", params, function(data) {
                if (data.feature != null || data.status === "OK"){
                    callback(data.feature)
                } else if (data.feature != null) {
                    console.error("Error getting question")
                }
            }, "json")
        }
    }, "json")
}

async function skipQuestionByServer(location, callback) {
    // TODO: add parameter &categories=strasse
    let params = null // TODO: pass params instead of string concatination
    $.get("/skip-question?position=" + location.longitude + "&position=" + location.latitude + "&radius=5000000", params, function(data) {
        if (data.feature != null || data.status === "OK"){
            callback(data.feature)
        } else {
            console.error("Error getting question")
        }
    }, "json")
}

/**
 * 
 * @param {function(data: {score: int, ...}) } callback 
 */
async function requestCheckpointReached(callback) {
    // TODO: add parameter &categories=strasse
    let params = {} // TODO: pass params instead of string concatination
    $.post("/checkpoint-reached", params, function (data) {
        if (data.status === "OK"){
            callback(data)
        }
    }, "json")
}

async function requestCurrentScore() {
    // TODO: add parameter &categories=strasse
    let params = null // TODO: pass params instead of string concatination
    $.get("/get-score", params, function(data) {
        if (data.status === "OK"){
            console.log(`User: ${data.user}, Score: ${data.score}`)
        } else if (data.feature != null) {
            console.error("Error getting question")
        }
    }, "json")
}