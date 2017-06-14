'use strict';
/* jshint esversion: 6 */
const cookieParser = require('cookie-parser');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const hostname = require("os").hostname();

const request = require('request');

const fs = require('fs');
const http = require('http');
const https = require('https');

const express = require('express');
const app = express();

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
	extended: true
})); // support encoded bodies

app.get('/', (req, res) => {
	console.log(req.originalUrl, req.headers, req.body);
	var ret = {
	    "versions": {
	        "values": [
	            {
	                "id": "v3.4",
	                "links": [
	                    {
	                        "href": `https://${hostname}/identity/v3/`,
	                        "rel": "self"
	                    }
	                ],
	                "media-types": [
	                    {
	                        "base": "application/json",
	                        "type": "application/vnd.openstack.identity-v3+json"
	                    }
	                ],
	                "status": "stable",
	                "updated": "2017-03-30T00:00:00Z"
	            },
	            {
	                "id": "v2.0",
	                "links": [
	                    {
	                        "href": `https://${hostname}:8443/v2/`,
	                        "rel": "self"
	                    },
	                    {
	                        "href": "https://docs.openstack.org/",
	                        "rel": "describedby",
	                        "type": "text/html"
	                    }
	                ],
	                "media-types": [
	                    {
	                        "base": "application/json",
	                        "type": "application/vnd.openstack.identity-v2.0+json"
	                    }
	                ],
	                "status": "stable",
	                "updated": "2017-04-17T00:00:00Z"
	            }
	        ]
	    }
	};
	res.send(JSON.stringify(ret));
});
app.post('/v2/tokens', (req, res) => {
	console.log(req.originalUrl, req.headers, req.body);
	var ret = {
			"access": {
	        "token": {
	            "issued_at": "2014-01-30T15:30:58.819584",
	            "expires": "2019-01-31T15:30:58Z",
	            "id": "aaaaa-bbbbb-ccccc-dddd",
	            "tenant": {
	                "description": null,
	                "enabled": true,
	                "id": "fc394f2ab2df4114bde39905f800dc57",
	                "name": "demo"
	            }
	        },
	        "user": {
	            "username": "demo",
	            "roles_links": [],
	            "id": "9a6590b2ab024747bc2167c4e064d00d",
	            "roles": [
	                {
	                    "name": "Member"
	                },
	                {
	                    "name": "anotherrole"
	                }
	            ],
	            "name": "demo"
	        },
	        "metadata": {
	            "is_admin": 0,
	            "roles": [
	                "7598ac3c634d4c3da4b9126a5f67ca2b",
	                "f95c0ab82d6045d9805033ee1fbc80d4"
	            ]
	        },
	        "trust": {
	            "id": "394998fa61f14736b1f0c1f322882949",
	            "trustee_user_id": "269348fdd9374b8885da1418e0730af1",
	            "trustor_user_id": "3ec3164f750146be97f21559ee4d9c51",
	            "impersonation": false
	        }
	    }
	};
	res.send(JSON.stringify(ret));
});

var privateKey = fs.readFileSync('./ssl/key.pem', 'utf8');
var certificate = fs.readFileSync('./ssl/cert.pem', 'utf8');

var credentials = {
	key: privateKey,
	cert: certificate
};

var httpsServer = https.createServer(credentials, app);

var si = httpsServer.listen(8443, function () {
	let host = si.address().address;
	let port = si.address().port;

	console.log('Server listening at https://%s:%s', host, port);
});
