// create global variables
var images = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];
var items = [];

// item object constructor
function Item(name) {
  this.name = name;
  this.source = name + '.jpg';
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

// create all the item objects
for (var index in images) {
  new Item(images[index]);
}

console.log(items); //check to make sure objects exist

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// tracker object used to change images and update all properties
var tracker = {
  total_clicks: 0,
  img1: document.getElementById('img1'),
  img2: document.getElementById('img2'),
  img3: document.getElementById('img3'),

  pickImages: function() {
    // pick images and updated divs
  },

  updateImages: function() {
    // update divs with seleted images
  },

  updateClickTotals: function() {
    this.total_clicks += 1;
  },

  cancelClickListenter: function() {
    //cancel listener after total_clicks = 15
  }
};

console.log(tracker.total_clicks);
tracker.updateClickTotals();
console.log(tracker.total_clicks);
// toDo add click event listener to items divs
