'use strict';

console.log('hello world!');

function Photo(fileName, fileType) {
  this.fileName = fileName;
  this.fileType = fileType;
}

var photos = [];

// Looks to see if the object is in the stores array
stores.containsPhoto = function(photo) {
  for (var eaIndex in this ) {
    if (this[eaIndex].fileName === photo.fileName) {
      return true;
    }
  }
  return false;
};


// Resets all the photos to the ones on file
photos.setPhotoObjects = function (){
  photos = [];
  var photosInfo = [
  ['bag', 		  'jpg'],
  ['banana', 		'jpg'],
  ['bathroom', 	'jpg'],
  ['boots', 		'jpg'],
  ['breakfast',	'jpg'],
  ['bubblegum', 'jpg'],
  ['chair', 		'jpg'],
  ['cthulhu', 	'jpg'],
  ['dog-duck', 	'jpg'],
  ['dragon', 		'jpg'],
  ['pen', 		  'jpg'],
  ['pet-sweep', 'jpg'],
  ['scissors', 	'jpg'],
  ['shark', 		'jpg'],
  ['sweep', 		'png'],
  ['tauntaun', 	'jpg'],
  ['unicorn', 	'jpg'],
  ['usb', 		  'gif'],
  ['water-can', 'jpg'],
  ['wine-glass','jpg']
  ];
  for(var ea in photosInfo){
    photos.push(
    new Photo( photosInfo[ea][0], photosInfo[ea][1] )
  );
  }
};
