'use strict';

console.log('hello world!');

var photos = [];
function Photo(fileName, fileType) {
  if (!fileName || fileName === fileType || parseInt(fileName) === NaN ) {
    throw fileName + ' or ' + fileType + ' is invalid for the constructor';
  }
  this.fileName = fileName;
  this.fileType = fileType;
  this.views = 0;
  this.likes = 0;
}

Photo.prototype.filePath = function() {
  return 'img/' + this.fileName + '.' + this.fileType;
};

Photo.prototype.isEqual = function (obj) {
  console.log('Comparing : ' + this + 'to ' + obj);
  if (this === obj) { return true; };
  return this.filePath() == obj.filePath();
};

Photo.prototype.creatingImageNode = function () {
  var nodeElement = docment.creaeElement('image');
  nodeElement.setAttribute('src', this.filePath());
  nodeElement.setAttribute('id', this.fileName);
  return nodeElement;
};

function PhotoSet(currentSet, previousSet) {
  this.current = currentSet;
  this.previous = previousSet ? previousSet : [];
}

PhotoSet.prototype.containsDuplicate = function () {

  if (!this.current || !this.previous) {
    throw 'Current or previous are no defined or they are null';
  }
  console.log('%$$$$$$$$');
  console.log(this.current);
  console.log(this.previous);

  for(var each1 in this.current) {
    console.log(this.current[each1]);
    if (contains(this.previous, this.current[each1])) { return true; }
  }
  console.log(this.previous);
  for(var each2 in this.previous) {
    console.log(this.previous[each2]);
    if (contains(this.current, this.previous[each2])) { return true; }
  }
  return false;
};

PhotoSet.prototype.createNewRandomSet = function(){
  var proposedSet = new PhotoSet(this.current, this.current);
  while(proposedSet.containsDuplicate()) {
    proposedSet = new PhotoSet(photos.pickThreeNonRepeating, this.current);
    console.log(proposedSet);
  }
  return proposedSet;
};

function contains(array, obj) {

  for (var eaIndex in array ) {
    if (obj['isEqual'] === undefined || array[eaIndex]['isEqual'] === undefined ) { // eslint-disable-line
      throw 'Contains expects objects to implement isEqual() method';
    }
    if (obj.isEqual(array[eaIndex])) {
      return true;
    }
  }
  return false;
};

photos.pickThreeNonRepeating = function () {
  var photosToPick = 3;
  var chosenPhotos = [];
  var indexes = [];
  while (indexes.length < photosToPick) {
    var randomNumber = Math.floor(Math.random() * this.length);
    if(indexes.indexOf(randomNumber) === -1) {
      indexes.push(randomNumber);
    }
  }
  for (var eap in indexes) {
    chosenPhotos.push(photos[indexes[eap]]);
  }
  return chosenPhotos;
};

// See if the object is in the photos array
photos.containsPhoto = function(photo) {
  return contains(this, photo);
};

// Resets all the photos to the ones on file
photos.setupPhotoObjects = function (){

  // resets the array contents with out removing prototype methods
  photos.splice(0,photos.length); // assigning a new array removes all added methods

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

  while(setsToDisplay < setsToDisplay) {




    setsToDisplay += 1;
  }
  // End of runs to display
}

//****************
/// START OF GAME
//****************

gameRunner(7);

console.log(photos);
photos.setupPhotoObjects();
console.log(photos);
var somePhotos = photos.pickThreeNonRepeating();
console.log(somePhotos);
console.log(photos.pickThreeNonRepeating());

var mySetOfPhotos = new PhotoSet(somePhotos, somePhotos);
console.log(mySetOfPhotos.containsDuplicate());
console.log(mySetOfPhotos.createNewRandomSet());
console.log(mySetOfPhotos.createNewRandomSet());
console.log(mySetOfPhotos.createNewRandomSet());




//End
