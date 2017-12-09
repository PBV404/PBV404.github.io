
(function() {
  'use strict';

  var app = {
    isLoading: true,
	lastValue: false,
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
              return server.getPrimaryService('19b10001-e8f2-537e-4f6c-d104768a1214');
          })
          .then(service => {
              console.log('getting characteristic');
			  return service.getCharacteristic('19b10001-e8f2-537e-4f6c-120476801214');
          })
		  .then(characteristic => app.parseCharacteristic(characteristic))
          .catch(error => { console.log(error); });
  };

  app.parseCharacteristic = function(characteristic){
	console.log('> characteristic uuid = '+ characteristic.uuid + getSupportedProperties(characteristic));
	this.ledCharacteristic = characteristic;
  }
  
  app.sendValue= function(){
	let resetEnergyExpended;
	if(this.lastValue){
		resetEnergyExpended= Uint8Array.of(1);
	}
	else{
		resetEnergyExpended= Uint8Array.of(0);
	}
	this.lastValue = !this.lastValue;
	
    this.ledCharacteristic.writeValue(resetEnergyExpended).then(_ =>{console.log('value sent');});
  }

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
