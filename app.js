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
  this.perc = 0;
  items.push(this);
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////*!-- Begin tracker object --!*/////////////////////////////////////////////////////////////////////////////

// tracker object used to change images and update all properties
var tracker = {
  labels: [],
  click_data: [],
  shown_data: [],
  total_clicks: 0,
  img1: document.getElementById('img1'),
  img2: document.getElementById('img2'),
  img3: document.getElementById('img3'),

  sortedItems: [],
  sortedLabels: [],
  sortedPerc: [],

  selectedItems: [],

  // get three random values and push to an array
  pickIndices: function() {
    while (this.selectedItems.length < 3) {
      var number = Math.floor(Math.random() * items.length);
      if (this.selectedItems.indexOf(number) === -1) {
        this.selectedItems.push(number);
      }
    }
  },

  // convert random values to objects from index array
  convertIndices: function() {
    for (var index in this.selectedItems) {
      this.selectedItems[index] = items[this.selectedItems[index]];
    }
  },

  // update the images on the page
  updateImages: function() {
    img1.src = this.selectedItems[0].source;
    img2.src = this.selectedItems[1].source;
    img3.src = this.selectedItems[2].source;

    img1.name = this.selectedItems[0].name;
    img2.name = this.selectedItems[1].name;
    img3.name = this.selectedItems[2].name;

    art1.name = this.selectedItems[0].name;
    art2.name = this.selectedItems[1].name;
    art3.name = this.selectedItems[2].name;

    this.updateShown(this.selectedItems[0]);
    this.updateShown(this.selectedItems[1]);
    this.updateShown(this.selectedItems[2]);
  },

///////////////////////////////////////////

  clearSelectedItems: function() {
    tracker.selectedItems = [];
  },

  updateClicks: function(obj) {
    obj.clicks += 1;
  },

  updateShown: function(obj) {
    obj.shown += 1;
  },

  updateTotalClicks: function() {
    tracker.total_clicks += 1;
    console.log(tracker.total_clicks);
  },

  setLocalStorage: function() {
    var strItems = JSON.stringify(items);
    localStorage.setItem('Items', strItems);
    var strTotalClicks = JSON.stringify(this.total_clicks);
    localStorage.setItem('Clicks', strTotalClicks);
  },

  clickHelper: function(obj) {
    tracker.updateClicks(obj);
    tracker.updateTotalClicks();
    tracker.setLocalStorage();
    tracker.clearSelectedItems();
    tracker.doTheImageThing();
  },

  updateItem: function(event) {
    var name = event.target.name;
    console.log(name);
    if (name) {
      for (var obj in items) {
        if (items[obj].name === name) {
          tracker.clickHelper(items[obj]);
        }
      }
    }
  },

  doTheImageThing: function () {
    if (tracker.total_clicks < 15) {
      tracker.pickIndices();
      tracker.convertIndices();
      tracker.updateImages();
    } else {
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
    localStorage.clear();
    location.reload();
  },

  showTotalClicks: function() {
    var pTag = document.getElementById('clicks');
    pTag.textContent = 'Total Clicks: ' + tracker.total_clicks;
  },

///////// methods to create pie chart arrays ///////////////////////

  updatePercClicked: function() {
    for (var index in items) {
      items[index].perc = Math.floor(items[index].clicks / items[index].shown * 100);
    }
  },

  sortOutNanValues: function() {
    for (var index in items) {
      if (isNaN(items[index].perc) === false) {
        tracker.sortedItems.push(items[index]);
      }
    }
  },

  sortByPercClicked: function() {
    this.sortedItems.sort(function (a, b) {
      if (a.perc < b.perc) {
        return 1;
      }
      if (a.perc > b.perc) {
        return -1;
      }
      return 0;
    });

    var sortedItems = tracker.sortedItems.slice(0,5);

    for (var x in sortedItems) {
      tracker.sortedLabels[x] = sortedItems[x].name;
      tracker.sortedPerc[x] = sortedItems[x].perc;
    }
  },

  sortHelper: function() {
    this.updatePercClicked();
    this.sortOutNanValues();
    this.sortByPercClicked();
  },

/////////////////////////////////////////////////////////////

  updateChartData: function() {
    for (var index in items) {
      tracker.labels[index] = items[index].name;
      tracker.click_data[index] = items[index].clicks;
      tracker.shown_data[index] = items[index].shown;
    }
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
    canvas.style.visibility = 'visible';
  },

  renderPieChart: function() {
    var canvas = document.getElementById('pie');
    var ctx = canvas.getContext('2d');

    var piedata = {
      labels: tracker.sortedLabels,
      datasets: [
        {
          data: tracker.sortedPerc,
          backgroundColor: ['#de6b48','#31b3a3', '#655dab', '#f2e641', '#56b447']
        }
      ]
    };

    var pieChart = new Chart(ctx, {
      type: 'pie',
      data: piedata,
      options: {
        maintainAspectRatio: false,
        responsive: true,
        title: {
          display: true,
          text: 'Top Five Items by Percentage Clicked',
          fontSize: 24
        },
        legend: {
          position: 'bottom',
          labels: {
            fontSize: 24,
            boxWidth: 40
          }
        }
      }
    });
    canvas.style.visibility = 'visible';
  },

  renderCharts: function() {
    tracker.renderBarChart();
    tracker.sortHelper();
    tracker.renderPieChart();
    var results_button = document.getElementById('results_button');
    results_button.removeEventListener('click', tracker.renderCharts);
  }
};

//////////////////////*!--End tracker object --!*///////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

var images_section = document.getElementById('images');
images_section.addEventListener('click', tracker.updateItem);

var results_button = document.getElementById('results_button');
results_button.addEventListener('click', tracker.renderCharts);

var reset_button = document.getElementById('reset_button');
reset_button.addEventListener('click', tracker.resetPage);

/////////////////////////////////////////////////////////////////////////////////////////////////////////

(function getStoredData() {
  if (localStorage.Items) {
    var strTotalClicks = JSON.parse(localStorage.getItem('Clicks'));
    tracker.total_clicks = strTotalClicks;
    var strItems = JSON.parse(localStorage.getItem('Items'));
    for (var index in strItems) {
      items[index] = strItems[index];
    }
  } else {
    for (var name in images) {
      new Item(images[name]);
    }
  }
})();

/////////////////////////////////////////////////////////////////////////////////////////////////////////

tracker.doTheImageThing();
