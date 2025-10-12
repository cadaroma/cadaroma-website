const WHATSAPP_NUMBER='919124445671';
const productData={'CLAY SOYA Candle':[14,50],'TLIGHT GEL Candle':[12],'TLIGHT SOYA Candle':[14,50]};
let orderList=[];
const productSelect=document.getElementById('product');
const piecesSelect=document.getElementById('pieces');
const priceSelect=document.getElementById('price');
const totalAmountSpan=document.getElementById('totalAmount');

productSelect.addEventListener('change',()=>{
  piecesSelect.innerHTML='<option value="">-- Select Pieces --</option>';
  priceSelect.innerHTML='<option value="">-- Price --</option>';
  priceSelect.disabled=true;
  if(productData[productSelect.value]){
    productData[productSelect.value].forEach(n=>{
      const opt=document.createElement('option'); opt.value=n; opt.textContent=n+' pcs'; piecesSelect.appendChild(opt);
    });
  }
});

piecesSelect.addEventListener('change
