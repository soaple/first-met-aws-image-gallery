var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: path.join(__dirname, '..', 'uploads') });
var {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
} = require('@aws-sdk/client-s3');
const s3Client = new S3Client({ region: 'ap-northeast-2' });

router.get('/', function (req, res, next) {
    s3Client
        .send(
            new ListObjectsV2Command({
                Bucket: 'soaple-bucket-20231012',
                MaxKeys: 50,
            })
        )
        .then((data) => {
            res.send(data.Contents);
        })
        .catch((error) => {
            console.log(error);
        });
});

router.post('/', upload.single('new-image'), function (req, res, next) {
    console.dir(req.file);

    fs.readFile(req.file.path, function (err, data) {
        s3Client
            .send(
                new PutObjectCommand({
                    Bucket: 'soaple-bucket-20231012',
                    Key: req.file.filename,
                    Body: data,
                    ContentType: req.file.mimetype,
                })
            )
            .then((data) => {
                console.log(data);
                res.send(data);
            })
            .catch((error) => {
                console.log(error);
            });
    });
});

module.exports = router;
