const myChart = document.getElementById("myChart");
const btnSubmit = document.querySelector("#btnSelect");
const loanAmountArea = document.getElementById("loanAmount");
const loanTermArea = document.getElementById("payments");
const loanRateArea = document.getElementById("rate");
const chartArea = document.querySelector("#chartArea");
const formatter = new Intl.NumberFormat('en-US', {style: 'currency', currency: 'USD'});

let chartLabels = ['Principal', 'Interest'];
let tableHeaders = ['Month', 'Payment', 'Principal', 'Interest', 'Total Interest Paid', 'Remaining Balance'];
let lifetimeInt = 0;
let monthlyPmt = 0;
var lcChart;
let chartData = [];

function buildChart() {
    Chart.defaults.global.defaultFontFamily = 'Luckiest Guy';
    Chart.defaults.global.defaultFontSize = 18;
    Chart.defaults.global.defaultFontColor = '#777';

    lcChart = new Chart(myChart, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets:[{
                label: 'Totals',
              // data:[monthlyPmt, interestAmount],
                data: chartData,
                backgroundColor: ['blue', 'red'],
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 2,
                hoverBorderColor: '#000'
            }]
        },
        opitons: {
            title: {
                display: true,
                text: 'Monthly Totals for Loan',
                fontSize: 25
            },
            legend: {
                diplay: true,
                position: 'right',
                layout: {
                    padding:{left:0,right:0,bottom:0,top:0}
                }
            }, 
            tooltips:{
                enabled:true
            }
        }
    });

    
} //end build chart 

//Function buildTable 
function buildTable(){
    let myHTML = `
    <div id="tableContainer" class="row customTable">
        <div class="col-sm">
            <table id="lcTable" class="table table-striped table-bordered">
                <thead>
                    <tr id="tableHeaders">
                    </tr>
                </thead>
                <tbody id="tableBody">
                </tbody>
            </table>
        </div>
    </div>
    `;

    //insert the basic table structure 
    let pcTag = document.getElementById("pageContainer");
    pcTag.insertAdjacentHTML("beforeend", myHTML);

    //insert table headers
    tableHeaders.forEach(addTableHeader);

    //insert the data into the table body
    let totalPrincipalPaid = 0;
    let totalInterestPaid = 0;
    let remainingBalance = loanAmount - totalPrincipalPaid;
    for(let i=1; i<=loanTermArea.value; i++){
        //loop through data
        let interestAmount = remainingBalance * loanRateArea.value/1200;
        let principalAmount = monthlyPmt - interestAmount;
        let rowId = "row" + i;

        //keep track of totals
        totalPrincipalPaid += monthlyPmt - interestAmount;
        totalInterestPaid += interestAmount;
        remainingBalance = loanAmount - totalPrincipalPaid;

        //insert the table row element
        myHTML = `<tr id="` + rowId + `">`;
        document.getElementById("tableBody").insertAdjacentHTML("beforeend", myHTML);

        //insert data into rows
        let row = document.getElementById(rowId);

        // //insert the payment number 
        myHTML =  "<td>" + i + "</td>"
        row.insertAdjacentHTML("beforeend", myHTML);
 

        //insert payment amount
        myHTML = "<td>" + formatter.format(monthlyPmt) + "</td>"
        row.insertAdjacentHTML("beforeend", myHTML);

        //insert the prinicipal amount
        myHTML = "<td>" + formatter.format(principalAmount) + "</td>"
        row.insertAdjacentHTML("beforeend", myHTML);

        //insert interest amount
        myHTML = "<td>" + formatter.format(interestAmount) + "</td>"
        row.insertAdjacentHTML("beforeend", myHTML);

        //insert total interest paid
        myHTML = "<td>" + formatter.format(totalInterestPaid) + "</td>"
        row.insertAdjacentHTML("beforeend", myHTML);

        //insert remaining balance
        myHTML = "<td>" + formatter.format(remainingBalance) + "</td>"
        row.insertAdjacentHTML("beforeend", myHTML);
    
    } // end for loop 
    
} // end build table 

function addTableHeader(item) {
    document.getElementById("tableHeaders").insertAdjacentHTML("beforeend", `<th>${item}</th>`);
}

function addTableBody(pmtNum){

}

//calculate the monthly loan amount
function calculate(e) {

    if(loanAmount != 0) {
        lifetimeInt = 0;
        loanAmount = 0;
        monthlyPmt = 0;
    //    document.getElementById("tableContainer").remove();
    }

    e.preventDefault();

    let loanRate = loanRateArea.value;
    let pmtsCount = loanTermArea.value;

    let rate = loanRate/1200;
    let numerator = rate * ((1+rate)**pmtsCount);
    let denominator = ((1+ rate)**pmtsCount) - 1;

    loanAmount = loanAmountArea.value;
    monthlyPmt = loanAmount * (numerator/denominator);
    lifetimeInt = (monthlyPmt * pmtsCount) - loanAmount;
    let monthlyInt = loanAmount * rate;
    formatter.format(monthlyPmt);
    formatter.format(monthlyInt);
    chartData = [parseFloat(monthlyPmt).toFixed(2), monthlyInt.toFixed(2)];

    if(loanAmount != 0){
        if(lcChart){
            lcChart.data.datasets[0].data = chartData;

            lcChart.update();
        } else {
            buildChart();
        }
        buildTable();
    }
}

