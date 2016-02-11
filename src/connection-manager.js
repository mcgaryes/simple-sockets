'use strict';

// ============================================================
// === Imports ================================================
// ============================================================

const _ = require('underscore');
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Connection = require('./connection');
const log = require('./logger');

// ============================================================
// === Connection Manager =====================================
// ============================================================

let connections = [];

/**
 * Manages connections for the socket server.
 * @class ConnectionManager
 */
class ConnectionManager
{

    handleConnection(socket)
    {

        log.debug('Incoming connection...');

        if (!this.isConnectionAllowed(socket)) {
            log.info('Connection denied.');
            socket.destroy();
            return;
        }

        let connection = new Connection(socket);
        this.addConnection(connection);

        connection.on('data', (buffer, sender) => {
            log.info('Recieved data from connection %s...',sender.id);
            this.broadcast(buffer, sender);
        });

        connection.on('error', (error) => {
            log.info('Connection enountered error.');
            log.error(error);
            this.removeConnection(connection);
        });

        connection.on('close', (hadError) => {
            log.debug('Connection closed %s error.', hadError ? 'WITH':'WITHOUT');
            this.removeConnection(connection);
        });

    }

    broadcast(buffer, sender)
    {

        let cnxs = _.filter(connections, (connection) => {
            return connection.id != sender.id;
        });

        log.debug('Attempting to send data to %d connection(s)...', cnxs.length);

        cnxs.forEach((cnx) => {
            log.debug("Sending data to %s.",cnx.id);
            cnx.write(buffer);
        });
    }

    addConnection(connection)
    {
        log.debug('Adding connection (%s)...', connection.id);
        connections.push(connection);
        log.info('Connection added. %d total connection(s).', connections.length);
    }

    removeConnection(connection)
    {
        log.debug('Removing connection (%s)...', connection.id);
        connections = _.reject(connections, (c) => {
            return c.id === connection.id;
        });
        log.info('Connection removed. %d total connection(s) remaining.', connections.length);
    }

    isConnectionAllowed(socket)
    {
        return /.*(127\.0\.0\.1).*/gi.test(socket.address().address);
    }

}

util.inherits(ConnectionManager, EventEmitter);

// ============================================================
// === Exports ================================================
// ============================================================

module.exports = ConnectionManager;