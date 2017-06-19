'use strict';

console.log('hello world!');

function Photo(fileName, fileType) {
  if (!fileName || fileName === fileType || parseInt(fileName) === NaN ) {
    throw fileName + ' or ' + fileType + ' is invalid for the constructor';
  }
  this.fileName = fileName;
  this.fileType = fileType;
  this.views = 0;
  this.likes = 0;
  this.filePath = 'img/' + fileName + fileType;
}

var photos = [];

// See if the object is in the photos array
photos.containsPhoto = function(photo) {
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

function gameRunner(runsToDisplay){
  var setsToDisplay = runsToDisplay ? runsToDisplay : 25;
  photos.setPhotoObjects();
  while(setsToDisplay < setsToDisplay) {




    setsToDisplay += 1;
  }
  // End of runs to display
}


gameRunner(7);
console.log(photos);




//End
