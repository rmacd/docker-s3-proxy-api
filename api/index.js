// global params
var AWS_BUCKET = process.env.AWS_BUCKET || 'quackophage';

var AWS = require('aws-sdk');
const aws_s3URI_allUsers = "http://acs.amazonaws.com/groups/global/AllUsers";

crypt = require('crypto');

// cache responses from AWS
const NodeCache = require("node-cache");

const express = require('express');
const path = require('path');
const app = express();

// set up CSRF
const cookieParser = require('cookie-parser');
const csurf = require('csurf');
app.use(cookieParser());
app.use(csurf({cookie: {key: '_csrf', maxAge: 3600}}));

app.use(function (req, res, next) {
    var token = req.csrfToken();
    res.cookie('_csrf-aws-s3p', token);
    next();
});

// AWS setup
const aws_s3Params = {
    Bucket: process.env.AWS_BUCKET || AWS_BUCKET
};
const aws_region = process.env.AWS_REGION || 'eu-west-2';
const aws_s3 = new AWS.S3({apiVersion: '2006-03-01', signatureVersion: 'v4', region: aws_region});

function generateSignedLink(object_key) {
    return new Promise(((resolve, reject) => {
        let params = Object.assign({Key: object_key, Expires: 120}, aws_s3Params);
        console.log("GET ", params, "(signed link)");
        aws_s3.getSignedUrl(
            'getObject', params, ((err, url) => {
                if (err) {
                    reject(err);
                } else {
                    resolve({signedLink: url});
                }
            })
        );
    }));
}

app.get('/:bucket/:redirect*', async function (req, res) {
    let getACL = (req.query.getACL !== undefined);
    let queryPath = req.query.path;

    let item_path = req.params[0];
    let delimiter = '/';

    if (item_path[0] === '/') {
        item_path = item_path.substring(1);
    }

    // if (!item_path.includes("redirect")) {
    //     return show419(res);
    // }

    const signedLink = await generateSignedLink(item_path);
    console.log(signedLink);

    res.redirect(signedLink.signedLink);
});

app.get('*', (req, res) => {
    show419(res);
});

function show419(res) {
    res.sendFile(path.join(__dirname + '/419.html'));
}

const port = process.env.PORT || 5000;
app.listen(port);
console.log("Express is listening on port", port);