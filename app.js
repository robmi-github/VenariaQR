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
function beep(ok){const c=new(window.AudioContext||window.webkitAudioContext)();const o=c.createOscillator();o.frequency.value=ok?1200:250;o.connect(c.destination);o.start();o.stop(c.currentTime+(ok?0.15:0.45));}

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
 if(!scanning) return;
 await stopScanner();
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
