const resultDiv=document.getElementById("result");
const nextBtn=document.getElementById("nextBtn");
let scanner;

function onScanSuccess(decodedText){
 scanner.clear().then(()=>{
   validateTicket(decodedText);
   nextBtn.style.display="inline-block";
 }).catch(console.error);
}

function startScanner(){
 scanner=new Html5QrcodeScanner("reader",{fps:10,qrbox:250});
 scanner.render(onScanSuccess);
}

nextBtn.addEventListener("click",()=>{
 nextBtn.style.display="none";
 startScanner();
});

startScanner();