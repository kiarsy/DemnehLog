//CONSOLE
var ConsoleLogger = function () { };

ConsoleLogger.prototype.log = function (obj) {
    console.log(formatedLogText(obj));
}


module.exports =  ConsoleLogger;