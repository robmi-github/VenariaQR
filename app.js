let html5QrCode=null;
let scanning=false;
const resultDiv=document.getElementById("result");
const countSpan=document.getElementById("count");
const startBtn=document.getElementById("startBtn");
const nextBtn=document.getElementById("nextBtn");
const resetBtn=document.getElementById("resetBtn");
let validCount=parseInt(localStorage.getItem("validCount")||"0");
countSpan.textContent=validCount;

function save(){localStorage.setItem("validCount",validCount);}


let audioCtx = null;

async function unlockAudio() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  if (audioCtx.state === "suspended") {
    await audioCtx.resume();
  }
}

function beep(ok) {
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.type = "sine";

  const frequency = ok ? 1200 : 350;
  const duration = ok ? 0.20 : 0.50;

  oscillator.frequency.setValueAtTime(
    frequency,
    audioCtx.currentTime
  );

  gainNode.gain.setValueAtTime(
    0.5,
    audioCtx.currentTime
  );

  gainNode.gain.exponentialRampToValueAtTime(
    0.001,
    audioCtx.currentTime + duration
  );

  oscillator.start();
  oscillator.stop(audioCtx.currentTime + duration);
}


async function stopScanner(){
 if(html5QrCode && scanning){
  scanning=false;
  try{await html5QrCode.stop();}catch(e){}
 }
}

function validateTicket(text){
 const ok=text.toLowerCase().includes('venaria');
 if(ok){
  resultDiv.className='valid';
  resultDiv.textContent='✅ Biglietto valido';
  validCount++;
  countSpan.textContent=validCount;
  save();
 }else{
  resultDiv.className='invalid';
  resultDiv.textContent='❌ Biglietto NON valido';
 }
 beep(ok);
 nextBtn.style.display='inline-block';
}

async function onScanSuccess(decodedText){
    // blocco immediato delle letture successive
    if (!scanning) {
        return;
    }

    scanning = false;

    resultDiv.textContent = "Verifica in corso...";

    try {
        await html5QrCode.stop();
    } catch (e) {
        console.error(e);
    }

    validateTicket(decodedText);
}

async function startScanner(){
 nextBtn.style.display='none';
 resultDiv.className='';
 resultDiv.textContent='Inquadra un QR Code';
 if(!html5QrCode){html5QrCode=new Html5Qrcode('reader');}
 await html5QrCode.start(
 {facingMode:'environment'},
 {fps:10,qrbox:250},
 onScanSuccess
 );
 scanning=true;
}

startBtn.addEventListener('click',startScanner);
nextBtn.addEventListener('click',startScanner);
resetBtn.addEventListener('click',()=>{validCount=0;save();countSpan.textContent='0';});
if('serviceWorker' in navigator){navigator.serviceWorker.register('service-worker.js');}
