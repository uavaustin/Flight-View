'use strict';

const Database = require('./db/db');
const IPCServer = require('./net/base/ipc-server');
const HostServer = require('./net/host-server');

const mapboxStatic = require('../util/mapbox-static');

let coreServer = new IPCServer('core');
let activeServer = null;

coreServer.on('listening', () => {
    console.log('server listening');
});

coreServer.on('connect', (socket) => {
    console.log('socket connected');
});

coreServer.onMessage('start.solo', (message, socket) => {
    console.log('Running core in Solo mode.');

    activeServer = new HostServer(message.port, coreServer, socket, false);

    activeServer.listen();
});

coreServer.onMessage('stop', (message, socket) => {
    console.log('Stopping.');

    activeServer.stopListening();
});

coreServer.onMessage('map-cache-image',
        (message, socket) => {
    mapboxStatic.downloadRange(message.zoom, message.lat_1, message.lon_1,
            message.lat_2, message.lon_2, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('cache download complete');
        }
    });
});

coreServer.listen();
