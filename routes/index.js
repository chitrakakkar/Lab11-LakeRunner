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
router.post('/', function(req, res, next)
{
    //client-side validation done;no blank field would be sent to DB
    var runToSave={RunDate:req.body.dateRun || Date.now(),
        time: req.body.time
    };
    req.body.runs =[];
    req.body.runs.push(runToSave);

    var new_lake= Lake(req.body);

    new_lake.save(function (err, Lake_saved) {
        if (err) {
            if (err.name == "ValidationError")
            {
                req.flash('error', 'Invalid data');
                return res.redirect('/');
            }
            if (err.code == 11000)
            {
                req.flash('error', 'A lake with that name already exists.');
                return res.redirect('/');
            }
            return next(err) ;
        }

        return res.redirect('/');
    } );  // end save new lake
});

module.exports = router;
