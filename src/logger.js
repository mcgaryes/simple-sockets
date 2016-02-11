'use strict';

// ============================================================
// ==== Imports ===============================================
// ============================================================

const tracer = require('tracer');

// ============================================================
// === Exports ================================================
// ============================================================

module.exports = tracer.console({
    level: 'debug',
    format : ['{{timestamp}} [{{title}}] ({{file}}:{{line}}) {{message}}'],
    dateformat : 'HH:MM:ss.L',
    preprocess :  (data) => {
        data.title = data.title.toUpperCase();
        data.file = data.file.split('.')[0];
    }
});