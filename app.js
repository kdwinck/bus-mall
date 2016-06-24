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

// create all the item objects
for (var index in images) {
  new Item(images[index]);
}

console.log(items);
