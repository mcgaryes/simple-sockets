'use strict';

const expect = require('chai').expect;
const encoder = require('../src/parser').Encoder;
const decoder = require('../src/parser').Decoder;

describe('Parser', function() {

    it('should encode messages correctly', function() {

        let encoded = encoder.encode('foo',{bar:'bar'});
        expect(String(encoded)).to.equal('<0>{"event":"foo","data":{"bar":"bar"}}<1>');

    });

    it('should decode messages correctly', function(){
        let buffer = new Buffer('<0>{"event":"foo","data":{"bar":"bar"}}<1>');
        let decoded = decoder.decode(buffer);
        expect(decoded[0].event).to.equal('foo');
        expect(decoded[0].data.bar).to.equal('bar');
    });

});
