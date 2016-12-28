//CONSOLE
var ConsoleLogger = function () { };

ConsoleLogger.prototype.log = function (obj,format) {
    console.log(formatedLogText(obj,format));
}


module.exports =  ConsoleLogger;