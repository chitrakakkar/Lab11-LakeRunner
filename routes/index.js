var express = require('express');
var router = express.Router();
var Lake = require('../models/run');

/* GET home page. */
router.get('/', function(req, res, next) {
    Lake.find(function(err, Lakes)
    {
        console.log("I am the lake data", Lakes);
        if (err) {
            return next(err);
        }
        res.render('index', { Lakes: Lakes });
    })
});

/* POST to home page - handle form submit */
router.post('/', function(req, res, next){
    console.log(req.body);
    var lake = Lake(req.body);
    lake.save(function(err, newLake){
        if (err) {
            return next(err);
        }
        console.log(newLake);
        return res.redirect('/')
    })
});

module.exports = router;
