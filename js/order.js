const WHATSAPP_NUMBER = '919124445671';

// Product data with pieces & prices
const productData = {
  "CLAY SOYA Candle": [{pieces:14, price:99}, {pieces:50, price:330}],
  "TLIGHT GEL Candle": [{pieces:12, price:99}],
  "TLIGHT SOYA Candle": [{pieces:14, price:99}, {pieces:50, price:330}],
  "LADDU Candle": [{pieces:6, price:99}, {pieces:50, price:700}],
  "MODAK Candle": [{pieces:6, price:99}, {pieces:50, price:700}],
  "SMALL DOLL Candle": [{pieces:6, price:50}, {pieces:15, price:100}],
  "DAISY FLOWER Candle": [{pieces:8, price:100}],
  "BUBBLE Candle": [{pieces:5, price:100}, {pieces:20, price:350}],
  "3D FLOWER BALL Ball Candle": [{pieces:2, price:120}, {pieces:5, price:250}],
  "PEONY FLOWER Candle": [{pieces:2, price:120}, {pieces:5, price:250}],
  "BOUQUET Candle": [{pieces:1, price:149}],
  "SMALL GLASS Candle": [{pieces:1, price:80}, {pieces:2, price:150}],
  "TULIP Candle": [{pieces:1, price:50}]
};

// Coupon codes
const coupons = {
  'CADAROMA10': 10,
  'CADAROMA20': 20
};

// DOM elements
const productSelect = document.getElementById('product');
const piecesSelect = document.getElementById('pieces');
const priceSelect = document.getElementById('price');
const totalAmountSpan = document.getElementById('totalAmount');
const discountPercentSpan = document.getElementById('discountPercent');
const discountAmountSpan = document.getElementById('discountAmount');
const totalAfterDiscountSpan = document.getElementById('totalAfterDiscount');
const couponInput = document.getElementById('coupon');
const orderList = [];

// Populate product select
for(let p in productData){
  const opt = document.createElement('option');
  opt.value = p;
  opt.textContent = p;
  productSelect.appendChild(opt);
}

// On product change -> show pieces
productSelect.addEventListener('change', ()=>{
  piecesSelect.innerHTML = '<option value="">-- Select Pieces --</option>';
  priceSelect.innerHTML = '<option value="">-- Price --</option>';
  priceSelect.disabled = true;

  const selected = productSelect.value;
  if(selected && productData[selected]){
    productData[selected].forEach(item=>{
      const opt = document.createElement('option');
      opt.value = item.price;
      opt.textContent = item.pieces + ' pcs';
      piecesSelect.appendChild(opt);
    });
  }
});

// On pieces change -> show price
piecesSelect.addEventListener('change', ()=>{
  if(piecesSelect.value){
    priceSelect.innerHTML = `<option value="${piecesSelect.value}">Rs ${piecesSelect.value}</option>`;
    priceSelect.disabled = true;
  }
});

// Calculate totals
function calculateTotal(){
  let total = orderList.reduce((sum,o)=>sum+Number(o.price),0);
  const code = couponInput.value.trim();
  let discountPercent = coupons[code] || 0;
  let discountAmount = total * discountPercent/100;
  let totalAfterDiscount = total - discountAmount;

  totalAmountSpan.textContent = total;
  discountPercentSpan.textContent = discountPercent;
  discountAmountSpan.textContent = discountAmount;
  totalAfterDiscountSpan.textContent = totalAfterDiscount;
}

// Add product to order
function addProductToOrder(){
  const customer = document.getElementById('customer').value.trim();
  const product = productSelect.value;
  const pieces = piecesSelect.selectedOptions[0]?.textContent;
  const price = priceSelect.value;

  if(!customer || !product || !pieces || !price){
    alert('Please fill all required fields.');
    return;
  }

  orderList.push({customer, product, pieces, price});
  renderTable();
  calculateTotal();
  productSelect.value = '';
  piecesSelect.innerHTML = '<option value="">-- Select Pieces --</option>';
  priceSelect.innerHTML = '<option value="">-- Price --</option>';
}

// Render order table
function renderTable(){
  const tbody = document.querySelector('#ordersTable tbody');
  tbody.innerHTML = '';
  orderList.forEach((o,index)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${o.customer}</td><td>${o.product}</td><td>${o.pieces}</td><td>Rs ${o.price}</td>
                    <td><button class='remove-btn' onclick='removeProduct(${index})'>Remove</button></td>`;
    tbody.appendChild(tr);
  });
}

// Remove product
function removeProduct(i){
  orderList.splice(i,1);
  renderTable();
  calculateTotal();
}

// Send WhatsApp
function sendWhatsApp(){
  if(orderList.length===0){ alert('No products in order.'); return; }
  const customer = orderList[0].customer;
  let msg = `New order for ${customer}:`;
  orderList.forEach(o=>{
    msg += `%0A${o.product} - ${o.pieces} - Rs ${o.price}`;
  });
  const code = couponInput.value.trim();
  let discountPercent = coupons[code] || 0;
  let total = orderList.reduce((sum,o)=>sum+Number(o.price),0);
  let discountAmount = total*discountPercent/100;
  let totalAfterDiscount = total - discountAmount;
  if(discountPercent>0){
    msg += `%0ACoupon Code: ${code}`;
    msg += `%0ADiscount: ${discountPercent}% = Rs ${discountAmount}`;
  }
  msg += `%0ATotal Amount Before Discount: Rs ${total}`;
  msg += `%0ATotal Amount After Discount: Rs ${totalAfterDiscount}`;

  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, '_blank');
  orderList.length = 0;
  renderTable();
  calculateTotal();
  document.getElementById('orderForm').reset();
}

// Event listeners
document.getElementById('addProduct').addEventListener('click', addProductToOrder);
document.getElementById('sendWhatsApp').addEventListener('click', sendWhatsApp);
couponInput.addEventListener('input', calculateTotal);
