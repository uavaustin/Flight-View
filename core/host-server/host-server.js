'use strict';

const EventEmitter = require('events');

const express = require('express');

const InteropClient = require('../net/interop-client');
const Telemetry = require('./telemetry');
const Targets = require('./targets');

const DEFAULT_PORT = 25005;

module.exports = class HostServer extends EventEmitter {
  constructor(coreServer, coreSocket, port) {
    super();

    this._port = port || DEFAULT_PORT;

    this._httpServer = null;
    this._app = express();

    this._app.locals.hostServer = this;
    this._app.locals.coreServer = coreServer;
    this._app.locals.coreSocket = coreSocket;
    this._app.locals.interopClient = new InteropClient(this);
    this._app.locals.telemetry = new Telemetry(this);
    this._app.locals.targets = new Targets(this, this.interopClient);
  }

  listen() {
    this._httpServer = this._app.listen(this._port);
  }

  close() {
    this._httpServer.close();
    this.telemetry.stop();
    this.targets.stop();
    this.interopClient.stop();
  }

  broadcast(message) {
    this.coreSocket.send(message);
  }

  get coreServer() {
    return this._app.locals.coreServer;
  }

  get coreSocket() {
    return this._app.locals.coreSocket;
  }

  get interopClient() {
    return this._app.locals.interopClient;
  }

  get telemetry() {
    return this._app.locals.telemetry;
  }

  get targets() {
    return this._app.locals.targets;
  }
};
