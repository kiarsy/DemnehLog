//MONGOOOOOO
var mongoose = require('mongoose');


var mongodbCon = mongoose.connection;

mongodbCon.on('error', console.error.bind(console, 'LOGGER connection error:'));

mongodbCon.once('open', function(callback) {
    console.log('MongoDB LOGGER is Connected');
});

mongodbCon.on('disconnected', function() {
    console.log('Mongoose LOGGER default connection disconnected');
});

var LoggerSchema = mongoose.Schema({
    date: Number,
    type: String,
    tag: String,
    text: String,
    extras: String
});

LoggerSchema.index({
    date: 1
});

LoggerModel = mongoose.model('Logger', LoggerSchema);

var MongoLogger = function(configs) {

    mongoose.connect(configs.mongodb.address);




};

MongoLogger.prototype.log = function(obj) {

    var type = obj.type;
    var text = obj.text;
    var tag = obj.tag;
    var date = obj.date;



    var logModel = new LoggerModel();
    logModel.date = obj.timeStamp;
    logModel.type = obj.type;
    logModel.tag = obj.tag;
    logModel.text = obj.text;
    logModel.extras = JSON.stringify(obj.extras)


    logModel.save(function(err, result) {
        if (err)
            console.log('error save log :', err);
    });

}


module.exports = MongoLogger;