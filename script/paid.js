//document.getElementById("feedback").style.display = "block";

function getfeedback() {
    swal("Feedback Submitted", " ", "success");
    document.getElementById("feedback").style.visibility = "hidden";
}

document.getElementById("great").onclick = function () {
    //document.getElementById("feed1").style.backgroundColor = '#45f545';

    if (document.getElementById("feed2").style.backgroundColor != "#ffff3a") {
        document.getElementById("feed1").style.backgroundColor = '#45f545';
    }
}

document.getElementById("avg").onclick = function () {
    document.getElementById("feed2").style.backgroundColor = '#ffff3a';
}


document.getElementById("disapp").onclick = function () {
    document.getElementById("feed3").style.backgroundColor = '#fa2525';
}