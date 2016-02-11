'use strict';

// ============================================================
// === Imports ================================================
// ============================================================

const _ = require('underscore');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const UUID = require('node-uuid');
const logger = require('./logger');

// ============================================================
// === Connection =============================================
// ============================================================

/**
 * The Connection object helps with the reading and sending of messages between
 * various types of sockets connections that may attempt to connect to the server
 * the connection belongs to.
 * @class Connection
 */
class Connection
{

    constructor(socket)
    {

        this.socket = socket;
        this.id = UUID.v4();

        this.socket.on('data', (buffer) => {
            this.emit('data', buffer, this);
        });

        this.socket.on('close', (hadError) => {
            this.emit('close',hadError);
        });

    }

    write(buffer)
    {
        this.socket.write(buffer);
    }

}

util.inherits(Connection, EventEmitter);

// ============================================================
// === Exports ================================================
// ============================================================

module.exports = Connection;