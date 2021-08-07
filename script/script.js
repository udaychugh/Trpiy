var showmenu = document.getElementById("showmenu");
var menu = document.getElementById("menu");

document.getElementById("mypayments").style.display = "none";



menu.onclick = function () {
    document.getElementById("showmenu").style.width = "250px";
}

function closeNav() {
    document.getElementById("showmenu").style.width = "0px";
}

// main backend




//  Get total cost
let totalCostInput = document.querySelector("#total-cost-input").value;
let totalNights = document.querySelector("#total-nights-for-trip").value;

//  List of people
let personList = [];

let newPayment = 0;
let pplCounter = document.querySelector("#ppl-num");
pplCounter.value = 0;

//  Add a person button
const addPersonBtn = document.querySelector("#add-person");
const exportBtn = document.querySelector("#export-btn")


//  Want to add delete trash can in table
// const deletePersonBtn = document.querySelector("#deletePerson");

//  Event listeners
addPersonBtn.addEventListener("click", addPerson);
exportBtn.addEventListener("click", exportTable);


//  Handle enter button for input
document.getElementById("name-input").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
        addPersonBtn.click();
    }
});

document.getElementById("nights-select").addEventListener("keyup", function (event) {
    event.preventDefault();
    if (event.key === "Enter") {
        addPersonBtn.click();
    }
});


//  Handle on change of total cost
document.getElementById("total-cost-input").onchange = function () {
    // console.log("Cost changed...");
    totalCostInput = document.getElementById("total-cost-input").value;

    let costText = "";

    //  Validate the input 
    if (validateTotalCost(totalCostInput)) {
        costText = "";
        document.getElementById("cost-invalid").innerHTML = costText;
        updateTable();
    } else {
        costText = "Cost invalid"
        document.getElementById("cost-invalid").innerHTML = costText;
    }
};


//  TODO need to decide if i want to be able to change the total nights for the trip
//  Problems- tablenights for each person will not be updated
document.getElementById("total-nights-for-trip").onchange = function () {
    totalNights = document.getElementById("total-nights-for-trip").value;
    document.getElementById("total-nights-for-trip").disabled = true;
};

//  Add a person to the table
function addPerson() {
    document.getElementById("mypayments").style.display = "block";
    if (validateInput("Input")) {
        //  get the name and night values from the form
        let nameInput = document.getElementById("name-input").value;
        let nightsInput = document.getElementById("nights-select").value;


        //  Capitalize name
        // nameInput = nameInput.charAt(0).toUpperCase() + nameInput.slice(1);
        nameInput = nameInput.replace(/\w\S*/g, function (txt) {
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });

        let person = {
            name: nameInput,
            nights: nightsInput,
            payment: 0,
            adjustment: 0, // The adjustment to be made on the payment
        };

        //  Add to person list
        personList.push(person);

        //  reset the form
        document.getElementById("form-id").reset();

        updateTable();
    }
}

function calculatePaymentForEachPerson() {
    let nightsStaying = 0;
    let nonAdjustmentSum = 0;

    personList.forEach((person) => {
        nightsStaying = person.nights;
        //  Calculate the payment based on nights stayed
        person.payment = calculatePayment(nightsStaying);
        nonAdjustmentSum += person.payment;
        // console.log(person);
    });

    calculateAdjustment(nonAdjustmentSum);
}

//  Calculate the payment for the current row
function calculatePayment(nightsInput) {
    let perNight = 0;
    let noAdjustmentPayment = 0;

    //  Get the number of people
    let numberOfPPl = personList.length;

    //  Divide the total cost input by the amount of ppl, divide tthat by total nights to get the per night cost
    //  Get the per night cost
    perNight = totalCostInput / numberOfPPl / totalNights;
    // console.log(perNight);

    //  Without the adjustment the cost is the perNight * the users selected stay length
    noAdjustmentPayment = perNight * nightsInput;

    //  Round up for money
    noAdjustmentPayment = Math.ceil(noAdjustmentPayment * 100) / 100;

    //  Return the calculated payment
    return noAdjustmentPayment;
}

//  Calculate the adjustment
function calculateAdjustment(nonAdjustmentSum) {
    let adjustmentTotal = totalCostInput - nonAdjustmentSum;
    // console.log("Adjustment Total: " + adjustmentTotal);
    let adjustmentPerPerson = adjustmentTotal / personList.length;

    personList.forEach((person) => {
        person.adjustment = adjustmentPerPerson.toFixed(2);

        // console.log(person);
    });
}

//  Update the table with new array values
function updateTable() {
    let tableBody = document.getElementById("table-body");

    //  if the personList.length is != to the tableRows.length
    //  if rows == 0 we need to add a row
    let howManyPpl = personList.length;
    let howManyRows = tableBody.rows.length;

    //  Set the number of ppl
    pplCounter.value = howManyPpl;

    //  Calculate the payments for each person
    calculatePaymentForEachPerson();

    //  If there are no rows we need to add a person to the table
    if (howManyRows === 0 && personList != 0) {
        appendNewRow(howManyPpl);
    } else {
        // For each row in the table update the payment
        for (let i = 0; i < howManyRows; i++) {
            //  Update name and nights as well
            tableBody.rows[i].cells[0].innerHTML = personList[i].name;
            tableBody.rows[i].cells[1].innerHTML = personList[i].nights;

            // console.log("current row: " + i);
            let pymnt = (+personList[i].payment + +personList[i].adjustment).toFixed(
                2
            );
            // console.log("pymnt: "  + pymnt);
            tableBody.rows[i].cells[2].innerHTML = '&#8377; ' + pymnt;
            // console.log("Updating rows..")
        }

        //  If the amount of rows arent equal to the amount of ppl we need to append one
        if (howManyPpl != howManyRows) {
            //  Add the new person to the table
            appendNewRow(howManyPpl);
        }
    }

    //  If there are rows in the table we should add a button that allow the user to export to JSON, csv ...
    if (pplCounter.value > 0) {
        document.getElementById("export-btn").style.display = "block";
    } else {
        document.getElementById("export-btn").style.display = "none";
    }

}

var idval = 1;
//  Append a new row to the table
function appendNewRow(howManyPpl) {
    //  Get the correct index for the last person in the personList to add to table
    let personToAdd = howManyPpl - 1;

    idval++;

    let payment = (
        +personList[personToAdd].payment + +personList[personToAdd].adjustment
    ).toFixed(2);
    // console.log("payment:>>>>" + payment);

    //  Create a new row
    const newRow = document.createElement("tr");
    newRow.innerHTML =
        "<tr class='myflex'>" +
        "<td class='w-25 align-middle'>" +
        personList[personToAdd].name +
        "</td>" +
        "<td class='w-25 align-middle'>" +
        personList[personToAdd].nights +
        "</td>" +
        "<td class='w-25 align-middle' id='userpayemntamount'>" +
        '&#8377; ' + payment +
        "</td>" +
        "<td class='w-25 align-middle midme'>" +
        "<button id='paynow' class='btn paynow' onclick='showbill(this)'>Pay Now</button>" +
        "<button class='btn mr-5' onclick='editRow(this)' id='editbutton'><i class='fas fa-pencil-alt'></i></button>" +
        "<button class='btn' onclick='deletePerson(this);' id='deletebutton'><i class='fas fa-trash-alt'></i></button>" +
        "<span class='showpayornot'><span>"
    "</td>" +
    "</tr>";



    //  Append person to the table
    document.getElementById("table-body").appendChild(newRow);
}
var modal21 = document.getElementById("myModal2");

function showbill(row) {

    modal21.style.display = "block";
}

function closemymodal() {
    modal21.style.display = "none";
}

//window.onclick = function(event) {
//if (event.target == modal21) {
//modal21.style.display = "none";
//}
//}

//  Edit name and nights
function editRow(row) {
    //  Get modal from document body
    //  Fill the modal body with correct data from selected row.
    //  Save changes and update the table based on row index
    let rowToEdit = row.parentNode.parentNode.rowIndex;

    let personIndex = rowToEdit - 1;

    // console.log("Row to edit: " + rowToEdit);
    $("#editRowModal").modal("show");

    //  When the modal is opened i need to populate the modal with values from personList at rowIndex -1
    let name = document.getElementById("modal-name-input");
    let nights = document.getElementById("modal-nights-input");

    let saveBtn = document.getElementById("save-edit");

    //  Set the name placeholder to the current name in person list
    name.value = personList[personIndex].name;
    nights.value = personList[personIndex].nights;


    //  Handle enter button
    name.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.key === "Enter") {
            saveBtn.click();
        }
    });

    nights.addEventListener("keyup", function (event) {
        event.preventDefault();
        if (event.key === "Enter") {
            saveBtn.click();
        }
    });


    // Save changes on button press
    saveBtn.onclick = function () {
        if (validateInput("Edit")) {

            // Capitalize name
            name.value = name.value.replace(/\w\S*/g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });

            personList[personIndex].name = name.value;
            personList[personIndex].nights = nights.value;

            updateTable();

            $("#editRowModal").modal("hide");
        }
    };
}

//  Delete a person
function deletePerson(row) {
    let index = row.parentNode.parentNode.rowIndex;

    document
        .getElementById("paymentTable")
        .deleteRow(row.parentElement.parentElement.rowIndex);

    //  Remove that person from the person list as well
    //  array starts at 0 so remove 1 to get correct index
    // tableRows[1,2,3] array[0,1,2]
    personList.splice(index - 1, 1);

    //  When the row is deleted we need to the table
    updateTable();
}

//  Validate the input of the {addPerson, modalEdit} forms
function validateInput(inputOrEdit) {
    let inputValid = false;
    let validName, validNights;
    let nameText, nightText;

    // console.log(totalNights);

    if (inputOrEdit === "Input") {
        // Validate the input and change those elements in DOM
        let name = document.getElementById("name-input").value;
        let nights = parseInt(document.getElementById("nights-select").value);
        if (!name || !allLetterInput(name)) {
            nameText = "Please enter a valid name";
            validName = false;
        } else {
            nameText = "";
            validName = true;
        }

        if (isNaN(nights) || nights < 1 || nights > totalNights) {
            nightText = "Invalid days";
            validNights = false;
        } else {
            nightText = "";
            validNights = true;
        }

        if (validName && validNights) {
            inputValid = true;
        }

        document.getElementById("name-invalid").innerHTML = nameText;
        document.getElementById("number-invalid").innerHTML = nightText;
    } else if (inputOrEdit === "Edit") {
        // Validate the input and change those elements in DOM
        let name = document.getElementById("modal-name-input").value;
        let nights = parseInt(document.getElementById("modal-nights-input").value);

        // TODO make name not huge like 40 chars or something

        if (!name) {
            nameText = "Please enter a name";
            validName = false;
        } else {
            nameText = "";
            validName = true;
        }

        if (isNaN(nights) || nights < 1 || nights > totalNights) {
            nightText = "Invalid days";
            validNights = false;
        } else {
            nightText = "";
            validNights = true;
        }

        if (validName && validNights) {
            inputValid = true;
        }

        document.getElementById("modal-name-invalid").innerHTML = nameText;
        document.getElementById("modal-number-invalid").innerHTML = nightText;
    }

    return inputValid;
}

//  Export table to csv file
function exportTable() {

    //  Array to hold output values ( this is just to be able to calculate the payments and not show the adjustments...)
    let exportArray = [];
    let exPerson = ["Name", "Days", "Payment", "Bill Paid"];

    exportArray.push(exPerson);

    var showthisvalue;
    if (paidamount == 1) {
        showthisvalue = "Paid";
    } else {
        showthisvalue = "Unpaid";
    }

    personList.forEach(person => {

        exPerson = [
            person.name,
            person.nights,
            'Rs. ' + (+person.payment + +person.adjustment),
            showthisvalue
        ]

        exportArray.push(exPerson);
    });

    // console.log(exportArray);

    let csvContent = exportArray.map(e => e.join(",")).join("\n");

    //  TODO make sure this link stays hidden
    let link = document.createElement('a')
    link.id = 'download-csv'
    link.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(csvContent));
    link.setAttribute('download', 'report.csv');
    document.body.appendChild(link)
    document.querySelector('#download-csv').click()

}

document.getElementById("show-chart").addEventListener("click", showChart);

function buildChart(labels, values, chartTitle) {
    // chart here
    let mychart = document.getElementById('myChart').getContext('2d');

    let masspopchart = new Chart(mychart, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: chartTitle,
                data: values,
                backgroundColor: [
                'rgba(255, 99, 132, 0.6)',
                'rgba(54, 162, 235, 0.6)',
                'rgba(255, 206, 86, 0.6)',
                'rgba(28, 253, 253, 0.6)',
                'rgba(137, 25, 248, 0.6)',
                'rgba(30, 214, 58, 0.6)',
                'rgba(245, 22, 39, 0.6)',
                'rgba(255, 63, 47, 0.6)',
                'rgba(22, 123, 119, 0.6)',
                'rgba(152, 102, 255, 0.6)'
            ],
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 3,
                hoverBorderColor: '#000'

        }]
        },
        options: {
            repsonsive: true,

        }
    });
    return mychart;
}


function showChart() {
    var lelotable = document.getElementById("paymentTable");
    var lelojson = [];
    var leloheaders = [];

    for (var a = 0; a < lelotable.rows[0].cells.length; a++) {
        leloheaders[a] = lelotable.rows[0].cells[a].innerHTML.toLowerCase().replace(/ /gi, '');
    }

    for (var a = 1; a < lelotable.rows.length; a++) {
        var lelotablerow = lelotable.rows[a];
        var lelorowdata = {};
        for (var b = 0; b < lelotablerow.cells.length; b++) {
            lelorowdata[leloheaders[b]] = lelotablerow.cells[b].innerHTML;
        }
        lelojson.push(lelorowdata);
    }

    var labels = lelojson.map(function (e) {
        return e.name;
    });

    var values = lelojson.map(function (e) {
        return e.days;
    });

    var chart = buildChart(labels, values, "Days");
}

function allLetterInput(inputText) {
    let letters = /^(\w+\s)*\w.+$/;

    if (inputText.match(letters)) {
        return true;
    } else {
        return false;
    }

}

//  Function validate total cost input
function validateTotalCost(total) {
    if (total.match(/^\d+(\.\d{1,2})?$/)) {
        return true;
    } else {
        return false;
    }
}

var paidamount = 0;


function confirmpayment() {



    swal("Payemnt Successfull", "You Successfully Paid your amount of share", "success");
    document.getElementById("myModal2").style.display = "none";

    paidamount = 1;

    var bankname = document.getElementById("bankname").value = "Bank Name";
    var cardno = document.getElementById("cardno").value = "";
    var cardholder = document.getElementById("cardholder").value = "";
    var valid = document.getElementById("valid").value = "";
    var cvv = document.getElementById("cvv").value = "";

    //var paynow = document.querySelector(".paynowbuttonclass");
    //paynow.classList.remove("btn");
    //paynow.classList.add("paidbill");
    //paynow.disabled = "true";
    //paynow.innerHTML = "Paid";
    document.getElementById("paynow").remove();
    document.getElementById("editbutton").remove();
    document.getElementById("deletebutton").remove();

    //document.querySelector(".showpayornot").innerHTML = "Paid";

}


function importCSV() {


}
