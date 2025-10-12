// Order JS - WhatsApp integration
const WHATSAPP_NUMBER = '919124445671'; // include country code, no plus
const productData = {
  "CLAY SOYA Candle":[{pieces:14,price:99},{pieces:50,price:330}],
  "TLIGHT GEL Candle":[{pieces:12,price:99}],
  "TLIGHT SOYA Candle":[{pieces:14,price:99},{pieces:50,price:330}],
  "LADDU Candle":[{pieces:6,price:99},{pieces:50,price:700}],
  "MODAK Candle":[{pieces:6,price:99},{pieces:50,price:700}],
  "SMALL DOLL Candle":[{pieces:6,price:50},{pieces:15,price:100}],
  "DAISY FLOWER Candle":[{pieces:8,price:100}],
  "BUBBLE Candle":[{pieces:5,price:100},{pieces:20,price:350}],
  "3D FLOWER BALL Candle":[{pieces:2,price:120},{pieces:5,price:250}],
  "PEONY FLOWER Candle":[{pieces:2,price:120},{pieces:5,price:250}],
  "BOUQUET Candle":[{pieces:1,price:149}],
  "SMALL GLASS Candle":[{pieces:1,price:80},{pieces:2,price:150}]
};

// coupons
const coupons = { "CADAROMA10":10, "CADAROMA20":20 };

let orderList = [];

const productSelect = document.getElementById('product');
const piecesSelect = document.getElementById('pieces');
const priceSelect = document.getElementById('price');
const totalAmountSpan = document.getElementById('totalAmount');
const couponInput = document.getElementById('coupon');

// populate product dropdown
function populateProducts(){
  for(const key of Object.keys(productData)){
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = key;
    productSelect.appendChild(opt);
  }
}
populateProducts();

// when product changes, populate pieces options
productSelect.addEventListener('change', ()=>{
  const key = productSelect.value;
  piecesSelect.innerHTML = '<option value="">-- Select Pieces --</option>';
  priceSelect.innerHTML = '<option value="">-- Price --</option>';
  priceSelect.disabled = true;
  if(!key) return;
  productData[key].forEach(item=>{
    const o = document.createElement('option');
    o.value = `${item.price}`; // store price as value
    o.textContent = `${item.pieces} pcs — ₹${item.price}`;
    piecesSelect.appendChild(o);
  });
});

// pieces -> set price
piecesSelect.addEventListener('change', ()=>{
  const v = piecesSelect.value;
  if(!v){ priceSelect.innerHTML = '<option value="">-- Price --</option>'; priceSelect.disabled = true; return; }
  priceSelect.innerHTML = `<option value="${v}">₹${v}</option>`;
  priceSelect.disabled = true;
});

// calculate totals
function calculateTotal(){
  const total = orderList.reduce((s,i)=> s + Number(i.price), 0);
  const code = couponInput.value.trim().toUpperCase();
  const pct = coupons[code] || 0;
  const discount = Math.round(total * pct / 100);
  const after = total - discount;
  totalAmountSpan.textContent = after;
  return {total, pct, discount, after};
}

// add product to order
function addProductToOrder(){
  const customer = document.getElementById('customer').value.trim();
  const product = productSelect.value;
  const piecesText = piecesSelect.selectedOptions[0]?.textContent || '';
  const price = priceSelect.value;
  if(!customer || !product || !piecesText || !price){ alert('Please fill customer, product and pieces'); return; }
  orderList.push({ customer, product, pieces: piecesText, price: Number(price) });
  renderTable();
  calculateTotal();
  // keep form fields for adding multiple items
}

// render table
function renderTable(){
  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = '';
  orderList.forEach((row, idx)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${row.customer}</td>
                    <td>${row.product}</td>
                    <td>${row.pieces}</td>
                    <td>₹ ${row.price}</td>
                    <td><button class="remove-btn" data-idx="${idx}">Remove</button></td>`;
    tbody.appendChild(tr);
  });
  // attach remove handlers
  document.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', ()=> {
      const i = Number(btn.getAttribute('data-idx'));
      orderList.splice(i,1);
      renderTable();
      calculateTotal();
    });
  });
}

// send via WhatsApp
function sendWhatsApp(){
  if(orderList.length === 0){ alert('No items in order'); return; }
  const customer = orderList[0].customer || 'Customer';
  const { total, pct, discount, after } = calculateTotal();
  let msg = `New order for ${customer}:`;
  orderList.forEach(o => {
    msg += `%0A${o.product} - ${o.pieces} - ₹ ${o.price}`;
  });
  if(pct > 0){
    msg += `%0A%0ACoupon: ${couponInput.value.trim().toUpperCase()} (${pct}% = ₹${discount})`;
  }
  msg += `%0A%0ATotal before: ₹${total}`;
  msg += `%0ATotal after discount: ₹${after}`;
  // open whatsapp
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(url, '_blank');
  // reset
  orderList = [];
  renderTable();
  calculateTotal();
  document.getElementById('orderForm').reset();
}

// attach buttons
document.getElementById('addProduct').addEventListener('click', addProductToOrder);
document.getElementById('sendWhatsApp').addEventListener('click', sendWhatsApp);
