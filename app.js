// create global variables
var images = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var items = [];

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// item object constructor
function Item(name) {
  this.name = name;
  this.source = 'img/' + name + '.jpg';
  this.clicks = 0;
  this.shown = 0;
  items.push(this);
}

Item.prototype.updateClicks = function() {
  // update the clicks total of this item
  this.clicks += 1;
};

Item.prototype.updateShown = function() {
  // update the total of times shown when this image is selected
  this.shown += 1;
};

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// create all the item objects
for (var index in images) {
  new Item(images[index]);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tracker object used to change images and update all properties
var tracker = {
  total_clicks: 0,
  img1: document.getElementById('img1'),
  img2: document.getElementById('img2'),
  img3: document.getElementById('img3'),
  selectedItems: [],

  // get three random values and push to an array
  pickIndices: function() {
    while (tracker.selectedItems.length < 3) {
      var number = Math.floor(Math.random() * items.length);
      if (tracker.selectedItems.indexOf(number) === -1) {
        tracker.selectedItems.push(number);
      }
    }
  },

  // convert random values to objects from index array
  convertIndices: function() {
    for (var index in tracker.selectedItems) {
      tracker.selectedItems[index] = items[tracker.selectedItems[index]];
    }
  },

  // update the images on the page
  updateImages: function() {
    img1.src = tracker.selectedItems[0].source;
    tracker.selectedItems[0].updateShown();
    img2.src = tracker.selectedItems[1].source;
    tracker.selectedItems[1].updateShown();
    img3.src = tracker.selectedItems[2].source;
    tracker.selectedItems[2].updateShown();
  },

  clearSelectedItems: function() {
    tracker.selectedItems = [];
  },

  updateClickTotals: function() {
    tracker.total_clicks += 1;
  },

  updateItem: function() {
    var index = parseInt(this.name);
    tracker.selectedItems[index].updateClicks();
    tracker.updateClickTotals();
    tracker.clearSelectedItems();
    tracker.doTheImageThing();
  },

  doTheImageThing: function () {
    tracker.pickIndices();
    tracker.convertIndices();
    tracker.updateImages();
    if (tracker.total_clicks === 15) {
      tracker.cancelClickListenter();
      tracker.createResultsButton();
    }
  },

  createResultsButton: function() {
    document.getElementById('button').className = 'show';
  },

  cancelClickListenter: function() {
    image1.removeEventListener('click', tracker.updateItem);
    image2.removeEventListener('click', tracker.updateItem);
    image3.removeEventListener('click', tracker.updateItem);
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

var image1 = tracker.img1;
var image2 = tracker.img2;
var image3 = tracker.img3;

image1.addEventListener('click', tracker.updateItem);
image2.addEventListener('click', tracker.updateItem);
image3.addEventListener('click', tracker.updateItem);

tracker.doTheImageThing();
