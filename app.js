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

// update the total of times shown when this image is selected
Item.prototype.updateShown = function() {
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
  labels: [],
  click_data: [],
  shown_data: [],
  perc_clicked: [],
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
    img2.src = tracker.selectedItems[1].source;
    img3.src = tracker.selectedItems[2].source;

    img1.name = tracker.selectedItems[0].name;
    img2.name = tracker.selectedItems[1].name;
    img3.name = tracker.selectedItems[2].name;

    art1.name = tracker.selectedItems[0].name;
    art2.name = tracker.selectedItems[1].name;
    art3.name = tracker.selectedItems[2].name;

    tracker.selectedItems[0].updateShown();
    tracker.selectedItems[1].updateShown();
    tracker.selectedItems[2].updateShown();
  },

  clearSelectedItems: function() {
    tracker.selectedItems = [];
  },

  updateClicks: function(obj) {
    obj.clicks += 1;
  },

  updateClickTotals: function() {
    tracker.total_clicks += 1;
  },

  clickHelper: function(obj) {
    tracker.updateClicks(obj);
    tracker.updateClickTotals();
    tracker.clearSelectedItems();
    tracker.doTheImageThing();
  },

  updateItem: function(event) {
    var name = event.target.name;
    if (name !== 'images') {
      for (var obj in tracker.selectedItems) {
        if (tracker.selectedItems[obj].name === name) {
          tracker.clickHelper(tracker.selectedItems[obj]);
        }
      }
    } else {
      alert('Warning! You did not click an image just now. Please click within the image.');
    }
  },

  doTheImageThing: function () {
    tracker.pickIndices();
    tracker.convertIndices();
    tracker.updateImages();
    if (tracker.total_clicks === 15) {
      tracker.cancelClickListener();
      tracker.showTotalClicks();
      tracker.showButton('results_button');
      tracker.showButton('reset_button');
    }
  },

  showButton: function(id) {
    document.getElementById(id).className = 'show';
  },

  cancelClickListener: function() {
    images_section.removeEventListener('click', tracker.updateItem);
  },

  resetPage: function() {
    location.reload();
  },

  showTotalClicks: function() {
    var pTag = document.getElementById('clicks');
    pTag.textContent = 'Total Clicks: ' + tracker.total_clicks;
  },

  updateChartData: function() {
    for (var index in items) {
      tracker.labels[index] = items[index].name;
      tracker.click_data[index] = items[index].clicks;
      tracker.shown_data[index] = items[index].shown;
      tracker.perc_clicked[index] = (Math.round(items[index].clicks / items[index].shown * 10) / 10) * 100;
    }
    console.log(tracker.perc_clicked);
  },

  renderBarChart: function() {
    var canvas = document.getElementById('bar');
    var ctx = canvas.getContext('2d');

    tracker.updateChartData();

    var data = {
      labels: tracker.labels,
      datasets: [
        {
          label: 'Times Chosen',
          backgroundColor: 'rgba(255,99,132,0.2)',
          borderColor: 'rgba(255,99,132,1)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(255,99,132,0.5)',
          data: tracker.click_data
        },
        {
          label: 'Times Shown',
          backgroundColor: 'rgba(26, 200, 217,0.2)',
          borderColor: 'rgb(15, 142, 235)',
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(6, 112, 189, 0.5)',
          data: tracker.shown_data
        }
      ]
    };

    var barChart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          yAxes: [{
            ticks: {
              stepSize: 1
            }
          }]
        }
      }
    });

    var results_button = document.getElementById('results_button');
    results_button.removeEventListener('click', tracker.renderBarChart);
    canvas.style.visibility = 'visible';
  }
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////

var images_section = document.getElementById('images');
images_section.addEventListener('click', tracker.updateItem);

var results_button = document.getElementById('results_button');
results_button.addEventListener('click', tracker.renderBarChart);

var reset_button = document.getElementById('reset_button');
reset_button.addEventListener('click', tracker.resetPage);

tracker.doTheImageThing();
