'use strict';

const log = require('./logger');
const _ = require('underscore');

/**
 *
 */
class Encoder
{
    encode(event,data)
    {
        return new Buffer('<0>' + JSON.stringify({ event:event, data:data }) + '<1>');
    }
}

/**
 *
 */
class Decoder
{
    decode(buffer)
    {

        let decoded = [];
        let encoded = String(buffer).trim();
        //let regex = /<0>([\d\w{":,}-]+)<1>/gi;
        let regex = /<0>(.*?)<1>/gi;
        let matches = encoded.match(regex);

        if (matches === null) {
            return decoded;
        }

        matches.forEach(() => {
            let message = regex.exec(encoded)[1];
            if (message !== null) {
                try {
                    decoded.push(JSON.parse(message));
                } catch (err) {
                    log.error(err);
                    return decoded;
                }
                decoded.push(message);
            }
        });

        return decoded;
    }
}

module.exports = {
    Encoder: new Encoder(),
    Decoder: new Decoder()
}