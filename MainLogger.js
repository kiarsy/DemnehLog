
var MainLogger = function (providers) {

    this.providers = providers;

    this.send = function (obj) {

        this.providers.forEach(function (item) {

            item.log(obj);
        });

    }
};



MainLogger.prototype.log = function (type, text, tags, extras) {
    // console.log(type, text, tags, extras);
    var date = new Date();
    var timeStamp = date.getTime();
    var date = formatDate(timeStamp);

    this.send({ date: date, timeStamp: timeStamp, text: text, type: type, text: text, tag: tags, extras: extras });
};

MainLogger.prototype.error = function (tags, text, extras) {
    this.log('error', text, tags, extras);
};

MainLogger.prototype.info = function (tags, text, extras) {
    this.log('info', text, tags, extras);
};

MainLogger.prototype.warning = function (tags, text, extras) {
    this.log('warning', text, tags, extras);

};

MainLogger.prototype.debug = function (tags, text, extras) {
    this.log('debug', text, tags, extras);

};

MainLogger.prototype.fatal = function (tags, text, extras) {
    this.log('fatal', text, tags, extras);
};


module.exports = MainLogger;
