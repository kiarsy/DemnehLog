
//TELNET
var TelnetLogger = function (options) {

    function processInput(socket, text) {
        text = text.replace(EOL, '');

        if (socket.login) {
            if (text == 'help') {
                socket.write('offline   Make an offline query on logs.fields= [type,text,tag,date(timestamp)]. ex: query,{type:"error"}}' + EOL);
                socket.write('online    Make an online query on logs ex: online,error,username:13213,fatal' + EOL);
                socket.write('stop      Stop receiving online query' + EOL);
                socket.write('clean     Clean the screen' + EOL);
                socket.write('history   Show last 50 command' + EOL);
                socket.write('exit      Exit from telnet console.' + EOL);
            }
            else if (text == 'exit') {
                socket.write(FgRed + 'bye bye.' + EOL + Reset);
                socket.end();
            }
            else if (text == 'stop') {
                socket.query = undefined;
                socket.write(FgRed + 'log stoped.' + EOL + Reset);
            }
            else if (text == 'clean') {
                socket.write(Clean);
            }
            else if (text == 'history') {
                var row = 0;
                socket.write(BgMagenta + 'Last 50 commands history' + Reset + EOL);

                socket.write(FgCyan + (row++) + Reset + ' online,text:username' + EOL);
                socket.write(FgCyan + (row++) + Reset + ' offline,{}' + EOL);
                socket.write(FgCyan + (row++) + Reset + ' offline,{"type":"error"}' + EOL);
                socket.write(FgCyan + (row++) + Reset + ' clean' + EOL);
                socket.write(FgCyan + (row++) + Reset + ' exit' + EOL);
                socket.write(FgCyan + (row++) + Reset + ' help' + EOL);

            }

            else if (text.substring(0, 6) == 'online') {
                socket.write('To stop sending log type ' + FgRed + '"stop"' + Reset + EOL);
                var query = text.split(',');
                var query = query.splice(1, query.length - 1);

                try {
                    socket.query = query;
                }
                catch (err) {
                    socket.write(FgRed + 'ERRPR: ' + err + Reset + EOL);
                }
            }
            else if (text.substring(0, 7) == 'offline') {
                var query = text.split(',')[1];

                try {
                    query = JSON.parse(query);
                }
                catch (err) {
                    socket.write(FgRed + 'ERRPR: ' + err + Reset + EOL);
                    query = undefined;
                }

                if (socket) {
                    LoggerModel.find(query, function (err, logges) {
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

            }
        }
        else {
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
                if (socket.password == 'admin' && socket.username == 'admin') {
                    socket.login = true;
                    socket.write(Clean);
                    socket.write(Reset + BgGreen + 'Login successfull. Welcome to Logger Console' + Reset + EOL);
                    socket.write(Reset + FgGreen + 'type "help" to show command list' + Reset + EOL);

                }
                else {
                    socket.write(Reset + FgRed + 'Login failed.' + EOL + Reset);
                    socket.write('bye bye.' + EOL);
                    socket.end();
                }
            }
        }


        if (socket.login && !socket.query) {
            socket.write(FgGreen + 'command: ' + Reset);
        }
    }

    this.clients = [];
    var net = require('net');

    var thiss = this;
    var serverSocket = net.createServer({
        allowHalfOpen: false
    }, function (socket) {

        socket.name = socket.remoteAddress + ":" + socket.remotePort;
        thiss.clients[socket.name] = socket;


        socket.setKeepAlive(true, 10000);

        socket.write(Clean);
        socket.write(BgYellow + '-----LOGGER CONSOLE-----' + Reset + EOL);
        socket.write(BgYellow + 'Version : 0.0.1         ' + Reset + EOL);
        socket.write(EOL);
        socket.write(FgCyan + 'Please enter username: ' + Reset);

        socket.on('timeout', function () {
            console.log('TELNET TIMEOUT !!!!!!!!!!!!!!!!!!!!!!!! ');
        });

        socket.on('error', function (e) {
            console.log('~~~~~~~~~~~~~~~~*** TELNET Error : ', e);
        });

        socket.on('close', function (data) {
            delete thiss.clients[socket.name];
        });


        socket.on('end', function () {
            socket.destroy();
            delete thiss.clients[socket.name];
        });

        socket.setEncoding('utf8');

        socket.on('data', function (data) {
            socket.message = data;
            processInput(socket, socket.message);
        });

    });


    serverSocket.on('error', function (e) {

    });

    serverSocket.listen(options.port, function () {
        console.log('Telnet is listening on port :' + options.port);
    });

};

TelnetLogger.prototype.log = function (obj) {


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

    for (key in this.clients) {

        var socket = this.clients[key];

        if (checkSocketHas(socket, obj)) {

            var text = formatedLogText(obj);
            socket.write(text + EOL);
        }

    }

}



module.exports = TelnetLogger;