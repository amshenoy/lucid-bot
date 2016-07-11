'use strict';

var satellite = require('satellite');
var satrec = satellite.twoline2satrec("1 40076U 14037H   16193.11632849  .00000081  00000-0  17714-4 0  9999", "2 40076  98.3253 285.0231 0007283  88.4641 271.7401 14.81202642108530");
var positionAndVelocity = satellite.sgp4(satrec, "1468220000");


    //  Or you can use a calendar date and time (obtained from Javascript Date).
    var now = new Date();
    // NOTE: while Javascript Date returns months in range 0-11, all satellite.js methods require
    // months in range 1-12.
    var positionAndVelocity = satellite.propagate(
        satrec,
        now.getUTCFullYear(),
        now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );

    // The position_velocity result is a key-value pair of ECI coordinates.
    // These are the base results from which all other coordinates are derived.
    var positionEci = positionAndVelocity.position,
        velocityEci = positionAndVelocity.velocity;

    // Set the Observer at 122.03 West by 36.96 North, in RADIANS
    var observerGd = {
        longitude: -122.0308 * deg2rad,
        latitude: 36.9613422 * deg2rad,
        height: 0.370
    };

    // You will need GMST for some of the coordinate transforms.
    // http://en.wikipedia.org/wiki/Sidereal_time#Definition
    // NOTE: GMST, though a measure of time, is defined as an angle in radians.
    // Also, be aware that the month range is 1-12, not 0-11.
    var gmst = satellite.gstimeFromDate(
        now.getUTCFullYear(),
        now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
        now.getUTCDate(),
        now.getUTCHours(),
        now.getUTCMinutes(),
        now.getUTCSeconds()
    );

    // You can get ECF, Geodetic, Look Angles, and Doppler Factor.
    var positionEcf   = satellite.eciToEcf(positionEci, gmst),
        observerEcf   = satellite.geodeticToEcf(observerGd),
        positionGd    = satellite.eciToGeodetic(positionEci, gmst),
        lookAngles    = satellite.ecfToLookAngles(observerGd, positionEcf),
        dopplerFactor = satellite.dopplerFactor(observerCoordsEcf, positionEcf, velocityEcf);

    // The coordinates are all stored in key-value pairs.
    // ECI and ECF are accessed by `x`, `y`, `z` properties.
    var satelliteX = positionEci.x,
        satelliteY = positionEci.y,
        satelliteZ = positionEci.z;

    // Look Angles may be accessed by `azimuth`, `elevation`, `range_sat` properties.
    var azimuth   = lookAngles.azimuth,
        elevation = lookAngles.elevation,
        rangeSat  = lookAngles.rangeSat;

    // Geodetic coords are accessed via `longitude`, `latitude`, `height`.
    var longitude = positionGd.longitude,
        latitude  = positionGd.latitude,
        height    = positionGd.height;

    //  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W". etc).
    var long = satellite.degreesLong(longitude),
        lat  = satellite.degreesLat(latitude);
        


const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    //speech += requestBody.result.fulfillment.speech;
                    speech += 'Testing ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action + ' ';
                }

                var parameters = requestBody.result.parameters;
                if (parameters){
                    for (var p in parameters){
                        if(parameters.hasOwnProperty(p) ) {
                            speech += p + ": " + parameters[p] + "; ";
                        }
                    }
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'lucid-cern',
            data: {"facebook":{"text":"fb"+speech}}
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
});

restService.listen((process.env.PORT || 5000), function () {
    console.log("Server listening");
});
