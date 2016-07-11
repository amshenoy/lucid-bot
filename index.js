'use strict';

var satellite = require('satellite');
//var satrec = satellite.twoline2satrec("1 40076U 14037H   16193.11632849  .00000081  00000-0  17714-4 0  9999", "2 40076  98.3253 285.0231 0007283  88.4641 271.7401 14.81202642108530");
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
