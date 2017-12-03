
(function() {
  'use strict';

  var app = {
    isLoading: true,
    visibleCards: {},
    spinner: document.querySelector('.loader'),
    cardTemplate: document.querySelector('.cardTemplate'),
    container: document.querySelector('.main'),
    addDialog: document.querySelector('.dialog-container'),
    
  };


  /*****************************************************************************
   *
   * Event listeners for UI elements
   *
   ****************************************************************************/

  document.getElementById('butScanDevice').addEventListener('click', function () {
      app.scanDevice();
  });
    
  document.getElementById('butAddCancel').addEventListener('click', function() {
    // Close the add new city dialog
    app.toggleAddDialog(false);
  });


  /*****************************************************************************
   *
   * Methods to update/refresh the UI
   *
   ****************************************************************************/

  // Toggles the visibility of the add new city dialog.
  app.toggleAddDialog = function(visible) {
    if (visible) {
      app.addDialog.classList.add('dialog-container--visible');
    } else {
      app.addDialog.classList.remove('dialog-container--visible');
    }
  };

/*****************************************************************************
   *
   * Methods to update model
   *
   ****************************************************************************/
  app.scanDevice = function () {
      console.log('scan devices');
      navigator.bluetooth.requestDevice({
          filters: [{
              services: ['19B10001- E8F2 - 537E-4F6C- D104768A1214']
          }]
      })
          .then(device => { console.log('connected !'); })
          .catch(error => { console.log(error); });
  };


    //on init:
  app.scanDevice();
})();
