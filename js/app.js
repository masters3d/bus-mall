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
  var somePhotos = photos.pickThreeNonRepeating();
  return new PhotoSet(somePhotos, somePhotos);
};

PhotoSet.prototype.createNewRandomSet = function(){
  var proposedSet = new PhotoSet(photos.pickThreeNonRepeating(), this.current);
  while(proposedSet.containsDuplicate()) {
    proposedSet = new PhotoSet(photos.pickThreeNonRepeating(), this.current);
  }
  return proposedSet;
};

// Free helper function
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

photos.getElementWithName = function(name) {
  for(var eea in this) {
    if (this[eea].fileName === name) {
      return this[eea];
    }
  }
  throw 'The name was not found in the phoros array';
};

photos.pickThreeNonRepeating = function () {
  var photosToPick = 3;
  var chosenPhotos = [];
  var indexes = [];
  while (indexes.length < photosToPick) {
    var randomNumber = Math.floor(Math.random() * this.length);
    if(!indexes.includes(randomNumber)) {
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

function creatingChartElementAtParent(parent) {
  var canvasNode = document.createElement('canvas');
  canvasNode.setAttribute('id', 'chart');

  var labels = [];
  var likes = [];
  var views = [];
  for(var eee = 0; eee < photos.length; eee++ ) {
    var element = photos[eee];
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
photos.setupPhotoObjects();
var photoSetToDisplay = PhotoSet.newSet();

var selectionWindow = document.getElementById('selectionWindow');
selectionWindow.displayNewSetOfImages = function(){
  selectionWindow.textContent = '';
  photoSetToDisplay = photoSetToDisplay.createNewRandomSet();
  selectionWindow.appendChild(photoSetToDisplay.creatingImageNodes());
};

function myClickHandler (event) {
  if (event.target.parentNode.className === 'imageSet') {
    var element = photos.getElementWithName(event.target.getAttribute('id'));
    element.likes += 1;
    currentClicks += 1;
    selectionWindow.displayNewSetOfImages();
    console.log(currentClicks);

    if (currentClicks === maxclicksallowed) {
      console.log('Game is done. Thanks for playing');
      creatingChartElementAtParent(selectionWindow);
      console.table(photos);
      selectionWindow.removeEventListener('click', myClickHandler);
    }
  }
};

selectionWindow.addEventListener('click', myClickHandler);
selectionWindow.displayNewSetOfImages();
