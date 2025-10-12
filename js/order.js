// WhatsApp number with country code
const WHATSAPP_NUMBER = '919124445671'; // +91 9124445671

// product catalog
const productData = {
  "CLAY SOYA Candle":[{pieces:14,price:99},{pieces:50,price:330}],
  "TLIGHT GEL Candle":[{pieces:12,price:99}],
  "TLIGHT SOYA Candle":[{pieces:14,price:99},{pieces:50,price:330}],
  "LADDU Candle":[{pieces:6,price:99},{pieces:50,price:700}],
  "MODAK Candle":[{pieces:6,price:99},{pieces:50,price:700}],
  "SMALL DOLL Candle":[{pieces:6,price:50},{pieces:15,price:100}],
  "DAISY FLOWER Candle":[{pieces:8,price:100}],
  "BUBBLE Candle":[{pieces:5,price:100},{pieces:20,price:350}],
  "3D FLOWER BALL Ball Candle":[{pieces:2,price:120},{pieces:5,price:250}],
  "PEONY FLOWER Candle":[{pieces:2,price:120},{pieces:5,price:250}],
  "BOUQUET Candle":[{pieces:1,price:149}],
  "SMALL GLASS Candle":[{pieces:1,price:80},{pieces:2,price:150}]
};

const coupons = { 'CADAROMA10':10, 'CADAROMA20':20 };

let orderList = [];

// DOM
const productSelect = document.getElementById('product');
const piecesSelect = document.getElementById('pieces');
const priceSelect = document.getElementById('price');
const totalAmountSpan = document.getElementById('totalAmount');
const discountPercentSpan = document.getElementById('discountPercent');
const discountAmountSpan = document.getElementById('discountAmount');
const totalAfterDiscountSpan = document.getElementById('totalAfterDiscount');
const couponInput = document.getElementById('coupon');
const customerInput = document.getElementById('customer');
const mobileInput = document.getElementById('mobile');
const ordersTbody = document.querySelector('#ordersTable tbody');

// populate product dropdown
(function populate(){
  Object.keys(productData).forEach(name=>{
    const o=document.createElement('option'); o.value=name; o.textContent=name; productSelect.appendChild(o);
  });
})();

// when product changes populate pieces
productSelect.addEventListener('change', ()=>{
  piecesSelect.innerHTML = '<option value="">-- Select Pieces --</option>';
  priceSelect.innerHTML = '<option value="">-- Price --</option>';
  priceSelect.disabled = true;
  const key = productSelect.value;
  if(!key) return;
  productData[key].forEach(item=>{
    const o = document.createElement('option');
    o.value = item.price;
    o.textContent = item.pieces + ' pcs — ₹' + item.price;
    piecesSelect.appendChild(o);
  });
});

// pieces -> set price
piecesSelect.addEventListener('change', ()=>{
  if(!piecesSelect.value){ priceSelect.innerHTML = '<option value="">-- Price --</option>'; priceSelect.disabled = true; return; }
  priceSelect.innerHTML = `<option value="${piecesSelect.value}">₹ ${piecesSelect.value}</option>`;
  priceSelect.disabled = true;
});

// calculate totals
function calculateTotal(){
  const total = orderList.reduce((s,i)=> s + Number(i.price), 0);
  const code = couponInput.value.trim().toUpperCase();
  const pct = coupons[code] || 0;
  const discount = Math.round(total * pct / 100);
  const after = total - discount;
  totalAmountSpan.textContent = total.toFixed(2);
  discountPercentSpan.textContent = pct;
  discountAmountSpan.textContent = discount.toFixed(2);
  totalAfterDiscountSpan.textContent = after.toFixed(2);
  return { total, pct, discount, after };
}

// add product
function addProductToOrder(){
  const customer = customerInput.value.trim();
  const mobile = mobileInput.value.trim();
  const product = productSelect.value;
  const piecesText = piecesSelect.selectedOptions[0]?.textContent || '';
  const price = priceSelect.value;

  if(!customer || !mobile || !/^\d{10}$/.test(mobile)){
    alert('Please enter valid customer name and 10-digit mobile number.');
    return;
  }
  if(!product || !piecesText || !price){
    alert('Please select product, pieces and price.');
    return;
  }

  orderList.push({ customer, mobile, product, pieces: piecesText, price: Number(price) });
  renderTable();
  calculateTotal();

  // reset selects for next item
  productSelect.value = '';
  piecesSelect.innerHTML = '<option value="">-- Select Pieces --</option>';
  priceSelect.innerHTML = '<option value="">-- Price --</option>';
  priceSelect.disabled = true;
  couponInput.value = couponInput.value.toUpperCase();
}

// render table
function renderTable(){
  ordersTbody.innerHTML = '';
  orderList.forEach((o,i)=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${o.customer}</td><td>${o.mobile}</td><td>${o.product}</td><td>${o.pieces}</td><td>₹ ${o.price.toFixed(2)}</td>
      <td><button class="remove-btn" data-i="${i}">Remove</button></td>`;
    ordersTbody.appendChild(tr);
  });
  // attach remove listeners
  document.querySelectorAll('.remove-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      const idx = Number(btn.getAttribute('data-i'));
      orderList.splice(idx,1);
      renderTable();
      calculateTotal();
    });
  });
}

// send via WhatsApp
function sendWhatsApp(){
  if(orderList.length === 0){
    alert('Add at least one product to send order.');
    return;
  }
  const mobile = mobileInput.value.trim();
  if(!/^\d{10}$/.test(mobile)){ alert('Enter a valid 10-digit mobile number.'); return; }

  const custName = customerInput.value.trim() || 'Customer';
  const { total, pct, discount, after } = calculateTotal();

  let msg = `New order for ${custName} (Mobile: ${mobile}):`;
  orderList.forEach(o=>{
    msg += `%0A${o.product} - ${o.pieces} - ₹${o.price}`;
  });

  if(pct > 0){
    msg += `%0A%0ACoupon: ${couponInput.value.trim().toUpperCase()} (${pct}% = ₹${discount})`;
  }
  msg += `%0A%0ATotal: ₹${total.toFixed(2)}`;
  msg += `%0ADiscount: ₹${discount.toFixed(2)}`;
  msg += `%0ATotal After Discount: ₹${after.toFixed(2)}`;

  const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`;
  window.open(waUrl, '_blank');

  // clear after send
  orderList = [];
  renderTable();
  calculateTotal();
  document.getElementById('orderForm').reset();
}

document.getElementById('addProduct').addEventListener('click', addProductToOrder);
document.getElementById('sendWhatsApp').addEventListener('click', sendWhatsApp);
couponInput.addEventListener('input', calculateTotal);
