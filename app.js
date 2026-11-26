// Sostituire la precedente gestione scanner con questo codice

let scannerRunning = false;
let html5QrCode = null;

async function startScanner() {
    document.getElementById("nextBtn").style.display = "none";

    if (!html5QrCode) {
        html5QrCode = new Html5Qrcode("reader");
    }

    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 10, qrbox: 250 },
            onScanSuccess
        );

        scannerRunning = true;

    } catch (err) {
        console.error(err);
    }
}

async function onScanSuccess(decodedText) {

    if (!scannerRunning) return;

    scannerRunning = false;

    try {
        await html5QrCode.stop();
    } catch (e) {
        console.error(e);
    }

    validateTicket(decodedText);

    document.getElementById("nextBtn").style.display = "inline-block";
}

document.getElementById("nextBtn").addEventListener("click", () => {
    startScanner();
});

startScanner();
