// Enable Node.js Core library if require does not work;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

/* Represents a lake date:-a name, and run is an array of date and the time; */
var LakeSchema = new mongoose.Schema({
    name : { type: String,
        required: true,
        unique: true},
    distance : Number,
    runs : [{
        dateRun: {type: Date,
            default: Date.now, validate:
                {
                    <!-- validating if date is in past; -->
                validator:function (date) {
                    //return false if date is in future
                    return (date <Date.now());
                }, message:'{VALUE} is not a valid run date.Date must be in past'
            }},
        time: {type: Number,
            min: 0,
            required: true}
    }]
});
// mongoose.model turns it into a Run object - uppercase first letter
var Lake = mongoose.model('Lake', LakeSchema);

module.exports = Lake;
