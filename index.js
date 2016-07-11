'use strict';

//var satrec = satellite.twoline2satrec(longstr1, longstr2);
//var positionAndVelocity = satellite.sgp4(satrec, epochTime);

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());


restService.get('/', function (req, res) {
	res.send('LUCID - Langton Ultimate Cosmic Ray Intensity Detector');
})

// for facebook verification
restService.get('/hook/', function (req, res) {
	if (req.query['hub.verify_token'] === 'lucid_is_awesome') {
		res.send(req.query['hub.challenge']);
	}
	res.send('Error, wrong token');
})

restService.post('/hook', function (req, res) {

    console.log('hook request');

    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
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
            source: 'lucid-cern'
            //"data": {"facebook": {'<facebook_message>'}},
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
