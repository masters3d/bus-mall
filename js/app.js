'use strict';

console.log('hello world!');


var photoskey = 'rateGamePhotos';
var _fallBackArray = [];

var RatingStorage = {
  // photos : []
};

Object.defineProperties(RatingStorage, { 'photos': {
  get: function() { return this._privateGetPhotos(); },
  set: function(value) { this._privateSetPhotos(value); }
}
}
);

console.log(RatingStorage);

RatingStorage._privateConvertPlainObjectsToPhotos = function(arrayObjs){
  var local_photos = arrayObjs;
  var temp_photos = [];
  for (var i3 = 0; i3 < local_photos.length; i3 += 1 ) {
    var each = local_photos[i3];
    console.log(each);
    temp_photos.push(new Photo(each.fileName, each.fileType, each.views, each.likes));
  }
  return temp_photos;
};

RatingStorage._privateGetPhotos = function() {
  if (localStorage) {
    try {
      var result = JSON.parse(localStorage.getItem(photoskey));
      if (result) {
        //this.photos = [];
        return this._privateConvertPlainObjectsToPhotos(result);
      }
      throw 'JSON parsed came back as Nul';
    }
    catch (e) {
      console.log('Caught an error: ' + e );
      // First time it runs set up the initial logic
      // if (_fallBackArray.length === 0) {
      //   this.setupPhotoObjects();
      // }
      return _fallBackArray;
    }
  }
};

RatingStorage._privateSetPhotos = function(array) {
  console.log('The set method is getting called');
  try {
    localStorage.setItem(photoskey, JSON.stringify(array));
  }
  catch (e) {
    console.log('Caught an error: ' + e );
    _fallBackArray = array;
  }
};

// RatingStorage.photos = [];
function Photo(fileName, fileType, views, likes) {
  if (!fileName || fileName === fileType || parseInt(fileName) === NaN ) {
    throw fileName + ' or ' + fileType + ' is invalid for the constructor';
  }
  this.fileName = fileName;
  this.fileType = fileType;
  this.views = views ? views : 0;
  this.likes = likes ? likes : 0;
}

Photo.prototype.statsAsString = function() {
  var toRetun =  this.fileName + ':   ' + 'clicks: ' + this.likes + ' , ' + 'views: ' + this.views;
  return toRetun;
};

Photo.prototype.filePath = function() {
  return 'img/' + this.fileName + '.' + this.fileType;
};

Photo.prototype.isEqual = function (obj) {
  if (this === obj) { return true; };
  return this.filePath() == obj.filePath();
};

// Everyt time we create a node we update the view count
Photo.prototype.creatingImageNode = function () {
  var nodeElement = document.createElement('img');
  nodeElement.setAttribute('src', this.filePath());
  nodeElement.setAttribute('id', this.fileName);
  this.views += 1;
  RatingStorage.setElementWithName(this.fileName, this);
  return nodeElement;
};

function PhotoSet(currentSet, previousSet) {
  this.current = currentSet;
  this.previous = previousSet ? previousSet : [];
}

PhotoSet.prototype.creatingImageNodes = function () {
  var nodeElement = document.createElement('div');
  nodeElement.setAttribute('class', 'imageSet');
  for (var eai in this.current) {
    var element = this.current[eai];
    nodeElement.appendChild(element['creatingImageNode']());
  }
  return nodeElement;
};

PhotoSet.prototype.containsDuplicate = function () {
  if (!this.current || !this.previous) {
    throw 'Current or previous are no defined or they are null';
  }

  for(var each1 in this.current) {
    if (contains(this.previous, this.current[each1])) { return true; }
  }
  for(var each2 in this.previous) {
    if (contains(this.current, this.previous[each2])) { return true; }
  }
  return false;
};

PhotoSet.newSet = function() {
  var somePhotos = RatingStorage.pickThreeNonRepeating();
  return new PhotoSet(somePhotos, somePhotos);
};

PhotoSet.prototype.createNewRandomSet = function(){
  var proposedSet = new PhotoSet(RatingStorage.pickThreeNonRepeating(), this.current);
  while(proposedSet.containsDuplicate()) {
    proposedSet = new PhotoSet(RatingStorage.pickThreeNonRepeating(), this.current);
  }
  return proposedSet;
};

// Free helper function
function contains(array, obj) {

  for (var eaIndex in array ) {
    console.log(array);
    if (obj['isEqual'] === undefined || array[eaIndex]['isEqual'] === undefined ) { // eslint-disable-line
      throw 'Contains expects objects to implement isEqual() method';
    }
    if (obj.isEqual(array[eaIndex])) {
      return true;
    }
  }
  return false;
};

RatingStorage.getElementWithName = function(name) {
  for(var eea in RatingStorage.photos) {
    if (RatingStorage.photos[eea].fileName === name) {
      return RatingStorage.photos[eea];
    }
  }
  throw 'The name was not found in the phoros array';
};

RatingStorage.setElementWithName = function(name, value) {
  for(var index = 0; index < RatingStorage.photos.length ; index ++ ) {
    if (RatingStorage.photos[index].fileName === name) {
      RatingStorage.photos[index] = value;
      // exist after assigment
      return;
    }
  }
};

RatingStorage.pickThreeNonRepeating = function () {
  var photosToPick = 3;
  var chosenPhotos = [];
  var indexes = [];
  var local_photos =  RatingStorage.photos;
  if (local_photos.length === 0) {
    throw 'The photos array is Zero. Expected full array';
  }
  while (indexes.length < photosToPick) {
    var randomNumber = Math.floor(Math.random() * local_photos.length);
    if(!indexes.includes(randomNumber)) {
      indexes.push(randomNumber);
    }
  }
  for (var eap in indexes) {
    chosenPhotos.push(local_photos[indexes[eap]]);
  }
  return chosenPhotos;
};

// See if the object is in the photos array
RatingStorage.containsPhoto = function(photo) {
  return contains(RatingStorage.photos, photo);
};

// Resets all the photos to the ones on file
RatingStorage.setupPhotoObjects = function (){

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
  var temp_photos = [];
  for(var ea in photosInfo){
    temp_photos.push(
      new Photo( photosInfo[ea][0], photosInfo[ea][1], photosInfo[ea][2], photosInfo[ea][3])
  );
  }
  //RatingStorage.photos = temp_photos ;
  console.log(temp_photos);
  RatingStorage.photos = temp_photos;
  return temp_photos;
};

function creatingChartElementAtParent(parent) {
  var canvasNode = document.createElement('canvas');
  canvasNode.setAttribute('id', 'chart');

  var labels = [];
  var likes = [];
  var views = [];
  var local_photos = RatingStorage.photos;
  for(var eee = 0; eee < local_photos.length; eee++ ) {
    var element = local_photos[eee];
    labels.push(element.fileName);
    views.push(element.views);
    likes.push(element.likes);

  }
  parent.appendChild(canvasNode);
  chart(canvasNode, labels, views, likes );
};


function chart (canvas, labelsArray, viewsArray, likesArray) {
  var ctx = canvas.getContext('2d');

  // modeled after the Getting Started example in the chartJS docs
  new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: labelsArray,
      datasets: [
        {
          label: 'Number of Likes',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: likesArray,
        },
        {
          label: 'Number of Views',
          backgroundColor: 'rgb(255, 150, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: viewsArray,
        }
      ],
    },

    // Configuration options go here
    options: {
      scales: {
        yAxes: [{
          ticks: {
            // beginAtZero: true,
          }
        }],
      //   ,
        xAxes: [{stacked: true}],
      }
    }
  });
}

//*****************
/// START OF GAME
//*****************

var maxclicksallowed =  25;
var currentClicks = 0;

RatingStorage.setupPhotoObjects();
var photoSetToDisplay = PhotoSet.newSet();

var selectionWindow = document.getElementById('selectionWindow');
selectionWindow.displayNewSetOfImages = function(){
  selectionWindow.textContent = '';
  photoSetToDisplay = photoSetToDisplay.createNewRandomSet();
  selectionWindow.appendChild(photoSetToDisplay.creatingImageNodes());
};

function myClickHandler (event) {
  if (event.target.parentNode.className === 'imageSet') {
    var element = RatingStorage.getElementWithName(event.target.getAttribute('id'));
    element.likes += 1;
    RatingStorage.setElementWithName(element.fileName, element);
    currentClicks += 1;
    selectionWindow.displayNewSetOfImages();
    console.log(currentClicks);

    if (currentClicks === maxclicksallowed) {
      console.log('Game is done. Thanks for playing');
      creatingChartElementAtParent(selectionWindow);
      console.table(RatingStorage.photos);
      console.table(_fallBackArray);
      selectionWindow.removeEventListener('click', myClickHandler);
    }
  }
};

selectionWindow.addEventListener('click', myClickHandler);
selectionWindow.displayNewSetOfImages();
