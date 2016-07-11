'use strict';

//var satrec = satellite.twoline2satrec(longstr1, longstr2);
//var positionAndVelocity = satellite.sgp4(satrec, epochTime);

const express = require('express');
const bodyParser = require('body-parser');


const restService = express();
restService.use(bodyParser.json());


messageData = {
	"attachment": {
		"type": "template",
		"payload": {
			"template_type": "generic",
			"elements": [{
				"title": "First card",
				"subtitle": "Element #1 of an hscroll",
				"image_url": "http://messengerdemo.parseapp.com/img/rift.png",
				"buttons": [{
					"type": "web_url",
					"url": "https://www.messenger.com",
					"title": "web url"
				}, {
					"type": "postback",
					"title": "Postback",
					"payload": "Payload for first element in a generic bubble",
				}],
			}, {
				"title": "Second card",
				"subtitle": "Element #2 of an hscroll",
				"image_url": "http://messengerdemo.parseapp.com/img/gearvr.png",
				"buttons": [{
					"type": "postback",
					"title": "Postback",
					"payload": "Payload for second element in a generic bubble",
				}],
			}]
		}
	}
}
	
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
            source: 'lucid-cern',
            "data": {"facebook": messageData}
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
