
//TELNET
var TelnetLogger = function (options) {
    var pjson = require('../package.json');
    this.clients = [];
    this.package = pjson;
    var instance = this;

    //Accounting model
    if (options.mongodb) {
        var mongoose = require('mongoose');
        var mongodbCon = mongoose.connection;
        mongodbCon.on('error', console.error.bind(console, 'TELNET MongoDB connection error:'));

        mongodbCon.once('open', function (callback) {
            console.log('TELNET MongoDB LOGGER is Connected');
        });

        mongodbCon.on('disconnected', function () {
            console.log('TELNET MongoDB LOGGER default connection disconnected');
        });

        var accountingSchema = mongoose.Schema({
            username: String,
            password: String,
            role: String
        });

        this.AccountingModel = mongoose.model('Accounting', accountingSchema);


        var historySchema = mongoose.Schema({
            username: String,
            command: String
        });

        this.HistoryModel = mongoose.model('History', historySchema);


        // var first = new this.AccountingModel();
        // first.username = 'admin';
        // first.password = '0000';
        // first.role = 'admin';
        // first.save();

        mongoose.connect(options.mongodb.address);
    }

    //Telnet Server
    var net = require('net');
    var serverSocket = net.createServer({
        allowHalfOpen: false
    }, function (socket) {

        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        instance.clients[socket.name] = socket;

        socket.write(Clean);
        socket.write(BgYellow + '-----LOGGER CONSOLE-----' + Reset + EOL);
        socket.write(BgYellow + 'Version : ' + instance.package.version + '         ' + Reset + EOL);
        socket.write(EOL);
        socket.write(FgCyan + 'Please enter username: ' + Reset);

        socket.on('timeout', function () {
            console.log('TELNET TIMEOUT !!!!!!!!!!!!!!!!!!!!!!!! ');
        });

        socket.on('error', function (e) {
            console.log('~~~~~~~~~~~~~~~~*** TELNET Error : ', e);
        });

        socket.on('close', function (data) {
            delete instance.clients[socket.name];
        });


        socket.on('end', function () {
            socket.destroy();
            delete instance.clients[socket.name];
        });

        socket.setEncoding('utf8');

        socket.on('data', function (data) {
            socket.message = data;
            processInput(instance, socket, socket.message);
        });

    });

    serverSocket.on('error', function (e) {
    });

    serverSocket.listen(options.port, function () {
        console.log('Telnet is listening on port :' + options.port);
    });

};

TelnetLogger.prototype.log = function (obj,format) {
    for (key in this.clients) {

        var socket = this.clients[key];

        if (checkSocketHas(socket, obj)) {

            var text = formatedLogText(obj,format);
            socket.write(text + EOL);
        }
    }

}


function checkSocketHas(socket, obj) {

    if (!socket.login || !socket.query)
        return false;


    var countOfFields = 0;

    for (key in socket.query) {
        countOfFields++;
        var val1 = socket.query[key].toLowerCase()

        //tag check
        if (socket.query[key].toLowerCase() == obj.tag.toLowerCase() || obj.tag.toLowerCase().indexOf(socket.query[key].toLowerCase()) > 0) {
            return true;
        }

        //type check
        if (socket.query[key].toLowerCase() == obj.type.toLowerCase()) {
            return true;
        }

        //text check
        if (val1.indexOf(':') > 0) {
            var queryKey = val1.split(':')[0].toLowerCase();
            var val1 = val1.split(':')[1].toLowerCase();
            if (queryKey == 'text') {
                if (obj.text.toLowerCase().indexOf(val1) >= 0) {
                    return true;
                }
            }
        }

        val1 = socket.query[key].toLowerCase()
        // console.log('obj.extras:', obj.extras);
        //extras check
        for (varKey in obj.extras) {

            if (val1.indexOf(':') == -1) {
                // console.log('val1:', val1);
                continue; //its not a key-value pair
            }

            var queryKey = val1.split(':')[0];
            var val1 = val1.split(':')[1];


            var val2 = obj.extras[varKey]
            // console.log('queryKey:', queryKey, ',val1:', val1, ',varKey:', varKey, ',val2:' + val2);
            if (typeof val1 == 'string' && typeof val2 == 'string') {
                val1 = val1.toLowerCase();
                val2 = val2.toLowerCase();
            }

            varKey = varKey.toLowerCase();
            if (val1 == val2 && queryKey == varKey) {
                return true;
            }
        }
    }

    //Select all Logs
    if (countOfFields == 0) {
        return true;
    }

    return false;
}

function checkAuthentication(instance, username, password, response) {
    if (instance.AccountingModel) {

        instance.AccountingModel.find({ username: username, password: password }, function (error, result) {
            if (error) {
                response({ login: false, error: error });
                return;
            }
            if (result.length > 0) {
                response({ login: true, role: result[0].role });
            }
            else {
                response({ login: false, error: 'username or password is incorrect.' });
            }
        })

    }
    else {
        response({ login: false, error: 'no connection to account database' });
    }

}


function processInput(instance, socket, text) {
    text = text.replace(EOL, '');

    if (socket.login) {
        var history = new instance.HistoryModel();
        history.username = socket.username;
        history.command = text;

        history.save();
    }

    if (socket.login) {

        if (commandHelp(instance, socket, text))
        { }
        else if (commandExit(instance, socket, text))
        { }
        else if (commandStop(instance, socket, text))
        { }
        else if (commandClean(instance, socket, text))
        { }
        else if (commandHistory(instance, socket, text))
        { }
        else if (commandHistory(instance, socket, text))
        { }
        else if (commandOnline(instance, socket, text))
        { }
        else if (commandOffline(instance, socket, text))
        { }
        else if (commandCreateUser(instance, socket, text))
        { }
        else if (commandDeleteUser(instance, socket, text))
        { }
        else if (commandDeleteUser(instance, socket, text))
        { }


    }
    else {
        //LOGIN
        if (!socket.loginLevel) {
            socket.loginLevel = 0;
        }

        if (socket.loginLevel == 0) {
            //username
            socket.username = text;
            socket.loginLevel++;

            socket.write(FgCyan + 'Please enter Password: ' + Reset + Hidden);
        }

        else if (socket.loginLevel == 1) {
            //password
            socket.password = text;
            socket.loginLevel++;

            checkAuthentication(instance, socket.username, socket.password, function (result) {
                if (result.login) {
                    socket.role = result.role;
                    socket.login = true;
                    socket.write(Clean);
                    socket.write(Reset + BgGreen + 'Login successfull. Welcome to Logger Console' + Reset + EOL);
                    socket.write(Reset + FgGreen + 'Type "help" to show command list' + Reset + EOL);
                }
                else {
                    socket.write(Reset + FgRed + 'Login failed.' + EOL + Reset);
                    socket.write(Reset + FgRed + result.error + EOL + Reset);
                    socket.write('bye bye.' + EOL);
                    socket.end();
                }
            });

        }
    }

    if (socket.login && !socket.query) {
        socket.write(FgGreen + 'command: ' + Reset);
    }
}



function commandHelp(instance, socket, text) {
    if (text == 'help') {

        if (socket.role == 'admin') {
            socket.write(FgCyan + 'Accounting...............' + Reset + EOL);
            socket.write(FgGreen + 'CreateUser    ' + Reset + 'Create new user,ex: createuser username password role' + EOL);
            socket.write(FgGreen + 'DeleteUser    ' + Reset + 'Delete an exist user,ex: deleteuser username' + EOL);
            socket.write(FgGreen + 'UpdateUser    ' + Reset + 'Create new user,ex: updateuser username password role' + EOL);
        }

        socket.write(FgCyan + 'Log .....................' + Reset + EOL);
        socket.write(FgGreen + 'offline       ' + Reset + 'Make an offline query on logs.fields= [type,text,tag,date(timestamp)]. ex: query,{type:"error"}}' + EOL);
        socket.write(FgGreen + 'online        ' + Reset + 'Make an online query on logs ex: online,error,username:13213,fatal' + EOL);
        socket.write(FgGreen + 'stop          ' + Reset + 'Stop receiving online query' + EOL);
        socket.write(FgCyan + 'Common ...................' + Reset + EOL);
        socket.write(FgGreen + 'clean         ' + Reset + 'Clean the screen' + EOL);
        socket.write(FgGreen + 'history       ' + Reset + 'Show last 25 command' + EOL);
        socket.write(FgGreen + 'exit          ' + Reset + 'Exit from telnet console.' + EOL);
        return true;
    }
    return false;
}
function commandExit(instance, socket, text) {

    if (text == 'exit') {
        socket.write(FgRed + 'bye bye.' + EOL + Reset);
        socket.end();
        return true;
    }
    return false;
}
function commandStop(instance, socket, text) {

    if (text == 'stop') {
        socket.query = undefined;
        socket.write(FgRed + 'log stoped.' + EOL + Reset);
        return true;
    }
    return false;
}
function commandClean(instance, socket, text) {
    if (text == 'clean') {
        socket.write(Clean);
        return true;
    }
    return false;
}
function commandHistory(instance, socket, text) {
    if (text == 'history') {
        var row = 0;
        socket.write(BgMagenta + 'Last 25 commands history' + Reset + EOL);

        var q = instance.HistoryModel.find({ username: socket.username }).limit(25);

        q.exec(function (err, posts) {
            posts.forEach(function (element) {
                socket.write(FgCyan + (row++) + Reset + ' ' + element.command + EOL);

                if (row == posts.length) {
                    socket.write(FgGreen + 'command: ' + Reset);
                }
            });
        });

        return true;
    }
    return false;
}
function commandOnline(instance, socket, text) {
    if (startWith(text, 'online')) {

        socket.write('To stop sending log type ' + FgRed + '"stop"' + Reset + EOL);
        var query = text.split(',');
        var query = query.splice(1, query.length - 1);

        try {
            socket.query = query;
        }
        catch (err) {
            socket.write(FgRed + 'ERRPR: ' + err + Reset + EOL);
        }

        return true;
    }
    return false;
}
function commandOffline(instance, socket, text) {


    if (startWith(text, 'offline')) {

        var query = text.split(',')[1];

        try {
            query = JSON.parse(query);
        }
        catch (err) {
            socket.write(FgRed + 'ERRPR: ' + err + Reset + EOL);
            query = undefined;
        }

        if (socket) {
            instance.LoggerModel.find(query, function (err, logges) {
                if (err) {
                    socket.write(FgRed + 'ERRPR2: ' + err + Reset + EOL);
                } else {

                    socket.write(EOL);

                    var row = 0;
                    logges.forEach(function (log) {
                        row++;
                        var text = formatedLogText(log);
                        socket.write(row + ':' + text + EOL);

                        if (row == logges.length) {
                            socket.write(FgGreen + 'command: ' + Reset);
                        }
                    });


                }
            });
        }

        return true;
    }
    return false;
}

function commandCreateUser(instance, socket, text) {

    if (socket.role == 'admin' && startWith(text, 'createuser', true)) {

        return true;
    }
    return false;
}

function commandDeleteUser(instance, socket, text) {
    if (socket.role == 'admin' && startWith(text, 'deleteuser', true)) {

        return true;
    }
    return false;
}

function commandUpdateUser(instance, socket, text) {
    if (socket.role == 'admin' && startWith(text, 'updateuser', true)) {

        return true;
    }
    return false;
}


function startWith(str, expression, caseInSensitive) {
    if (caseInSensitive) {
        str = str.toLowerCase();
        expression = expression.toLowerCase();
    }
    return (str.substring(0, expression.length) == expression)

}

module.exports = TelnetLogger;