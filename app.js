/* EL PRINCE — app logic (vanilla, no build step) */
'use strict';

/* ============ central config ============ */
const WHATSAPP_PHONE = '201131071414'; // 01131071414 — configurable, single source
const PHONE_DISPLAY = '01131071414 - 01131071166';
const ADDRESS = 'شبين الكوم شارع المصنع داخل كافي شوب بوخارست';
const STORAGE_KEY = 'elprince_cart_v1';

/* ============ menu data — source: printed menu (see spec §34) ============ */
const CATEGORIES = [
  {
    id: 'sandwich', name: 'السندوتشات',
    image: 'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم السندوتشات — سندوتشات مشوية',
    items: [
      { id: 's1', name: 'كبدة إسكندراني', variants: [{ name: 'وسط', price: 15 }, { name: 'كبير', price: 25 }], available: true },
      { id: 's2', name: 'كبدة بانيه', variants: [{ name: 'وسط', price: 15 }, { name: 'كبير', price: 25 }], available: true },
      { id: 's3', name: 'سجق مدخن', variants: [{ name: 'وسط', price: 15 }, { name: 'كبير', price: 25 }], available: true },
      { id: 's4', name: 'سجق صوابع', variants: [{ name: 'وسط', price: 15 }, { name: 'كبير', price: 25 }], available: true },
      { id: 's5', name: 'كبدة فرنساوي جريل', price: 35, available: true },
      { id: 's6', name: 'سجق صوابع فرنساوي جريل', price: 35, available: true },
      { id: 's7', name: 'سجق مدخن جريل', price: 35, available: true },
    ],
  },
  {
    id: 'potato', name: 'البطاطس',
    image: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم البطاطس — بطاطس مقرمشة',
    items: [
      { id: 'p1', name: 'باكيت بطاطس كبير', price: 35, available: true },
      { id: 'p2', name: 'باكيت بطاطس صغير', price: 25, available: true },
      { id: 'p3', name: 'ساندوتش بطاطس', price: 25, available: true },
      { id: 'p4', name: 'ساندوتش بطاطس بيض', price: 35, available: true },
      { id: 'p5', name: 'ساندوتش بطاطس مكس', price: 40, available: true },
    ],
  },
  {
    id: 'hawawshi', name: 'الحواوشي',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم الحواوشي — لحمة من الفرن',
    items: [
      { id: 'h1', name: 'حواوشي بلدي كبير', price: 50, available: true },
      { id: 'h2', name: 'حواوشي بلدي صغير', price: 25, available: true },
      { id: 'h3', name: 'حواوشي كبير جبنة', price: 60, available: true },
      { id: 'h4', name: 'حواوشي صغير جبنة', price: 30, available: true },
    ],
  },
  {
    id: 'burger', name: 'البرجر',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم البرجر — برجر جامبو',
    items: [
      { id: 'b1', name: 'برجر جامبو سادة', price: 50, available: true },
      { id: 'b2', name: 'برجر جامبو بيض', price: 60, available: true },
      { id: 'b3', name: 'برجر جامبو جبنة', price: 60, available: true },
      { id: 'b4', name: 'برجر جامبو مكس', price: 70, available: true },
    ],
  },
  {
    id: 'meat', name: 'اللحوم',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم اللحوم — مشويات على الفحم',
    items: [
      { id: 'm1', name: 'كفتة جريل سادة', price: 45, available: true },
      { id: 'm2', name: 'كفتة جريل جبنة / بيض', price: 55, available: true },
      { id: 'm3', name: 'كفتة البرنس', price: 60, available: true },
      { id: 'm4', name: 'سوسيس سادة', price: 35, available: true },
      { id: 'm5', name: 'سوسيس بيض / جبنة', price: 45, available: true },
      { id: 'm6', name: 'سوسيس مكس', price: 50, available: true },
      { id: 'm7', name: 'باذنجان كوكسي', price: 35, available: true },
      { id: 'm8', name: 'شاورما فراخ', price: 55, available: true },
      { id: 'm9', name: 'فاهيتا حار', price: 55, available: true },
    ],
  },
  {
    id: 'crepe', name: 'الكريبات',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم الكريبات — كريب محشي ملفوف',
    items: [
      { id: 'c1', name: 'كريب بطاطس', price: 50, available: true },
      { id: 'c2', name: 'كريب بانيه', price: 50, available: true },
      { id: 'c3', name: 'كريب بانيه / بطاطس', price: 60, available: true },
      { id: 'c4', name: 'كريب كبدة', price: 55, available: true },
      { id: 'c5', name: 'كريب سجق صوابع', price: 55, available: true },
      { id: 'c6', name: 'كريب سجق مدخن', price: 55, available: true },
      { id: 'c7', name: 'كريب سوسيس', price: 55, available: true },
      { id: 'c8', name: 'كريب برجر', price: 55, available: true },
      { id: 'c9', name: 'كريب شاورما استربس', price: 90, available: true },
      { id: 'c10', name: 'كريب استربس كنتاكي', price: 85, available: true },
      { id: 'c11', name: 'كريب كفتة جريل', price: 80, available: true },
      { id: 'c12', name: 'كريب ميكس فراخ', price: 70, available: true },
      { id: 'c13', name: 'كريب كرسبي', price: 125, available: true },
      { id: 'c14', name: 'كريب ميكانو البرنس', price: 150, available: true },
    ],
  },
  {
    id: 'extras', name: 'الإضافات',
    image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=400&q=80',
    alt: 'قسم الإضافات — مخلل وطحينة',
    items: [
      { id: 'e1', name: 'علبة مخلل', price: 10, available: true },
      { id: 'e2', name: 'علبة طحينة', price: 10, available: true },
      { id: 'e3', name: 'ماية سلطة حارة', price: 0, available: true },
    ],
  },
];

/* ============ helpers ============ */
const $ = (s) => document.querySelector(s);
const fmt = (n) => (n === 0 ? 'مجاناً' : `${n} ج.م`);
const catById = (id) => CATEGORIES.find((c) => c.id === id);
const findItem = (itemId) => {
  for (const c of CATEGORIES) {
    const it = c.items.find((i) => i.id === itemId);
    if (it) return { cat: c, item: it };
  }
  return null;
};
const plural = (n) => (n === 1 ? 'صنف واحد' : n === 2 ? 'صنفان' : `${n} أصناف`);
const countLabel = (n) => (n === 1 ? 'عنصر واحد' : n === 2 ? 'عنصران' : `${n} عناصر`);

function toast(msg) {
  const wrap = $('#toastWrap');
  const el = document.createElement('div');
  el.className = 'toast';
  el.textContent = msg;
  wrap.appendChild(el);
  setTimeout(() => { el.style.opacity = '0'; setTimeout(() => el.remove(), 250); }, 1800);
}

/* ============ state ============ */
const CAT_KEY = 'elprince_cat_v1';
const REDUCED = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let orbitEntered = false; // radial entrance animation plays once
let prevTotal = 0;
const storedCat = (() => { try { return localStorage.getItem(CAT_KEY); } catch { return null; } })();
let activeCat = catById(storedCat) ? storedCat : CATEGORIES[0].id;
let cart = {}; // key -> {key,itemId,itemName,catName,variant,unitPrice,qty}
let cardVariantSel = {}; // itemId -> variant index (default 0)
let sheetState = { itemId: null, variantIdx: 0, qty: 1 };

try {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (raw) cart = JSON.parse(raw) || {};
} catch { /* ignore */ }
const saveCart = () => { try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cart)); } catch {} };
const cartEntries = () => Object.values(cart);
const cartCount = () => cartEntries().reduce((s, e) => s + e.qty, 0);
const cartTotal = () => cartEntries().reduce((s, e) => s + e.qty * e.unitPrice, 0);

/* ============ radial layout ============ */
/* Full elliptical orbit: 7 nodes evenly spaced (360/7) so nothing overlaps.
   Start angle 38.5° + full-bleed stage tuned numerically: worst pair = 112.8px
   on 360px vs ~96px worst label run (plain-text chips, no bg) => clear. */
const ORBIT_RHO = 38.5;
function positionRadial() {
  const stage = $('#radialStage');
  const nodes = [...document.querySelectorAll('.radial-node')];
  if (!stage || !nodes.length) return;
  const W = stage.clientWidth, H = stage.clientHeight;
  const cx = W / 2, cy = H * 0.5;
  const rx = Math.min(W / 2 - 56, 230);
  const ry = Math.min(H * 0.36, 215);
  nodes.forEach((n, i) => {
    const phi = ((ORBIT_RHO - 90 + (i * 360) / nodes.length) * Math.PI) / 180;
    n.style.left = `${cx + rx * Math.cos(phi)}px`;
    n.style.top = `${cy + ry * Math.sin(phi)}px`;
  });
}

function renderRadial() {
  const holder = $('#radialNodes');
  holder.innerHTML = '';
  CATEGORIES.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'radial-node' + (c.id === activeCat ? ' active' : '');
    b.dataset.cat = c.id;
    b.setAttribute('aria-label', `عرض ${c.name}`);
    b.setAttribute('aria-pressed', c.id === activeCat ? 'true' : 'false');
    if (!orbitEntered) b.style.setProperty('--d', `${i * 65}ms`); // staggered entrance, first paint only
    b.style.setProperty('--fd', `${-(i * 0.65).toFixed(2)}s`); // desync idle float
    b.innerHTML = `
      <span class="node-img"><img src="${c.image}" alt="${c.alt}" loading="lazy" decoding="async" /></span>
      <span class="node-name">${c.name}</span>`;
    b.addEventListener('click', () => selectCategory(c.id, true));
    holder.appendChild(b);
  });
  // entrance replays only until the site is revealed; afterwards nodes stay put
  if (document.body.classList.contains('ready')) {
    holder.classList.add('entered');
    orbitEntered = true;
  }
  positionRadial();
}

function renderPills() {
  const nav = $('#pillNav');
  nav.innerHTML = '';
  CATEGORIES.forEach((c) => {
    const b = document.createElement('button');
    b.className = 'pill' + (c.id === activeCat ? ' active' : '');
    b.textContent = c.name;
    b.setAttribute('aria-pressed', c.id === activeCat ? 'true' : 'false');
    b.addEventListener('click', () => selectCategory(c.id, true));
    nav.appendChild(b);
  });
}

function selectCategory(id, scroll) {
  if (!catById(id)) return;
  activeCat = id;
  try { localStorage.setItem(CAT_KEY, id); } catch {}
  const sec = $('#itemsSection');
  sec.classList.add('switching');
  setTimeout(() => {
    renderRadial();
    renderPills();
    renderItems();
    $('#radialHintName').textContent = catById(id).name;
    sec.classList.remove('switching');
  }, 140);
  if (scroll) {
    setTimeout(() => {
      $('#itemsSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 160);
  }
}

/* ============ items (TEXT-ONLY — never images) ============ */
function itemCardEl(cat, item, idx = 0, animate = true) {
  const card = document.createElement('article');
  card.className = 'item-card' + (item.available ? '' : ' unavailable') + (animate ? ' enter' : '');
  if (animate) card.style.setProperty('--cd', `${Math.min(idx * 55, 600)}ms`);
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 1;
  const selIdx = cardVariantSel[item.id] ?? 0;
  const unitPrice = hasVariants ? item.variants[selIdx].price : item.price;

  let variantsHtml = '';
  if (hasVariants) {
    variantsHtml = `<div class="variant-row" role="group" aria-label="اختار الحجم">` + item.variants.map((v, i) => `
      <button class="variant-chip ${i === selIdx ? 'selected' : ''}" data-v="${i}" ${item.available ? '' : 'disabled'}
        aria-pressed="${i === selIdx}">${v.name} · <b>${fmt(v.price)}</b></button>`).join('') + `</div>`;
  }

  card.innerHTML = `
    <div class="item-top">
      <h3 class="item-name" tabindex="0" role="button" aria-label="تخصيص ${item.name}">${item.name}</h3>
      ${item.available ? '' : '<span class="stock-tag">غير متوفر</span>'}
    </div>
    ${variantsHtml}
    <div class="item-foot">
      <span class="item-price">${fmt(unitPrice)}${hasVariants ? ' <small>· ' + item.variants[selIdx].name + '</small>' : ''}</span>
      <button class="add-btn" ${item.available ? '' : 'disabled'} aria-label="أضف ${item.name} إلى السلة">أضف +</button>
    </div>`;

  if (hasVariants && item.available) {
    card.querySelectorAll('.variant-chip').forEach((chip) => {
      chip.addEventListener('click', () => {
        cardVariantSel[item.id] = Number(chip.dataset.v);
        renderItems({ animate: false }); // variant pick only, no list replay
      });
    });
  }

  const openSheet = () => { if (item.available) openSheetFor(item.id); };
  card.querySelector('.item-name').addEventListener('click', openSheet);
  card.querySelector('.item-name').addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openSheet(); }
  });

  const addBtn = card.querySelector('.add-btn');
  addBtn.addEventListener('click', () => {
    if (!item.available) return;
    addBtn.classList.add('loading');
    setTimeout(() => {
      const idx = cardVariantSel[item.id] ?? 0;
      const v = hasVariants ? item.variants[idx] : null;
      addToCart(item.id, v ? v.name : null, v ? v.price : item.price, 1, addBtn);
      addBtn.classList.remove('loading');
      addBtn.classList.add('added');
      addBtn.textContent = '✓ اتضاف';
      setTimeout(() => { addBtn.classList.remove('added'); addBtn.textContent = 'أضف +'; }, 1100);
    }, 280);
  });

  return card;
}

function renderItems(opts = {}) {
  const { skeleton = false, animate = true } = opts;
  const cat = catById(activeCat);
  const grid = $('#itemsGrid');
  const render = () => {
    $('#skeletonList').style.display = 'none';
    grid.innerHTML = '';
    $('#activeCatName').textContent = cat.name;
    $('#activeCatCount').textContent = `${plural(cat.items.length)}`;
    $('#activeCatBadge').textContent = `${plural(cat.items.length)}`;
    cat.items.forEach((it, i) => grid.appendChild(itemCardEl(cat, it, i, animate)));
  };
  if (skeleton) {
    $('#skeletonList').style.display = '';
    grid.innerHTML = '';
    setTimeout(render, 650);
  } else {
    render();
  }
}

/* ============ search (text-only results) ============ */
function runSearch(q) {
  const query = q.trim();
  const sec = $('#searchSection'), itemsSec = $('#itemsSection');
  $('#searchClear').hidden = !query;
  if (!query) {
    sec.hidden = true;
    itemsSec.style.display = '';
    return;
  }
  itemsSec.style.display = 'none';
  sec.hidden = false;
  const box = $('#searchResults');
  box.innerHTML = '';
  const hits = [];
  CATEGORIES.forEach((c) => {
    c.items.forEach((it) => {
      if (it.name.includes(query) || c.name.includes(query)) hits.push({ cat: c, item: it });
    });
  });
  $('#searchTitle').textContent = `نتائج «${query}»`;
  $('#searchCount').textContent = hits.length ? `${plural(hits.length)}` : '';
  $('#searchEmpty').hidden = hits.length > 0;
  hits.forEach(({ cat, item }, i) => {
    const el = itemCardEl(cat, item, i, true);
    const tag = document.createElement('p');
    tag.className = 'cat-count';
    tag.textContent = cat.name;
    el.prepend(tag);
    box.appendChild(el);
  });
}

/* ============ cart ============ */
function addToCart(itemId, variantName, unitPrice, qty, fromEl) {
  const found = findItem(itemId);
  if (!found) return;
  const key = `${itemId}|${variantName || '-'}`;
  if (cart[key]) cart[key].qty += qty;
  else cart[key] = { key, itemId, itemName: found.item.name, catName: found.cat.name, variant: variantName, unitPrice, qty };
  saveCart();
  updateCartUI();
  flyDot(fromEl);
  toast(`اتضافت للسلة: ${found.item.name}${variantName ? ' (' + variantName + ')' : ''}`);
}

/* Small dot flies from the Add button into the cart — pure delight, skipped on reduced motion */
function flyDot(fromEl) {
  if (REDUCED || !fromEl || !fromEl.getBoundingClientRect) return;
  const target = (!$('#floatingCart').hidden ? $('#floatingCart') : $('#headerCartBtn'));
  const a = fromEl.getBoundingClientRect(), b = target.getBoundingClientRect();
  if (!a.width || !b.width) return;
  const dot = document.createElement('span');
  dot.className = 'fly-dot';
  dot.style.left = `${a.left + a.width / 2}px`;
  dot.style.top = `${a.top + a.height / 2}px`;
  document.body.appendChild(dot);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  try {
    const anim = dot.animate(
      [{ transform: 'translate(-50%,-50%) scale(1)', opacity: 1 },
       { transform: `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(.3)`, opacity: 0.85 }],
      { duration: 620, easing: 'cubic-bezier(.22,.8,.3,1)' }
    );
    anim.onfinish = () => dot.remove();
  } catch { dot.remove(); }
}

function setQty(key, qty) {
  if (qty <= 0) delete cart[key];
  else if (cart[key]) cart[key].qty = qty;
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  const n = cartCount(), total = cartTotal();
  // header badge + pop
  const hb = $('#headerCartCount');
  hb.hidden = n === 0;
  hb.textContent = n;
  hb.classList.remove('pop'); void hb.offsetWidth; hb.classList.add('pop');
  // floating bar + total pop on change
  const fc = $('#floatingCart');
  fc.hidden = n === 0;
  $('#fcCount').textContent = n;
  $('#fcLabel').textContent = `السلة • ${countLabel(n)}`;
  $('#fcTotal').textContent = fmt(total);
  if (total !== prevTotal) {
    prevTotal = total;
    const ft = $('#fcTotal');
    ft.classList.remove('pop'); void ft.offsetWidth; ft.classList.add('pop');
  }
  // panel
  $('#cartSub').textContent = n ? `${countLabel(n)}` : 'فارغة';
  $('#cartCountLine').textContent = `عدد العناصر: ${n}`;
  $('#cartTotal').textContent = fmt(total);
  const box = $('#cartItems');
  box.innerHTML = '';
  cartEntries().forEach((e) => {
    const row = document.createElement('div');
    row.className = 'cart-item';
    row.innerHTML = `
      <div class="cart-item-info">
        <strong>${e.itemName}</strong>
        <small>${e.variant ? e.variant + ' • ' : ''}${fmt(e.unitPrice)} للواحد</small>
      </div>
      <div class="mini-qty" role="group" aria-label="كمية ${e.itemName}">
        <button data-a="dec" aria-label="إنقاص">−</button>
        <span>× ${e.qty}</span>
        <button data-a="inc" aria-label="زيادة">+</button>
      </div>
      <span class="cart-item-price">${fmt(e.unitPrice * e.qty)}</span>`;
    row.querySelector('[data-a="dec"]').addEventListener('click', () => setQty(e.key, e.qty - 1));
    row.querySelector('[data-a="inc"]').addEventListener('click', () => setQty(e.key, e.qty + 1));
    box.appendChild(row);
  });
  const empty = n === 0;
  $('#cartEmpty').style.display = empty ? '' : 'none';
  $('#cartFoot').hidden = empty;
  box.style.display = empty ? 'none' : '';
}

function buildWhatsMessage() {
  const lines = ['السلام عليكم،', 'أرغب في طلب:', ''];
  cartEntries().forEach((e, i) => {
    const pricePart = e.unitPrice === 0 ? 'مجاناً' : `${e.unitPrice * e.qty} ج.م`;
    const variantPart = e.variant ? ` - ${e.variant}` : '';
    lines.push(`${i + 1} × ${e.itemName}${variantPart} - ${pricePart}`);
  });
  lines.push('', `عدد العناصر: ${cartCount()}`, '', `الإجمالي: ${fmt(cartTotal())}`, '');
  const name = $('#custName').value.trim();
  const addr = $('#custAddr').value.trim();
  lines.push(`الاسم: ${name || ''}`, '', `العنوان: ${addr || ''}`, '', 'شكراً.');
  return lines.join('\n');
}

function openCart() {
  $('#cartOverlay').hidden = false;
  const p = $('#cartPanel');
  p.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
  $('#cartClose').focus();
}
function closeCart() {
  $('#cartOverlay').hidden = true;
  $('#cartPanel').setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

/* ============ item bottom sheet ============ */
function openSheetFor(itemId) {
  const found = findItem(itemId);
  if (!found) return;
  sheetState = { itemId, variantIdx: cardVariantSel[itemId] ?? 0, qty: 1 };
  paintSheet();
  $('#sheetOverlay').hidden = false;
  $('#itemSheet').setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeSheet() {
  $('#sheetOverlay').hidden = true;
  $('#itemSheet').setAttribute('aria-hidden', 'true');
  if ($('#cartPanel').getAttribute('aria-hidden') === 'true') document.body.style.overflow = '';
}
function paintSheet() {
  const found = findItem(sheetState.itemId);
  if (!found) return;
  const { cat, item } = found;
  const hasVariants = Array.isArray(item.variants) && item.variants.length > 1;
  $('#sheetName').textContent = item.name;
  $('#sheetCat').textContent = cat.name;
  const box = $('#sheetVariants');
  box.innerHTML = '';
  document.querySelector('.sheet-label').style.display = hasVariants ? '' : 'none';
  if (hasVariants) {
    item.variants.forEach((v, i) => {
      const b = document.createElement('button');
      b.className = 'variant-opt' + (i === sheetState.variantIdx ? ' selected' : '');
      b.setAttribute('role', 'radio');
      b.setAttribute('aria-checked', i === sheetState.variantIdx ? 'true' : 'false');
      b.innerHTML = `<span style="display:flex;align-items:center;gap:10px"><span class="radio"></span>${v.name}</span><span class="vprice">${fmt(v.price)}</span>`;
      b.addEventListener('click', () => { sheetState.variantIdx = i; paintSheet(); });
      box.appendChild(b);
    });
  } else {
    const b = document.createElement('button');
    b.className = 'variant-opt selected';
    b.innerHTML = `<span style="display:flex;align-items:center;gap:10px"><span class="radio"></span>سعر واحد</span><span class="vprice">${fmt(item.price)}</span>`;
    b.addEventListener('click', () => {});
    box.appendChild(b);
  }
  const unit = hasVariants ? item.variants[sheetState.variantIdx].price : item.price;
  $('#qtyVal').textContent = sheetState.qty;
  $('#sheetTotal').textContent = fmt(unit * sheetState.qty);
  $('#sheetAdd').textContent = `أضف إلى السلة • ${fmt(unit * sheetState.qty)}`;
}

/* ============ boot ============ */
document.addEventListener('DOMContentLoaded', () => {
  // splash: brand intro ~2s, then reveal (hard fallback so it never sticks)
  const t0 = performance.now ? performance.now() : Date.now();
  let splashGone = false;
  const liftSplash = () => {
    if (splashGone) return;
    splashGone = true;
    const wait = Math.max(0, 2000 - ((performance.now ? performance.now() : Date.now()) - t0));
    setTimeout(() => {
      document.body.classList.remove('locked');
      document.body.classList.add('ready'); // starts hero/orbit/cards entrance
      const sp = $('#splash');
      if (sp) { sp.classList.add('hide'); setTimeout(() => sp.remove(), 600); }
    }, wait);
  };
  document.body.classList.add('locked');
  if (document.readyState === 'complete') liftSplash();
  else window.addEventListener('load', liftSplash);
  setTimeout(liftSplash, 3500); // safety net

  // contact whatsapp uses central number
  $('#contactWhats').href = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent('السلام عليكم، عايز أستفسر عن المنيو')}`;

  renderRadial();
  renderPills();
  renderItems({ skeleton: true });
  updateCartUI();
  $('#radialHintName').textContent = catById(activeCat).name;

  // header elevates on scroll
  const header = $('#siteHeader');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // scroll reveals (JS-gated: without JS content stays visible)
  if ('IntersectionObserver' in window && !REDUCED) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('[data-reveal]').forEach((el) => { el.classList.add('reveal'); io.observe(el); });
  }
  window.addEventListener('resize', positionRadial);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(positionRadial);
  setTimeout(positionRadial, 400);

  // header
  $('#menuBtn').addEventListener('click', () => {
    $('#radialStage').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  const drawer = $('#searchDrawer'), input = $('#searchInput'), toggle = $('#searchToggle');
  toggle.addEventListener('click', () => {
    const open = drawer.hidden;
    drawer.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (open) input.focus();
    else { input.value = ''; runSearch(''); }
  });
  input.addEventListener('input', () => runSearch(input.value));
  $('#searchClear').addEventListener('click', () => { input.value = ''; runSearch(''); input.focus(); });

  // cart open/close
  $('#headerCartBtn').addEventListener('click', openCart);
  $('#floatingCart').addEventListener('click', openCart);
  $('#cartClose').addEventListener('click', closeCart);
  $('#cartOverlay').addEventListener('click', closeCart);
  $('#browseMenuBtn').addEventListener('click', () => {
    closeCart();
    $('#radialStage').scrollIntoView({ behavior: 'smooth', block: 'center' });
  });
  $('#clearCartBtn').addEventListener('click', () => {
    cart = {}; saveCart(); updateCartUI(); toast('اتمسحت السلة');
  });

  // whatsapp checkout
  $('#whatsBtn').addEventListener('click', () => {
    if (!cartCount()) { toast('السلة فارغة'); return; }
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(buildWhatsMessage())}`;
    window.open(url, '_blank', 'noopener');
  });

  // sheet
  $('#qtyMinus').addEventListener('click', () => {
    if (sheetState.qty > 1) { sheetState.qty -= 1; paintSheet(); }
  });
  $('#qtyPlus').addEventListener('click', () => {
    if (sheetState.qty < 20) { sheetState.qty += 1; paintSheet(); }
  });
  $('#sheetOverlay').addEventListener('click', closeSheet);
  $('#sheetAdd').addEventListener('click', () => {
    const found = findItem(sheetState.itemId);
    if (!found) return;
    const hasV = Array.isArray(found.item.variants) && found.item.variants.length > 1;
    const v = hasV ? found.item.variants[sheetState.variantIdx] : null;
    cardVariantSel[sheetState.itemId] = sheetState.variantIdx;
    addToCart(sheetState.itemId, v ? v.name : null, v ? v.price : found.item.price, sheetState.qty, $('#sheetAdd'));
    closeSheet();
    renderItems({ animate: false });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeSheet(); closeCart(); }
  });
});
