'use strict';

const encoder = require('./parser').Encoder;
const decoder = require('./parser').Decoder;
const EventEmitter = require('events').EventEmitter;
const util = require('util');
const Socket = require('net').Socket;
const log = require('./logger');


class SocketClient
{
    constructor(options)
    {
        this.socket = new Socket();
        this.addEventListeners();
    }

    connect(port, onConnect)
    {
        this.port = port;
        this.socket.connect(this.port, onConnect);
    }

    addEventListeners()
    {
        this.socket.once('connect',() => {
            this.connected = true;
        });

        this.socket.on('data', (buffer) => {
            let messages = decoder.decode(buffer);
            messages.forEach((message) => {
                this.emit(message.event,message.data);
            });
        });

        this.socket.once('error', (error) => {
            this.emit('error', error);
        });

        this.socket.once('close', () => {
            this.emit('close');
            this.removeEventListeners();
            setTimeout( () => {
                this.connect();
                this.addEventListeners();
            },5000);
        });

    }

    removeEventListeners()
    {
        this.socket.removeListener('data', this.handleEvent);
    }

    send(event, data)
    {
        log.debug('Sending \'%s\' event.', event)
        this.socket.write(encoder.encode(event, data));
    }

}

util.inherits(SocketClient,EventEmitter);

module.exports = SocketClient;