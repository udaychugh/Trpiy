//document.getElementById("feedback").style.display = "block";

function getfeedback() {
    swal("Feedback Submitted", " ", "success");
    document.getElementById("feedback").style.visibility = "hidden";
    var h2 = document.createElement("h2");
    h2.innerHTML = "Thank You for your Feedback";
    document.getElementById("mysection").appendChild(h2);
}

document.getElementById("great").onclick = function () {
    //document.getElementById("feed1").style.backgroundColor = '#45f545';

    if (document.getElementById("feed2").style.backgroundColor != "#ffff3a" || document.getElementById("feed2").style.backgroundColor != "#fa2525") {
        document.getElementById("feed1").style.backgroundColor = '#45f545';
    }
}

document.getElementById("avg").onclick = function () {
    
    if (document.getElementById("feed1").style.backgroundColor != "#45f545" || document.getElementById("feed3").style.backgroundColor != "#fa2525") {
        document.getElementById("feed2").style.backgroundColor = '#ffff3a';
    }
    
    
}


document.getElementById("disapp").onclick = function () {
    
    if (document.getElementById("feed1").style.backgroundColor != "#45f545" || document.getElementById("feed2").style.backgroundColor != "#ffff3a") {
        document.getElementById("feed3").style.backgroundColor = '#fa2525';
    }
    
}


