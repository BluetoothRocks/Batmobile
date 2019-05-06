(function() {
  'use strict';

  class PoweredUp {
    constructor() {
      this._EVENTS = {};
      this._PROMISES = {};

      this._CHARACTERISTIC = null;

      this._QUEUE = [];
      this._WORKING = false;
    }

    connect() {
      return new Promise(async (resolve, reject) => {
        try {
          let device = await navigator.bluetooth.requestDevice({
            filters: [{
              namePrefix: 'HUB'
            }],
            optionalServices: [
              '00001623-1212-efde-1623-785feabcd123'
            ]
          });

          device.addEventListener('gattserverdisconnected', this._disconnect.bind(this));

          let server = await device.gatt.connect();
          let service = await server.getPrimaryService('00001623-1212-efde-1623-785feabcd123');

          this._CHARACTERISTIC = await service.getCharacteristic('00001624-1212-efde-1623-785feabcd123');
          this._CHARACTERISTIC.startNotifications();
          this._CHARACTERISTIC.addEventListener('characteristicvaluechanged', function(e) {
            // received...
          }.bind(this));


          resolve();
        } catch (error) {
          console.log('Could not connect! ' + error);
          reject();
        }
      });
    }

    drive(left, right) {
      // Forward
      if (left === 126 && right === -126) {
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, 1
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x00, 0x11, 0x51, 0x00, left
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x01, 0x11, 0x51, 0x00, right
          ]));
        // Backward
      } else if (left === -126 && right === 126) {
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, 2
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x00, 0x11, 0x51, 0x00, left
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x01, 0x11, 0x51, 0x00, right
          ]));
        // Left
      } else if (left === 126 && (right === 126 || right === -30)) {
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, 3
          ]));

        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x00, 0x11, 0x51, 0x00, left
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x01, 0x11, 0x51, 0x00, right
          ]));
        // Right
      } else if ((left === -126 || left === 30) && right === -126) {
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x32, 0x11, 0x51, 0x00, 4
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x00, 0x11, 0x51, 0x00, left
          ]));
        this._queue(
          new Uint8Array([
            0x08, 0x00, 0x81, 0x01, 0x11, 0x51, 0x00, right
          ]));
      }
    }

    stop() {
      this._queue(new Uint8Array([
        0x08, 0x00, 0x81, 0x00, 0x11, 0x51, 0x00, 0x00
      ]));
      this._queue(new Uint8Array([
        0x08, 0x00, 0x81, 0x01, 0x11, 0x51, 0x00, 0x00
      ]));
    }

    addEventListener(e, f) {
      this._EVENTS[e] = f;
    }

    isConnected() {
      return !!this._CHARACTERISTIC;
    }

    _disconnect() {
      console.log('Disconnected from GATT Server...');

      this._CHARACTERISTIC = null;

      if (this._EVENTS['disconnected']) {
        this._EVENTS['disconnected']();
      }
    }

    _queue(message) {
      var that = this;

      function run() {
        if (!that._QUEUE.length) {
          that._WORKING = false;
          return;
        }

        that._WORKING = true;

        that._CHARACTERISTIC.writeValue(that._QUEUE.shift()).then(() => run());
      }

      that._QUEUE.push(message);

      if (!that._WORKING) run();
    }
  }

  window.PoweredUp = new PoweredUp();
})();
