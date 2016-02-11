'use strict';

const expect = require('chai').expect;
const Server = require('../index').Server;
const Socket = require('../index').Client;

var server;

describe('Sockets', function() {



    beforeEach(function() {
        // runs after each test in this block
        try {
            server = new Server();
            server.bind(7654);
        } catch (err) {
            console.log(err);
        }

    });

    afterEach(function() {
        // runs after each test in this block
        try {
            server.close();
        } catch (err) {
            console.log(err);
        }
    });

    it('should init', function() {
        let socket = new Socket();
        expect(socket).to.be.defined;
    });

    it('should be able to connect to servers',function() {
        let socket = new Socket();
        socket.connect(7654, () => {
            expect(socket.connected).to.be.truthy;
        });
    });

    it('should be able to send messages to other listening sockets',function(done) {

        let socket1 = new Socket();
        socket1.connect(7654);

        let socket2 = new Socket();
        socket2.connect(7654);

        socket2.on('foo',(data) => {
            expect(data.foo).to.equal('bar');
            done();
        });

        socket1.send('foo',{foo:'bar'});

    });

    it('should reconnect after being closed', function (done) {

        this.timeout(8000)

        let socket1 = new Socket({
            reconnectAfter:1000
        });

        socket1.connect(7654, () => {
            socket1.disconnect();
        });

        setTimeout(() => {
            expect(socket1.connected).to.be.truthy;
            done();
        },1500);


    });

});
