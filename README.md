# Demneh Logger

[![NPM Version][npm-image]][npm-url]
[![NPM Downloads][downloads-image]][downloads-url]

## Table of Contents

- [Install](#install)
- [Introduction](#introduction)
- [Classes](#classes)
- [ProviderConsole](#providerconsole)
- [ProviderMongo](#providermongo)
- [ProviderTelnet](#providertelnet)
- [Full Example](#full-example)
- [Feedback](#feedback)

## Install

```sh
$ npm install demnehlog
```

## Introduction

This is a node.js module for store and show nodejs logs in console,mongo and from telnet. It is written in JavaScript, does not
require compiling.

Here is an example on how to use it:

```js
var DemnehLog = require('demnehlog');
var consoleProvider = new DemnehLog.ProviderConsole();

var logger1 = new DemnehLog.Logger([consoleProvider], ['date,title,text']);

logger1.info('tag', 'this is an info log');
logger1.error('tag', 'this is an error');
logger1.fatal('tag', 'this is a fatal error');
logger1.debug('tag', 'this is a debug log');
logger1.warning('tag', 'this is a warning');
```

`Logger` class used to make an object of logger with one or multiple providers.
you can initilize multiple `Logger` for diffrent porpuse.In this sample we make a object of `Logger` as 'testlogger' with a console provider that show all logs on console screen with 'date,title,text' format, the output is : 

![alt tag](https://raw.githubusercontent.com/kiarsy/MainLogger/master/example_output1.png)

## Classes

demnehlog has 2 parts as describe below:

* `Providers`: Providers are the way that you choose to store or show your logs,For instance by `ProviderMongo` provider you can store your logs in mongoDb permanently, in this version we have 3 providers :
</br>`ProviderConsole` Shows all logs on console screen.
</br>`ProviderMongo` Stores logs in mongoDb Database.
</br>`ProviderTelnet` Sends logs immediately to telnet clients that already connected.

* `Logger`: instance of Logger is a compination or diffrent providers you choose and the log format that the provider must provide.For instance in above example : 
```js
var logger2 = new DemnehLog.Logger([consoleProvider], ['date,title,text']);
```
we set consoleProvider with data,title,text format, the date means when log occours and title meanse which type of message occours (Info,Error,fatal,Debug,warning) and the text means whats happend?.<br/>
as you can see in the output picture of example1 the logs in like :
```js
(2017/2/6 - 15:15:51.193) Warning  |   this is a warning
        ^                   ^              ^
        |                   |              |
DATE----            TITLE---        TEXT---
```

```js
var testlogger = new DemnehLog.Logger([consoleProvider], ['title,text']);
```
![alt tag](https://raw.githubusercontent.com/kiarsy/MainLogger/master/example_output2.png)
## ProviderConsole
comming soon.

## ProviderMongo
comming soon.

## ProviderTelnet
comming soon.

## Full Example
comming soon.

## Feedback
You can send your feedbacks on https://github.com/kiarsy/DemnehLog also you can help us to improve demnehLog. 

[npm-image]: https://img.shields.io/npm/v/demnehlog.svg
[npm-url]: https://www.npmjs.com/package/demnehlog
[node-version-image]: https://img.shields.io/node/v/demnehlog.svg
[node-version-url]: https://nodejs.org/en/download/
[downloads-image]: https://img.shields.io/npm/dm/demnehlog.svg
[downloads-url]: https://npmjs.org/package/demnehlog
