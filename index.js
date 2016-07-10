'use strict';

document.write('<scr'+'ipt type="text/javascript" src="https://raw.githubusercontent.com/shashwatak/satellite-js/master/dist/satellite.js" ></scr'+'ipt>');

function grabData() {
    //console.log("Grabbing coordinates")
    var dat = document.getElementsByTagName("PRE")[0];
	var dat = dat.innerHTML;
	var dat = dat.split('\n');

	// Initialize a satellite record
	var satrec = satellite.twoline2satrec (dat[1], dat[2]);
	//  Propagate satellite using time since epoch (in minutes).
	//var position_and_velocity = satellite.sgp4 (satrec, time_since_tle_epoch_minutes);
	//  Or you can use a calendar date and time (obtained from Javascript [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date)).
	var nowdate = new Date();
	var position_and_velocity = satellite.propagate (satrec,
			nowdate.getUTCFullYear(),
			nowdate.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
			nowdate.getUTCDate(),
			nowdate.getUTCHours(),
			nowdate.getUTCMinutes(),
			nowdate.getUTCSeconds()
		);

	// The position_velocity result is a key-value pair of ECI coordinates.
	// These are the base results from which all other coordinates are derived.
	var position_eci = position_and_velocity["position"];
	var velocity_eci = position_and_velocity["velocity"];
	
	// Set the Observer at 122.03 West by 36.96 North, in RADIANS
	var deg2rad = Math.PI / 180;
	var observer_gd = {
		longitude : -122.0308  * deg2rad,
		latitude  : 36.9613422 * deg2rad,
		height    : .370
	};
	
	 var now = new Date();
	// You will need GMST for some of the coordinate transforms
	//var gmst = getGMST( now );
	var gmst = satellite.gstimeFromDate(
			now.getUTCFullYear(),
			now.getUTCMonth() + 1, // Note, this function requires months in range 1-12.
			now.getUTCDate(),
			now.getUTCHours(),
			now.getUTCMinutes(),
			now.getUTCSeconds()
		);

	// You can get ECF, Geodetic, Look Angles, and Doppler Factor.
	var position_ecf   = satellite.eciToEcf (position_eci, gmst);
	var observer_ecf   = satellite.geodeticToEcf (observer_gd);
	var position_gd    = satellite.eciToGeodetic (position_eci, gmst);
	var look_angles    = satellite.ecfToLookAngles (observer_gd, position_ecf);
	//var doppler_factor = satellite.dopplerFactor (observer_ecf, position_ecf, velocity_ecf);

	// The coordinates are all stored in key-value pairs.
	// ECI and ECF are accessed by "x", "y", "z".
	var satellite_x = position_eci["x"];
	var satellite_y = position_eci["y"];
	var satellite_z = position_eci["z"];

	// Look Angles may be accessed by "azimuth", "elevation", "range_sat".
	var azimuth   = look_angles["azimuth"];
	var elevation = look_angles["elevation"];
	var rangeSat  = look_angles["rangeSat"];

	// Geodetic coords are accessed via "longitude", "latitude", "height".
	var longitude = position_gd["longitude"];
	var latitude  = position_gd["latitude"];
	var height    = position_gd["height"];

	//  Convert the RADIANS to DEGREES for pretty printing (appends "N", "S", "E", "W". etc).
	var lng = satellite.degreesLong (longitude);
	var lat = satellite.degreesLat  (latitude);
      setPosition(lat, lng);
      $("#lat").text(lat);
      $("#lng").text(lng);
      setTimeout('grabData()', 1000); // schedule for 1 sec...
	 
  }
  
//var satrec = satellite.twoline2satrec(longstr1, longstr2);
//var positionAndVelocity = satellite.sgp4(satrec, epochTime);

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
                    speech = requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech = 'action: ' + requestBody.result.action;
                }
            }
        }

        console.log('result: ', speech);

        return res.json({
            speech: speech,
            displayText: speech,
            source: 'lucid-cern'
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
