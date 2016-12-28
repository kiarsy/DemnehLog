Reset = "\x1b[0m"
Bright = "\x1b[1m"
Hidden = "\x1b[8m"
Blink = "\x1b[5m"
Clean = '\u001B[2J';

FgRed = "\x1b[31m"
FgGreen = "\x1b[32m"
FgYellow = "\x1b[33m"
FgBlue = "\x1b[34m"
FgMagenta = "\x1b[35m"
FgCyan = "\x1b[36m"
FgWhite = "\x1b[37m"

BgBlack = "\x1b[40m"
BgRed = "\x1b[41m"
BgGreen = "\x1b[42m"
BgYellow = "\x1b[43m"
BgBlue = "\x1b[44m"
BgMagenta = "\x1b[45m"
BgCyan = "\x1b[46m"
BgWhite = "\x1b[47m"

EOL = '\r\n';

formatedLogText = function (obj, format) {


    var TypeTitle = '';

    var type = obj.type;
    var text = obj.text;
    var tag = obj.tag;
    var date = obj.date;

    if (typeof date == 'number') {
        var date = formatDate(date);
    }

    if (type == 'error') {
        TypeTitle = Reset + Bright + FgRed + 'Error  ' + Reset + FgRed;
    }
    else if (type == 'warning') {
        TypeTitle = Reset + FgYellow + 'Warning';
    }
    else if (type == 'debug') {
        TypeTitle = Reset + FgCyan + 'Debug  ';
    }
    else if (type == 'fatal') {
        TypeTitle = Reset + BgRed + Blink + 'FATAL  ' + Reset + BgRed;
    }
    else if (type == 'info') {
        TypeTitle = Reset + 'Info   ';
    }

    var hasTAG = false;
    var hasDate = false;
    var hasTITLE = false;
    var hasTEXT = false;

    if (format.indexOf('tag') > -1) {
        hasTAG = true;
    }

    if (format.indexOf('date') > -1) {
        hasDate = true;
    }

    if (format.indexOf('title') > -1) {
        hasTITLE = true;
    }

    if (format.indexOf('text') > -1) {
        hasTEXT = true;
    }

    var outputText = '';

    if (hasTAG) {
        outputText = outputText + FgGreen + tag + ':' + Reset;
    }
    if (hasDate) {
        outputText = outputText + '(' + date + ') ';
    }
    if (hasTITLE) {
        outputText = outputText + TypeTitle + '  |   ';
    }
    if (hasTEXT) {
        outputText = outputText + text + Reset;
    }

    return outputText;
}


formatDate = function (timestamp) {
    var date = new Date(timestamp);
    var date = date.getFullYear() + '/' + date.getMonth() + '/' + date.getDate() + ' - ' + date.getHours() + ':' + date.getMinutes() + ':' + date.getSeconds() + '.' + date.getMilliseconds();

    return date;
}