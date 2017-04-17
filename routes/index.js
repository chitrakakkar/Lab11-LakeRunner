var express = require('express');
var router = express.Router();
var Lake = require('../models/run');

/* GET home page. */
router.get('/', function(req, res, next) {
    Lake.find(function(err, Lakes)
    {
        if (err) {
            return next(err);
        }
        res.render('index', { Lakes: Lakes });
    })
});

/* POST to home page - handle form submit */
router.post('/', function(req, res, next)
{
    //client-side validation done;no blank field would be sent to the DB
    //
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


router.post('/addRun',function(req, res, next)
{
    console.log("I am the body", req.body);
    if(!req.body.dateRun)
    {
        req.flash('error', 'Please provide a date for your run ' + req.body.name);
        return res.redirect('/');
    }
    // Find the lake with the given ID, and add this new date/time to the run array
    console.log("id", req.body._id);
    Lake.findById( req.body._id, function(err, lake)
    {
        console.log("Here", lake);

        if (err) {
            return next(err);
        }

        if (!lake) {
            res.statusCode = 404;
            return next(new Error('Not found, Lake_with_id ' + req.body._id))
        }
        var runs_data= {dateRun:req.body.dateRun, time:req.body.time};
        lake.runs.push(runs_data);  // Add new run to runs array

        console.log("Runs", lake.runs);

        //And sort dateRun
        lake.runs.sort(function(a, b)
        {
            if (a.time < b.time) { return 1;  }
            if (a.time > b.time) { return -1; }
            return 0;
        });

        lake.save(function(err){
            if (err) {
                if (err.name == 'ValidationError')
                {
                    //Loop over error messages and add the message to messages array
                    var messages = [];
                    for (var err_name in err.errors) {
                        messages.push(err.errors[err_name].message);
                    }
                    req.flash('error', messages);
                    return res.redirect('/')
                }
                return next(err);   // For all other errors
            }

            return res.redirect('/');  //If saved successfully, redirect to main page
        })
    });
});

router.post('/deleteLake', function (req, res,err)
{
    var lake_to_delete_name= req.body.name;
    Lake.findOne({name:lake_to_delete_name}, function(err, bird)
    {
        if(err)
        {
            return next(err)}
        if(!bird)
        {
            return next(new Error('No bird found with name ' + bird_to_delete_name) )
        }
        Lake.remove({name:lake_to_delete_name}, function (err)
        {
            if(err) {
                return next(err)
            }
            res.redirect('/')
        })
    });

});
module.exports = router;
