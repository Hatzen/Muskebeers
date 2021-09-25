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
    debugger
    let params = null // TODO: pass params instead of string concatination
    $.get("/question?position=" + location.longitude + "&position=" + location.latitude, params, function(data) {
        debugger
        if (data.status === "OK"){
            callback(data)
        }
    }, "json")
}

