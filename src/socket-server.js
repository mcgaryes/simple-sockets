'use strict';

// ============================================================
// === Imports ================================================
// ============================================================

const net = require('net');
const util = require('util');
const EventEmitter = require('events').EventEmitter;
const _ = require('underscore');
const log = require('./logger');
const ConnectionManager = require('./connection-manager');

// ============================================================
// ============================================================
// ============================================================


class SocketServer
{

    constructor(options)
    {

        this.server = net.createServer();

        this.server.on('connection',(socket) => {
            this.manager.handleConnection(socket);
        });

        this.server.on('error',(error) => {
            log.error(error);
        });

        this.manager = new ConnectionManager();
    }


    bind(port, onBind)
    {

        let options = {
            port: port,
            exclusive: true,
            allowHalfOpen: false
        };

        this.server.listen(options,onBind);

    }

    close()
    {
        this.server.close();
    }
}

util.inherits(SocketServer,EventEmitter);

module.exports = SocketServer;
