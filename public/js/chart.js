
const ctx = document.getElementById('myChart');
var chartType = 'pie';
let chart = undefined;

function createChart(chartType) {
  chart = new Chart(ctx, {
    type: chartType,
    data: {
      labels: chartLabel,
      datasets: [{
        label: 'number of student :',
        data: chartData,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
            display: true,
            position: 'bottom'
        },
        title: {
            display: true,
            text: 'Skills',
            font: {
                size: 18
            }
        }
    },
      scales: {
        y: {
          beginAtZero: true 
        }
      }
    }
  });
}

createChart('pie');

function changeBarType(btn, createChart) {
  let btnValue = btn.innerText;
  if (btnValue == 'Bar Chart') {
    chartType = 'bar';
  } else if (btnValue == 'Line Chart') {
    chartType = 'line';
  } else if (btnValue == 'Pie Chart') {
    chartType = 'pie';
  }
  if (chart) {
    chart.destroy()
  }
  createChart(chartType)
}
