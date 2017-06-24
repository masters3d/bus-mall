'use strict';

var photos = [];
var RatingStorage = {
  key: 'rateGamePhotos',
};

RatingStorage.getPhotosArray = function () {
  var objects = JSON.parse(localStorage.getItem(this.key));

  if (!objects) {
    RatingStorage.setupPhotoObjects();
    return photos;
  }

  return _privateConvertPlainObjectsToPhotos(objects);
};

// Resets all the photos to the ones on file
RatingStorage.setupPhotoObjects = function (){

  var photosInfo = ['bag.jpg', 'banana.jpg', 'bathroom.jpg', 'boots.jpg', 'breakfast.jpg', 'bubblegum.jpg', 'chair.jpg', 'cthulhu.jpg', 'dog-duck.jpg', 'dragon.jpg', 'pen.jpg', 'pet-sweep.jpg', 'scissors.jpg', 'shark.jpg', 'sweep.png', 'tauntaun.jpg', 'unicorn.jpg', 'usb.gif', 'water-can.jpg', 'wine-glass.jpg' ];

  for(var ea in photosInfo){
    var filename = photosInfo[ea].split('.')[0];
    var filetype = photosInfo[ea].split('.')[1];
    photos.push(
    new Photo(filename, filetype)
  );
  }
};

function _privateConvertPlainObjectsToPhotos(arrayObjs) {
  if (!arrayObjs) { throw 'arrayObjs not valid' + arrayObjs; };
  var temp_photos = [];
  for (var i3 = 0; i3 < arrayObjs.length; i3 += 1 ) {
    var each = arrayObjs[i3];
    temp_photos.push(new Photo(each.fileName, each.fileType, each.views, each.likes));
  }
  return temp_photos;
};

RatingStorage.loadState = function() {
  if (localStorage) {
    try {
      photos = this.getPhotosArray();
      var currentClicksStore = localStorage.getItem(this.key + 'currentClicks');
      currentClicks = parseInt(currentClicksStore);
      var currentPhotosToDisplay = JSON.parse(localStorage.getItem(this.key + 'photoSetToDisplay'));
      restoredSetOfPhotos = _privateConvertPlainObjectsToPhotos(currentPhotosToDisplay);
    }
    catch (e) {
      if (photos.length === 0) {
        RatingStorage.setupPhotoObjects();
      } else if (!currentClicks) {
        currentClicks = 0;
      } else {
        console.warn('Load state failed' + e);
      }
    }
  }
};

RatingStorage.saveState = function() {
  try {
    var stringPhotos = JSON.stringify(photos);
    localStorage.setItem(this.key, stringPhotos);
    localStorage.setItem(this.key + 'currentClicks', currentClicks);
    localStorage.setItem(this.key + 'photoSetToDisplay', JSON.stringify(photoSetToDisplay.current));
    return true;
  }
  catch (e) {
    console.warn('Save state failed' + e);
    return false;
  }
};

function Photo(fileName, fileType, views, likes ) {
  if ((!fileName || fileName === fileType) || parseInt(fileName) === NaN ) {
    throw fileName + ' or ' + fileType + ' is invalid for the constructor';
  }
  this.fileName = fileName;
  this.fileType = fileType;
  this.views = views ? views : 0 ;
  this.likes = likes ? likes : 0 ;
};

function _privateToUpperFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

Photo.prototype.titleName = function() {
  if (this.fileName !==  undefined && this.fileName !== null ) { // eslint-disable-line
    var name = this.fileName;
    return name.split('-')[0] === name ? _privateToUpperFirst(name) :
      _privateToUpperFirst(name.split('-')[0]) + ' ' + _privateToUpperFirst(name.split('-')[1]);
  } else {
    console.warn('Title Name was called on a null object');
  }
};

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
  nodeElement.setAttribute('id', this.fileName );
  nodeElement.setAttribute('alt', this.titleName() );
  nodeElement.setAttribute('title', this.titleName().toUpperCase());

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
  for(var eea in photos) {
    if (photos[eea].fileName === name) {
      return photos[eea];
    }
  }
  throw 'The name was not found in the phoros array';
};

RatingStorage.pickThreeNonRepeating = function () {
  var photosToPick = 3;
  var chosenPhotos = [];
  var indexes = [];
  while (indexes.length < photosToPick) {
    var randomNumber = Math.floor(Math.random() * photos.length);
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
RatingStorage.containsPhoto = function(photo) {
  return contains(photos, photo);
};

function creatingChartElementAtParent(parent) {
  var canvasNode = document.createElement('canvas');
  canvasNode.setAttribute('id', 'chart');

  var labels = [];
  var likes = [];
  var views = [];
  for(var eee = 0; eee < photos.length; eee++ ) {
    var element = photos[eee];
    labels.push(element.titleName());
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
var restoredSetOfPhotos = null;
RatingStorage.loadState();
var photoSetToDisplay = PhotoSet.newSet();
photoSetToDisplay.current = restoredSetOfPhotos ? restoredSetOfPhotos : photoSetToDisplay.current;
photoSetToDisplay = currentClicks ? photoSetToDisplay : PhotoSet.newSet();

var selectionWindow = document.getElementById('selectionWindow');

selectionWindow.displayImageSet = function(imageSet) {
  selectionWindow.appendChild(imageSet.creatingImageNodes());
};
selectionWindow.displayNewSetOfImages = function(){
  selectionWindow.textContent = '';
  photoSetToDisplay = photoSetToDisplay.createNewRandomSet();
  this.displayImageSet(photoSetToDisplay);
};
var infoText = document.getElementById('infoWindow');
infoText.updateTextCounter = function() {
  if (currentClicks > 0 && currentClicks < maxclicksallowed ) {
    this.textContent = currentClicks + ' selections out of ' + maxclicksallowed;
  } else if (currentClicks === maxclicksallowed) {
    var link = document.createElement('a');
    link.setAttribute('href', '');
    link.setAttribute('id', this.fileName);
    link.textContent = 'Play Again';
    selectionWindow.appendChild(link);
    this.textContent = 'Thanks for playing';
  }
};

function myClickHandler (event) {
  if (event.target.parentNode.className === 'imageSet') {
    var element = RatingStorage.getElementWithName(event.target.getAttribute('id'));
    element.likes += 1;
    currentClicks += 1;
    selectionWindow.displayNewSetOfImages();
    infoText.updateTextCounter();
    RatingStorage.saveState();

    if (currentClicks >= maxclicksallowed) {
      creatingChartElementAtParent(selectionWindow);
      console.table(photos);
      selectionWindow.removeEventListener('click', myClickHandler);
      currentClicks = 0;
      RatingStorage.saveState();
    }
  }
};

selectionWindow.addEventListener('click', myClickHandler);
selectionWindow.displayImageSet(photoSetToDisplay);
infoText.updateTextCounter();
