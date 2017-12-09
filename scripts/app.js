
(function() {
  'use strict';

  var app = {
    isLoading: true,
	ledCharacteristic: undefined,
    spinner: document.querySelector('.loader'),
    container: document.querySelector('.main'),
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butScanDevice').addEventListener('click', function () {
      app.scanDevice();
  });
  
  document.getElementById('butSendValue').addEventListener('click', function () {
      app.sendValue();
  });

  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/


/*****************************************************************************
   *
   * Methods to update model
   *
   ****************************************************************************/
  app.scanDevice = function () {
      console.log('scan devices');
      navigator.bluetooth.requestDevice({
          filters: [{
          //   services: ['19b10001-e8f2-537e-4f6c-d104768a1214'],
              name: 'LED'
              
          }],
          optionalServices: ['19b10001-e8f2-537e-4f6c-d104768a1214']
          
      })
          .then(device => {
              console.log(device.name);
              return device.gatt.connect();
          })
          .then(server => {
              console.log("Connected, getting services");
              console.log(server);
              return server.getPrimaryServices('19b10001-e8f2-537e-4f6c-d104768a1214');
          })
          .then(services => {
              let queue = Promise.resolve();
              services.forEach(service => {
                  queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
                      console.log('> Service: ' + service.uuid);
                      characteristics.forEach(characteristic => {
                          console.log('>> Characteristic: ' + characteristic.uuid + ' ' + getSupportedProperties(characteristic));
						  console.log('> Notify : '+ characteristic.notify);		
						  console.log('> Indicate: '+ characteristic.indicate);		
							   characteristic.readValue().then(value => {console.log('read characteristic value = '+value.getUint8(0));});
                      });
                  }));
              });
          })
          .catch(error => { console.log(error); });
  };


  function getSupportedProperties(characteristic) {
      let supportedProperties = [];
      for (const p in characteristic.properties) {
          if (characteristic.properties[p] === true) {
              supportedProperties.push(p.toUpperCase());
          }
      }
      return '[' + supportedProperties.join(', ') + ']';
  }

    //on init:
  app.scanDevice();
})();
