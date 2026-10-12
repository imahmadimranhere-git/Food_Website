/* =========================================================
   Food Website – interactivity (cart, search, forms, tracking)
   Layout & styling live in index.html + style.css.
   ========================================================= */
(function () {
  "use strict";

  /* ---------- Helpers ---------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const rs = n => "Rs " + n.toLocaleString("en-PK");
  const store = {
    get(k, d) { try { const v = localStorage.getItem("fw_" + k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem("fw_" + k, JSON.stringify(v)); } catch (e) {} }
  };
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const timeStr = t => new Date(t).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  const IMG = (id, w = 600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=70`;

  /* ---------- Menu data (real photos from Unsplash; emoji is the fallback) ---------- */
  const DISHES = [
    { id: 1, name: "Vegetable Samosa", cat: "Starters", price: 250, img: "1601050690597-df0568f70950", emoji: "🥟", veg: true, spicy: false, allergens: ["Gluten"], rating: 4.6, pop: 86, desc: "Two crispy pastries filled with spiced potato and peas, with tamarind chutney.", ing: ["Potato", "Peas", "Flour", "Cumin", "Tamarind chutney"] },
    { id: 2, name: "Chicken Pakora", cat: "Starters", price: 450, img: "1765360024331-25b63e85272e", emoji: "🍗", veg: false, spicy: true, allergens: ["Gluten"], rating: 4.4, pop: 80, desc: "Bite-size chicken fried in a spicy gram-flour batter, served with mint raita.", ing: ["Chicken", "Gram flour", "Chilli", "Mint raita"] },
    { id: 3, name: "Dahi Bhallay", cat: "Starters", price: 300, img: "1653850280260-aa3b9e00b230", emoji: "🥣", veg: true, spicy: false, allergens: ["Dairy"], rating: 4.3, pop: 62, desc: "Soft lentil dumplings in chilled yogurt with sweet and tangy chutneys.", ing: ["Lentils", "Yogurt", "Chickpeas", "Chaat masala"] },
    { id: 4, name: "Chicken Biryani", cat: "Mains", price: 650, img: "1589302168068-964664d93dc0", emoji: "🍛", veg: false, spicy: true, allergens: ["Dairy"], rating: 4.9, pop: 100, desc: "Fragrant basmati rice layered with tender chicken, saffron and fried onions.", ing: ["Basmati rice", "Chicken", "Yogurt", "Saffron", "Fried onion"] },
    { id: 5, name: "Chicken Karahi", cat: "Mains", price: 1400, img: "1603496987351-f84a3ba5ec85", emoji: "🍲", veg: false, spicy: true, allergens: ["Dairy"], rating: 4.8, pop: 94, desc: "Half karahi cooked in a wok with tomatoes, ginger and green chillies.", ing: ["Chicken", "Tomato", "Ginger", "Green chilli", "Butter"] },
    { id: 6, name: "Seekh Kabab", cat: "Mains", price: 900, img: "1599487488170-d11ec9c172f0", emoji: "🍢", veg: false, spicy: true, allergens: [], rating: 4.7, pop: 88, desc: "Four charcoal-grilled minced beef kababs with onion salad.", ing: ["Beef mince", "Onion", "Coriander", "Spices"] },
    { id: 7, name: "Daal Makhni", cat: "Mains", price: 550, img: "1736680056444-02b10f16a245", emoji: "🥘", veg: true, spicy: false, allergens: ["Dairy"], rating: 4.5, pop: 70, desc: "Black lentils slow-cooked overnight with butter and cream.", ing: ["Black lentils", "Butter", "Cream", "Tomato"] },
    { id: 8, name: "Garlic Naan", cat: "Mains", price: 120, img: "1640625314547-aee9a7696589", emoji: "🫓", veg: true, spicy: false, allergens: ["Gluten", "Dairy"], rating: 4.6, pop: 84, desc: "Fresh tandoor naan brushed with garlic butter and coriander.", ing: ["Flour", "Garlic", "Butter", "Coriander"] },
    { id: 9, name: "Gulab Jamun", cat: "Desserts", price: 280, img: "1666190092159-3171cf0fbb12", emoji: "🍡", veg: true, spicy: false, allergens: ["Dairy", "Gluten"], rating: 4.7, pop: 78, desc: "Three warm milk dumplings soaked in rose-cardamom syrup.", ing: ["Milk powder", "Flour", "Sugar syrup", "Cardamom"] },
    { id: 10, name: "Kheer", cat: "Desserts", price: 320, img: "1777613112969-d7511ddfbe15", emoji: "🍮", veg: true, spicy: false, allergens: ["Dairy", "Nuts"], rating: 4.5, pop: 66, desc: "Creamy rice pudding with cardamom, topped with almonds and pistachios.", ing: ["Rice", "Milk", "Sugar", "Almonds", "Pistachios"] },
    { id: 11, name: "Mango Lassi", cat: "Drinks", price: 350, img: "1623065422902-30a2d299bbe4", emoji: "🥭", veg: true, spicy: false, allergens: ["Dairy"], rating: 4.8, pop: 91, desc: "Thick chilled yogurt shake blended with sweet Sindhri mango.", ing: ["Yogurt", "Mango", "Sugar", "Ice"] },
    { id: 12, name: "Mint Margarita", cat: "Drinks", price: 300, img: "1653542772393-71ffa417b1c4", emoji: "🍹", veg: true, spicy: false, allergens: [], rating: 4.4, pop: 72, desc: "Refreshing blend of fresh mint, lemon and crushed ice.", ing: ["Mint", "Lemon", "Sugar", "Soda"] },
    { id: 13, name: "Doodh Patti Chai", cat: "Drinks", price: 150, img: "1561336526-2914f13ceb36", emoji: "☕", veg: true, spicy: false, allergens: ["Dairy"], rating: 4.6, pop: 76, desc: "Strong milky tea boiled with cardamom – the classic way.", ing: ["Tea leaves", "Milk", "Cardamom", "Sugar"] }
  ];
  const byId = id => DISHES.find(d => d.id === +id);

  /* ---------- State ---------- */
  let cart = store.get("cart", {});
  let favs = store.get("favs", []);
  let account = store.get("account", null);   // demo only – not secure
  let loggedIn = store.get("loggedIn", false);
  let addresses = store.get("addresses", []);
  let orders = store.get("orders", []);
  let reviews = store.get("reviews", [
    { name: "Ayesha K.", dish: 4, stars: 5, text: "Best biryani in town, arrived hot and on time!" },
    { name: "Bilal R.", dish: 5, stars: 4, text: "Karahi was delicious. Could be a little less oily." },
    { name: "Sana M.", dish: 11, stars: 5, text: "The mango lassi is thick and perfect." }
  ]);

  /* ---------- Toast feedback ---------- */
  let toastTimer;
  function toast(msg, actionLabel, action, icon = "bi-check-circle-fill") {
    const t = $("#toast");
    t.innerHTML = `<i class="bi ${icon}" aria-hidden="true"></i>`;
    const s = document.createElement("span"); s.textContent = msg; t.appendChild(s);
    if (actionLabel) {
      const b = document.createElement("button");
      b.className = "toast-btn"; b.type = "button"; b.textContent = actionLabel;
      b.onclick = () => { action(); hideToast(); };
      t.appendChild(b);
    }
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(hideToast, 5000);
  }
  function hideToast() { $("#toast").classList.remove("show"); }

  /* ---------- Header shadow, back-to-top, scroll reveal ---------- */
  function onScroll() {
    const y = window.scrollY;
    $("#siteHeader").classList.toggle("scrolled", y > 10);
    $("#toTop").classList.toggle("show", y > 500);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  $("#toTop").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  const revealObs = "IntersectionObserver" in window
    ? new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); revealObs.unobserve(en.target); } }), { threshold: .12 })
    : null;
  function observeReveals() {
    $$(".reveal:not(.in)").forEach(el => revealObs ? revealObs.observe(el) : el.classList.add("in"));
  }

  /* ---------- Routing (hash pages) ---------- */
  const PAGES = ["home", "menu", "search", "cart", "checkout", "confirm", "account", "track", "help"];
  let firstRoute = true;
  function go(p) { location.hash = p; }
  function route() {
    let p = location.hash.slice(1) || "home";
    if (!PAGES.includes(p)) {
      if (p === "main") { $("#main").focus(); return; }
      if (document.getElementById(p)) return;
      p = "home";
    }
    if (p === "checkout" && !cartItems().length) {
      toast("Your cart is empty – add a dish first.", null, null, "bi-info-circle-fill");
      location.replace("#menu"); return;
    }
    $$(".page").forEach(s => s.classList.toggle("active", s.id === p));
    $$(".nav a").forEach(a => a.removeAttribute("aria-current"));
    const link = $(`.nav a[href="#${p}"]`);
    if (link) link.setAttribute("aria-current", "page");
    $("#nav-toggle").checked = false;
    window.scrollTo(0, 0);
    if (!firstRoute) {
      const h = $(`#${p} h1`);
      if (h) { h.setAttribute("tabindex", "-1"); h.focus({ preventScroll: true }); }
    }
    firstRoute = false;
    document.title = (p === "home" ? "Food Website – Fresh Food Delivered Hot" : ($(`#${p} h1`).textContent.trim() + " · Food Website"));
    if (p === "checkout") initCheckout();
    if (p === "confirm") renderConfirm();
    if (p === "account") renderAccount();
    if (p === "track") renderTrack();
    if (p === "search") setTimeout(() => $("#q").focus(), 60);
    observeReveals();
  }
  window.addEventListener("hashchange", route);

  /* Clicking the logo / a link to the page you're already on: scroll to top */
  document.addEventListener("click", e => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    if (a.getAttribute("href") === (location.hash || "#home")) {
      e.preventDefault();
      $("#nav-toggle").checked = false;
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });

  /* ---------- Images ---------- */
  function artHTML(d, w = 600) {
    return `<span class="img-wrap" data-emoji="${d.emoji}"><img src="${IMG(d.img, w)}" alt="${esc(d.name)}" loading="lazy"
      onload="this.parentNode.classList.add('loaded')" onerror="this.parentNode.classList.add('img-failed');this.remove()"></span>`;
  }

  /* ---------- Cards ---------- */
  function cardHTML(d, i = 0) {
    const fav = favs.includes(d.id);
    return `<article class="card" style="--i:${i}">
      <button type="button" class="card-media" data-detail="${d.id}" aria-label="View details: ${esc(d.name)}">
        <span class="price-pill">${rs(d.price)}</span>${artHTML(d)}
      </button>
      <button type="button" class="fav" data-fav="${d.id}" aria-pressed="${fav}" aria-label="Save ${esc(d.name)} to favourites"><i class="bi ${fav ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i></button>
      <div class="card-body">
        <div class="tags">${d.veg ? '<span class="tag tag-veg"><i class="bi bi-flower1" aria-hidden="true"></i> Veg</span>' : ""}${d.spicy ? '<span class="tag tag-spicy"><i class="bi bi-fire" aria-hidden="true"></i> Spicy</span>' : ""}${d.pop >= 90 ? '<span class="tag tag-pop"><i class="bi bi-award" aria-hidden="true"></i> Popular</span>' : ""}</div>
        <h3><button type="button" class="link" data-detail="${d.id}">${esc(d.name)}</button></h3>
        <p class="desc">${esc(d.desc)}</p>
        <div class="card-foot"><span class="price">${rs(d.price)}</span><span class="rating" aria-label="Rated ${d.rating} out of 5"><i class="bi bi-star-fill" aria-hidden="true"></i> ${d.rating}</span></div>
        <button type="button" class="btn btn-primary btn-block" data-add="${d.id}"><i class="bi bi-cart-plus" aria-hidden="true"></i> Add to cart</button>
      </div>
    </article>`;
  }
  function renderFeatured() {
    $("#featured").innerHTML = [...DISHES].sort((a, b) => b.pop - a.pop).slice(0, 4).map(cardHTML).join("");
  }

  /* ---------- Menu: tabs, filters, sort ---------- */
  let cat = "All";
  function renderMenu() {
    const veg = $("#fVeg").checked, spicy = $("#fSpicy").checked,
      nuts = $("#fNuts").checked, dairy = $("#fDairy").checked, max = +$("#fPrice").value;
    const list = DISHES.filter(d =>
      (cat === "All" || d.cat === cat) && (!veg || d.veg) && (!spicy || d.spicy) &&
      (!nuts || !d.allergens.includes("Nuts")) && (!dairy || !d.allergens.includes("Dairy")) && d.price <= max);
    const s = $("#sortBy").value;
    list.sort((a, b) => s === "low" ? a.price - b.price : s === "high" ? b.price - a.price : s === "rating" ? b.rating - a.rating : b.pop - a.pop);
    $("#menuGrid").innerHTML = list.length ? list.map(cardHTML).join("") :
      `<div class="empty"><span class="empty-icon"><i class="bi bi-funnel" aria-hidden="true"></i></span><h2>No dishes match these filters</h2><p>Try removing a filter or choosing another category.</p><button type="button" class="btn btn-primary" data-reset><i class="bi bi-arrow-counterclockwise" aria-hidden="true"></i> Reset filters</button></div>`;
    const active = veg || spicy || nuts || dairy || max < 99999 || cat !== "All";
    $("#menuCount").textContent = `Showing ${list.length} of ${DISHES.length} dishes${active ? " (filtered)" : ""}`;
  }
  $("#catTabs").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]"); if (!b) return;
    cat = b.dataset.cat;
    $$("#catTabs button").forEach(x => x.setAttribute("aria-pressed", x === b));
    renderMenu();
  });
  ["#fVeg", "#fSpicy", "#fNuts", "#fDairy", "#fPrice", "#sortBy"].forEach(s => $(s).addEventListener("change", renderMenu));
  function resetFilters() {
    ["#fVeg", "#fSpicy", "#fNuts", "#fDairy"].forEach(s => $(s).checked = false);
    $("#fPrice").value = "99999"; $("#sortBy").value = "pop"; cat = "All";
    $$("#catTabs button").forEach(x => x.setAttribute("aria-pressed", x.dataset.cat === "All"));
    renderMenu(); toast("Filters reset – showing the full menu", null, null, "bi-arrow-counterclockwise");
  }

  /* ---------- Cart ---------- */
  function cartItems() {
    return Object.entries(cart).filter(([, q]) => q > 0).map(([id, q]) => ({ d: byId(id), q })).filter(i => i.d);
  }
  function totals() {
    const sub = cartItems().reduce((s, i) => s + i.d.price * i.q, 0);
    const delivery = sub === 0 || sub >= 2000 ? 0 : 150;
    const tax = Math.round(sub * 0.05);
    return { sub, delivery, tax, total: sub + delivery + tax };
  }
  function saveCart(bump) { store.set("cart", cart); updateCartUI(bump); }
  function updateCartUI(bump) {
    const n = cartItems().reduce((s, i) => s + i.q, 0);
    const c = $("#cartCount");
    c.textContent = n;
    if (bump) {
      c.classList.remove("bump"); $("#cartLink").classList.remove("wiggle");
      void c.offsetWidth;
      c.classList.add("bump"); $("#cartLink").classList.add("wiggle");
    }
    $("#cartLink").setAttribute("aria-label", `Cart, ${n} item${n === 1 ? "" : "s"}`);
    renderCart();
  }
  function addToCart(id, qty, btn) {
    cart[id] = (cart[id] || 0) + qty; saveCart(true);
    const d = byId(id);
    if (btn) {
      const old = btn.innerHTML;
      btn.classList.add("added"); btn.innerHTML = '<i class="bi bi-check2-circle" aria-hidden="true"></i> Added';
      setTimeout(() => { btn.classList.remove("added"); btn.innerHTML = old; }, 1300);
    }
    toast(`${qty} × ${d.name} added to cart`, "View cart", () => go("cart"), "bi-cart-check-fill");
  }
  function removeItem(id) {
    const q = cart[id]; delete cart[id]; saveCart();
    toast(`${byId(id).name} removed from cart`, "Undo", () => { cart[id] = q; saveCart(true); }, "bi-trash3");
  }
  function renderCart() {
    const items = cartItems();
    $("#cartEmpty").hidden = items.length > 0;
    $("#cartWrap").hidden = !items.length;
    $("#cartList").innerHTML = items.map(({ d, q }) => `<li class="cart-item">
      <div class="ci-art">${artHTML(d, 200)}</div>
      <div class="ci-info"><h3>${esc(d.name)}</h3><p>${rs(d.price)} each</p></div>
      <div class="qty" role="group" aria-label="Quantity for ${esc(d.name)}">
        <button type="button" data-dec="${d.id}" aria-label="Decrease ${esc(d.name)}"><i class="bi bi-dash-lg" aria-hidden="true"></i></button>
        <output>${q}</output>
        <button type="button" data-inc="${d.id}" aria-label="Increase ${esc(d.name)}"><i class="bi bi-plus-lg" aria-hidden="true"></i></button>
      </div>
      <div class="ci-total">${rs(d.price * q)}</div>
      <button type="button" class="remove" data-remove="${d.id}"><i class="bi bi-trash3" aria-hidden="true"></i> Remove</button>
    </li>`).join("");
    const t = totals();
    $$('[data-sum="sub"]').forEach(e => e.textContent = rs(t.sub));
    $$('[data-sum="delivery"]').forEach(e => e.textContent = t.delivery ? rs(t.delivery) : "Free");
    $$('[data-sum="tax"]').forEach(e => e.textContent = rs(t.tax));
    $$('[data-sum="total"]').forEach(e => e.textContent = rs(t.total));
    $$('[data-sum="hint"]').forEach(e => e.textContent = t.sub && t.sub < 2000 ? `Add ${rs(2000 - t.sub)} more for free delivery` : t.sub ? "🎉 You get free delivery!" : "");
    $("#freeBar").style.width = Math.min(100, t.sub / 20) + "%";
    $("#coItems").innerHTML = items.map(({ d, q }) => `<li><span>${q} × ${esc(d.name)}</span><span>${rs(d.price * q)}</span></li>`).join("");
  }

  /* ---------- Dish detail dialog ---------- */
  let dlgId = null, dlgQty = 1;
  function updateDlgBtn() {
    const d = byId(dlgId);
    $("#dlgQty").textContent = dlgQty;
    $("#dlgAdd").innerHTML = `<i class="bi bi-cart-plus" aria-hidden="true"></i> Add ${dlgQty} to cart · ${rs(d.price * dlgQty)}`;
    $("#dlgMinus").disabled = dlgQty <= 1;
  }
  function openDetail(id) {
    const d = byId(id); dlgId = d.id; dlgQty = 1;
    $("#dlgArt").innerHTML = artHTML(d, 800);
    $("#dlgCat").textContent = d.cat + (d.veg ? " · Vegetarian" : "") + (d.spicy ? " · Spicy" : "");
    $("#dlgName").textContent = d.name;
    $("#dlgRating").innerHTML = `<i class="bi bi-star-fill" aria-hidden="true"></i> ${d.rating} / 5`;
    $("#dlgDesc").textContent = d.desc;
    $("#dlgIng").innerHTML = d.ing.map(i => `<li>${esc(i)}</li>`).join("");
    $("#dlgAllergens").textContent = d.allergens.length ? d.allergens.join(", ") : "None";
    const rel = DISHES.filter(x => x.cat === d.cat && x.id !== d.id).concat(DISHES.filter(x => x.cat !== d.cat && x.pop > 85)).slice(0, 3);
    $("#dlgRelated").innerHTML = rel.map(x => `<button type="button" data-related="${x.id}">${artHTML(x, 150)}<span>${esc(x.name)}<small>${rs(x.price)}</small></span></button>`).join("");
    updateDlgBtn();
    const dlg = $("#dishDialog");
    if (!dlg.open) dlg.showModal();
    dlg.scrollTop = 0;
  }
  $("#dlgMinus").onclick = () => { if (dlgQty > 1) { dlgQty--; updateDlgBtn(); } };
  $("#dlgPlus").onclick = () => { if (dlgQty < 20) { dlgQty++; updateDlgBtn(); } };
  $("#dlgAdd").onclick = () => { addToCart(dlgId, dlgQty); $("#dishDialog").close(); };
  $("#dlgRelated").addEventListener("click", e => { const b = e.target.closest("[data-related]"); if (b) openDetail(b.dataset.related); });

  $$("dialog").forEach(dlg => dlg.addEventListener("click", e => {
    if (e.target.closest("[data-close]") || e.target === dlg) dlg.close();
  }));

  /* ---------- Global click delegation ---------- */
  document.addEventListener("click", e => {
    let t;
    if ((t = e.target.closest("[data-add]"))) addToCart(+t.dataset.add, 1, t);
    else if ((t = e.target.closest("[data-detail]"))) openDetail(t.dataset.detail);
    else if ((t = e.target.closest("[data-fav]"))) toggleFav(+t.dataset.fav);
    else if ((t = e.target.closest("[data-inc]"))) { cart[t.dataset.inc]++; saveCart(true); }
    else if ((t = e.target.closest("[data-dec]"))) { const id = t.dataset.dec; if (cart[id] > 1) { cart[id]--; saveCart(true); } else removeItem(id); }
    else if ((t = e.target.closest("[data-remove]"))) removeItem(t.dataset.remove);
    else if ((t = e.target.closest("[data-reset]"))) resetFilters();
    else if ((t = e.target.closest("[data-q]"))) { $("#q").value = t.dataset.q; runSearch(t.dataset.q, true); }
    else if ((t = e.target.closest("[data-reorder]"))) reorder(t.dataset.reorder);
    else if ((t = e.target.closest("[data-deladdr]"))) deleteAddress(+t.dataset.deladdr);
  });

  function toggleFav(id) {
    const on = !favs.includes(id);
    favs = on ? [...favs, id] : favs.filter(x => x !== id);
    store.set("favs", favs);
    $$(`[data-fav="${id}"]`).forEach(b => {
      b.setAttribute("aria-pressed", on);
      b.innerHTML = `<i class="bi ${on ? "bi-heart-fill" : "bi-heart"}" aria-hidden="true"></i>`;
      b.classList.remove("pop"); void b.offsetWidth; b.classList.add("pop");
    });
    toast(on ? `${byId(id).name} saved to favourites` : `${byId(id).name} removed from favourites`, on ? null : "Undo", () => toggleFav(id), on ? "bi-heart-fill" : "bi-heart");
    if (loggedIn) renderFavs();
  }

  /* ---------- Search with suggestions & typo tolerance ---------- */
  const q = $("#q"), sug = $("#suggest");
  let sugIndex = -1, searchTimer;
  const haystack = d => (d.name + " " + d.cat + " " + d.desc + " " + d.ing.join(" ") +
    (d.veg ? " vegetarian veg" : "") + (d.spicy ? " spicy hot" : "") + (d.cat === "Desserts" ? " dessert sweet" : "") + (d.cat === "Drinks" ? " drink" : "")).toLowerCase();
  function lev(a, b) {
    const m = Array.from({ length: a.length + 1 }, (_, i) => [i]);
    for (let j = 1; j <= b.length; j++) m[0][j] = j;
    for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++)
      m[i][j] = Math.min(m[i - 1][j] + 1, m[i][j - 1] + 1, m[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
    return m[a.length][b.length];
  }
  function fuzzyMatch(d, v) {
    const words = haystack(d).split(/[^a-z]+/);
    return v.split(/\s+/).every(t => words.some(w => w.includes(t) || (t.length > 3 && lev(t, w) <= (t.length > 6 ? 2 : 1))));
  }
  function showIdle() {
    $("#searchIdle").hidden = false; $("#noResults").hidden = true;
    $("#searchResults").innerHTML = ""; $("#searchStatus").textContent = "";
  }
  function runSearch(raw, now) {
    const v = raw.trim().toLowerCase();
    $("#clearSearch").hidden = !v;
    if (!v) { showIdle(); return; }
    $("#searchStatus").textContent = "Searching…";
    $("#searchResults").setAttribute("aria-busy", "true");
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      let res = DISHES.filter(d => haystack(d).includes(v)), fuzzy = false;
      if (!res.length) { res = DISHES.filter(d => fuzzyMatch(d, v)); fuzzy = res.length > 0; }
      $("#searchResults").removeAttribute("aria-busy");
      $("#searchIdle").hidden = true;
      $("#searchResults").innerHTML = res.map(cardHTML).join("");
      $("#noResults").hidden = res.length > 0;
      if (res.length) {
        $("#searchStatus").textContent = `${res.length} result${res.length > 1 ? "s" : ""} for “${raw.trim()}”` + (fuzzy ? " – showing close matches, please check the spelling" : "");
      } else {
        $("#searchStatus").textContent = `0 results for “${raw.trim()}”`;
        $("#nrQuery").textContent = raw.trim();
      }
    }, now ? 150 : 350);
  }
  function hideSug() { sug.hidden = true; q.setAttribute("aria-expanded", "false"); q.removeAttribute("aria-activedescendant"); sugIndex = -1; }
  q.addEventListener("input", () => {
    const v = q.value.trim().toLowerCase();
    runSearch(q.value);
    if (!v) { hideSug(); return; }
    const list = DISHES.filter(d => d.name.toLowerCase().includes(v) || d.cat.toLowerCase().includes(v)).slice(0, 5);
    sugIndex = -1;
    sug.innerHTML = list.map((d, i) => {
      const k = d.name.toLowerCase().indexOf(v);
      const label = k >= 0 ? esc(d.name.slice(0, k)) + "<mark>" + esc(d.name.slice(k, k + v.length)) + "</mark>" + esc(d.name.slice(k + v.length)) : esc(d.name);
      return `<li role="option" id="sg${i}" data-sid="${d.id}" aria-selected="false"><img src="${IMG(d.img, 100)}" alt="" onerror="this.style.visibility='hidden'"><span>${label}</span><small>${d.cat}</small></li>`;
    }).join("");
    sug.hidden = !list.length;
    q.setAttribute("aria-expanded", String(!!list.length));
  });
  q.addEventListener("keydown", e => {
    const items = $$("li", sug);
    if (sug.hidden || !items.length) return;
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      sugIndex = (sugIndex + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((li, i) => { li.classList.toggle("active", i === sugIndex); li.setAttribute("aria-selected", i === sugIndex); });
      q.setAttribute("aria-activedescendant", "sg" + sugIndex);
    } else if (e.key === "Enter" && sugIndex >= 0) {
      e.preventDefault(); const id = items[sugIndex].dataset.sid; hideSug(); openDetail(id);
    } else if (e.key === "Escape") hideSug();
  });
  sug.addEventListener("mousedown", e => {
    const li = e.target.closest("[data-sid]"); if (!li) return;
    e.preventDefault(); hideSug(); openDetail(li.dataset.sid);
  });
  q.addEventListener("blur", () => setTimeout(hideSug, 120));
  $("#searchForm").addEventListener("submit", e => { e.preventDefault(); hideSug(); runSearch(q.value, true); });
  $("#clearSearch").addEventListener("click", () => { q.value = ""; hideSug(); runSearch(""); q.focus(); });
  $("#homeSearch").addEventListener("submit", e => {
    e.preventDefault();
    q.value = $("#homeQ").value; go("search"); runSearch(q.value, true);
  });

  /* ---------- Form validation (real-time, plain messages) ---------- */
  const RULES = {
    name: v => v.trim().length >= 2 || "Please enter your name (at least 2 letters).",
    phone: v => /^03\d{2}-?\d{7}$/.test(v.trim()) || "Enter an 11-digit mobile number like 0312-3456789.",
    area: v => !!v || "Please choose your area from the list.",
    address: v => v.trim().length >= 10 || "Please add house number, street and area so the rider can find you.",
    card: v => /^\d{16}$/.test(v.replace(/\s/g, "")) || "Card number must be 16 digits – check the front of your card.",
    expiry: v => {
      const m = /^(0[1-9]|1[0-2])\/(\d{2})$/.exec(v.trim());
      if (!m) return "Use the format MM/YY, for example 08/28.";
      return new Date(2000 + +m[2], +m[1], 1) > new Date() || "This card has expired. Please use another card.";
    },
    cvv: v => /^\d{3}$/.test(v) || "CVV is the 3 digits on the back of your card.",
    email: v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || "Enter an email like name@example.com.",
    password: v => (v.length >= 8 && /\d/.test(v) && /[a-z]/i.test(v)) || "Password needs 8+ characters with at least one letter and one number.",
    passwordLogin: v => v.length > 0 || "Please enter your password.",
    message: v => v.trim().length >= 10 || "Please write at least 10 characters so we can help you."
  };
  function validateField(el) {
    const rule = RULES[el.dataset.rule]; if (!rule) return true;
    const res = rule(el.value), ok = res === true;
    const msg = document.getElementById(el.id + "Err");
    el.setAttribute("aria-invalid", String(!ok));
    const f = el.closest(".field"); if (f) f.classList.toggle("ok", ok);
    if (msg) msg.innerHTML = ok ? "" : `<i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i> ${esc(res)}`;
    return ok;
  }
  function validateWithin(root) {
    const fields = $$("[data-rule]", root).filter(el => !el.closest("[hidden]"));
    const bad = fields.filter(el => !validateField(el));
    if (bad.length) bad[0].focus();
    return !bad.length;
  }
  document.addEventListener("focusout", e => { const el = e.target; if (el.dataset && el.dataset.rule && el.value !== "") validateField(el); });
  document.addEventListener("input", e => { const el = e.target; if (el.dataset && el.dataset.rule && el.getAttribute("aria-invalid") === "true") validateField(el); });
  document.addEventListener("change", e => { const el = e.target; if (el.tagName === "SELECT" && el.dataset.rule) validateField(el); });

  $("#ccNum").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 "); });
  $("#ccExp").addEventListener("input", e => { let v = e.target.value.replace(/\D/g, "").slice(0, 4); if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2); e.target.value = v; });
  $("#ccCvv").addEventListener("input", e => { e.target.value = e.target.value.replace(/\D/g, ""); });

  $$(".pw-toggle").forEach(b => b.addEventListener("click", () => {
    const inp = document.getElementById(b.getAttribute("aria-controls"));
    const show = inp.type === "password";
    inp.type = show ? "text" : "password";
    b.innerHTML = `<i class="bi ${show ? "bi-eye-slash" : "bi-eye"}" aria-hidden="true"></i> <span>${show ? "Hide" : "Show"}</span>`;
    b.setAttribute("aria-pressed", show);
  }));

  /* ---------- Checkout ---------- */
  function setCoStep(n) {
    $("#stepDetails").hidden = n !== 2;
    $("#stepPayment").hidden = n !== 3;
    $$("#coSteps li").forEach((li, i) => {
      li.classList.toggle("done", i + 1 < n);
      li.classList.toggle("current", i + 1 === n);
      if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    const first = $(n === 2 ? "#coName" : 'input[name="pay"]:checked');
    if (first) first.focus();
  }
  function initCheckout() {
    renderCart();
    const wrap = $("#savedAddrWrap"), sel = $("#savedAddr");
    if (loggedIn && account && !$("#coName").value) $("#coName").value = account.name;
    if (loggedIn && addresses.length) {
      wrap.hidden = false;
      sel.innerHTML = `<option value="">– Type a new address –</option>` + addresses.map((a, i) => `<option value="${i}">${esc(a.label)}: ${esc(a.text)}</option>`).join("");
    } else wrap.hidden = true;
    setCoStep(2);
  }
  $("#savedAddr").addEventListener("change", e => {
    const a = addresses[e.target.value];
    $("#coAddress").value = a ? a.text : "";
    if (a) validateField($("#coAddress"));
  });
  $("#toPayment").addEventListener("click", () => { if (validateWithin($("#stepDetails"))) setCoStep(3); });
  $("#backDetails").addEventListener("click", () => setCoStep(2));
  $$('input[name="pay"]').forEach(r => r.addEventListener("change", () => {
    $("#cardFields").hidden = $('input[name="pay"]:checked').value !== "card";
  }));
  $("#checkoutForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateWithin($("#stepPayment"))) return;
    const t = totals(), pay = $('input[name="pay"]:checked').value;
    $("#cdBody").innerHTML =
      `<ul class="mini-items">${cartItems().map(({ d, q }) => `<li><span>${q} × ${esc(d.name)}</span><span>${rs(d.price * q)}</span></li>`).join("")}</ul>
       <p class="sum-line">Total: <strong>${rs(t.total)}</strong></p>
       <p class="muted small"><i class="bi bi-geo-alt" aria-hidden="true"></i> ${esc($("#coAddress").value)}, ${esc($("#coArea").value)}<br>
       <i class="bi bi-wallet2" aria-hidden="true"></i> ${pay === "card" ? "Card ending " + $("#ccNum").value.replace(/\s/g, "").slice(-4) : "Cash on delivery"}</p>`;
    $("#confirmDialog").showModal();
  });
  $("#placeOrder").addEventListener("click", () => {
    const t = totals();
    const order = {
      no: "FW-" + Math.floor(10000 + Math.random() * 90000),
      items: cartItems().map(({ d, q }) => ({ id: d.id, q })),
      total: t.total, placed: Date.now(), status: 0, cancelled: false, rated: false,
      address: $("#coAddress").value.trim() + ", " + $("#coArea").value,
      notes: [{ t: Date.now(), msg: "Order received – sent to the kitchen." }]
    };
    orders.unshift(order); store.set("orders", orders);
    cart = {}; saveCart();
    $("#checkoutForm").reset(); $("#cardFields").hidden = true;
    $$("#checkoutForm .field").forEach(f => f.classList.remove("ok"));
    $$("#checkoutForm [aria-invalid]").forEach(f => f.removeAttribute("aria-invalid"));
    $("#confirmDialog").close();
    go("confirm");
    confetti();
    startTracking();
  });

  function confetti() {
    const box = $(".confirm-box"); if (!box || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const colors = ["#f59e0b", "#ea580c", "#c2410c", "#15803d", "#fcd34d"];
    for (let i = 0; i < 40; i++) {
      const c = document.createElement("span");
      c.className = "confetti";
      c.style.left = Math.random() * 100 + "%";
      c.style.background = colors[i % colors.length];
      c.style.animationDelay = Math.random() * .6 + "s";
      box.appendChild(c);
      setTimeout(() => c.remove(), 3400);
    }
  }

  function renderConfirm() {
    const o = orders[0];
    if (!o) { $("#cfNo").textContent = "No recent order"; $("#cfEta").textContent = "–"; $("#cfItems").innerHTML = ""; $("#cfTotal").textContent = "–"; return; }
    $("#cfNo").textContent = o.no;
    $("#cfEta").textContent = `~35 min (by ${timeStr(o.placed + 35 * 60000)})`;
    $("#cfItems").innerHTML = o.items.map(i => { const d = byId(i.id); return `<li><span>${i.q} × ${esc(d.name)}</span><span>${rs(d.price * i.q)}</span></li>`; }).join("");
    $("#cfTotal").textContent = rs(o.total);
  }

  /* ---------- Order tracking ---------- */
  const STATUS_MSG = [
    "We've received your order and sent it to the kitchen.",
    "Our chefs are cooking your food fresh.",
    "Your rider has picked up the food and is on the way.",
    "Delivered! Enjoy your meal."
  ];
  const STATUS_ICON = ["bi-receipt", "bi-fire", "bi-bicycle", "bi-house-door-fill"];
  const ETA_MIN = [35, 25, 12, 0];
  let trackTimer = null;
  const activeOrder = () => orders.find(o => !o.cancelled && o.status < 3) || null;

  function startTracking() {
    clearInterval(trackTimer);
    trackTimer = setInterval(() => {
      const o = activeOrder();
      if (!o) { clearInterval(trackTimer); return; }
      o.status++;
      o.notes.unshift({ t: Date.now(), msg: STATUS_MSG[o.status] });
      store.set("orders", orders);
      toast(`Order ${o.no}: ${STATUS_MSG[o.status]}`, "Track", () => go("track"), "bi-bell-fill");
      if ($("#track").classList.contains("active")) renderTrack();
    }, 12000); // demo speed: status changes every 12 seconds
  }

  function renderTrack() {
    const o = orders.find(x => x.status < 3 && !x.cancelled) || orders[0];
    const show = !!o && (o.status < 3 || Date.now() - o.placed < 3 * 3600000 || o.cancelled);
    $("#trackEmpty").hidden = show;
    $("#trackWrap").hidden = !show;
    if (!show) return;

    $("#tkNo").textContent = o.no;
    const bar = $("#statusBar");
    bar.classList.toggle("cancelled", o.cancelled);
    $$("li", bar).forEach((li, i) => {
      li.classList.toggle("done", !o.cancelled && i < o.status);
      li.classList.toggle("current", !o.cancelled && i === o.status);
      if (!o.cancelled && i === o.status) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
    });
    if (o.cancelled) { $("#tkEta").textContent = "Cancelled"; $("#tkMsg").textContent = "This order was cancelled. You have not been charged."; }
    else if (o.status === 3) { $("#tkEta").textContent = "Delivered"; $("#tkMsg").textContent = STATUS_MSG[3]; }
    else {
      const m = ETA_MIN[o.status];
      $("#tkEta").textContent = `${m} min · ${timeStr(Date.now() + m * 60000)}`;
      $("#tkMsg").textContent = STATUS_MSG[o.status];
    }
    $("#tkItems").innerHTML = o.items.map(i => { const d = byId(i.id); return `<li><span>${i.q} × ${esc(d.name)}</span><span>${rs(d.price * i.q)}</span></li>`; }).join("");
    $("#tkTotal").textContent = rs(o.total);
    $("#tkAddr").innerHTML = `<i class="bi bi-geo-alt" aria-hidden="true"></i> Delivering to: ${esc(o.address)}`;
    $("#tkNotes").innerHTML = o.notes.map((n, i) => {
      const idx = STATUS_MSG.indexOf(n.msg);
      const icon = n.msg.startsWith("Order cancelled") ? "bi-x-circle" : idx >= 0 ? STATUS_ICON[idx] : (i === o.notes.length - 1 ? STATUS_ICON[0] : "bi-bell");
      return `<li><time>${timeStr(n.t)}</time><span><i class="bi ${icon}" aria-hidden="true"></i> ${esc(n.msg)}</span></li>`;
    }).join("");

    const canCancel = !o.cancelled && o.status < 2;
    $("#cancelBtn").disabled = !canCancel;
    $("#cancelHint").textContent = o.cancelled ? "" : canCancel
      ? "You can cancel until the rider picks up your food."
      : o.status === 3 ? "This order has been delivered." : "The rider is already on the way, so the order can't be cancelled now. Please call us if there is a problem.";

    $("#rateForm").hidden = !(o.status === 3 && !o.cancelled && !o.rated);
    $("#rateDone").hidden = !o.rated;
  }
  $("#cancelBtn").addEventListener("click", () => $("#cancelDialog").showModal());
  $("#confirmCancel").addEventListener("click", () => {
    const o = activeOrder(); $("#cancelDialog").close();
    if (!o || o.status >= 2) { toast("Sorry, this order can no longer be cancelled.", null, null, "bi-exclamation-circle-fill"); renderTrack(); return; }
    o.cancelled = true; o.notes.unshift({ t: Date.now(), msg: "Order cancelled at your request." });
    store.set("orders", orders); renderTrack();
    toast(`Order ${o.no} cancelled. You have not been charged.`, null, null, "bi-x-circle-fill");
  });
  $("#demoOrder").addEventListener("click", () => {
    orders.unshift({ no: "FW-" + Math.floor(10000 + Math.random() * 90000), items: [{ id: 4, q: 2 }, { id: 11, q: 1 }],
      total: 1813, placed: Date.now(), status: 0, cancelled: false, rated: false,
      address: "House 12, Street 4, Gulberg", notes: [{ t: Date.now(), msg: "Order received – sent to the kitchen." }] });
    store.set("orders", orders); renderTrack(); startTracking();
    toast("Demo order started – the status updates every few seconds.", null, null, "bi-play-circle-fill");
  });
  $("#rateForm").addEventListener("submit", e => {
    e.preventDefault();
    const r = $('input[name="tr"]:checked');
    if (!r) { $("#rateErr").innerHTML = '<i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i> Please choose 1 to 5 stars.'; return; }
    $("#rateErr").textContent = "";
    const o = orders.find(x => x.status === 3 && !x.cancelled && !x.rated);
    if (o) { o.rated = true; store.set("orders", orders); }
    renderTrack(); toast("Thanks for your rating!", null, null, "bi-star-fill");
  });

  /* ---------- Account ---------- */
  const rgPass = $("#rgPass");
  rgPass.addEventListener("input", () => {
    const v = rgPass.value;
    $('#pwRules [data-r="len"]').classList.toggle("ok", v.length >= 8);
    $('#pwRules [data-r="let"]').classList.toggle("ok", /[a-z]/i.test(v));
    $('#pwRules [data-r="num"]').classList.toggle("ok", /\d/.test(v));
  });
  $("#rgEmail").addEventListener("input", e => { if (e.target.value.includes("@") && e.target.value.includes(".")) validateField(e.target); });

  $("#regForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateWithin(e.target)) return;
    account = { name: $("#rgName").value.trim(), email: $("#rgEmail").value.trim().toLowerCase(), pass: rgPass.value };
    loggedIn = true; store.set("account", account); store.set("loggedIn", true);
    e.target.reset(); $$("#pwRules li").forEach(li => li.classList.remove("ok"));
    $$("#regForm .field").forEach(f => f.classList.remove("ok"));
    renderAccount(); toast(`Welcome, ${account.name}! Your account is ready.`, null, null, "bi-person-check-fill");
  });
  $("#loginForm").addEventListener("submit", e => {
    e.preventDefault();
    $("#loginErr").textContent = "";
    if (!validateWithin(e.target)) return;
    const email = $("#liEmail").value.trim().toLowerCase(), pass = $("#liPass").value;
    if (!account || account.email !== email) {
      $("#loginErr").innerHTML = '<i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i> No account found for this email. Check the spelling, or create an account.';
      $("#liEmail").focus(); return;
    }
    if (account.pass !== pass) {
      $("#loginErr").innerHTML = '<i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i> Wrong password. Check Caps Lock, or use “Forgot password?” to reset it.';
      $("#liPass").focus(); return;
    }
    loggedIn = true; store.set("loggedIn", true); e.target.reset();
    $$("#loginForm .field").forEach(f => f.classList.remove("ok"));
    renderAccount(); toast(`Welcome back, ${account.name}!`, null, null, "bi-person-check-fill");
  });
  $("#logoutBtn").addEventListener("click", () => { loggedIn = false; store.set("loggedIn", false); renderAccount(); toast("You have logged out.", null, null, "bi-box-arrow-right"); });

  $("#forgotBtn").addEventListener("click", () => {
    $("#forgotForm").hidden = false; $("#forgotDone").hidden = true;
    $("#fgEmail").value = $("#liEmail").value;
    $("#forgotDialog").showModal();
  });
  $("#forgotForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateWithin(e.target)) return;
    $("#forgotForm").hidden = true;
    const d = $("#forgotDone"); d.hidden = false;
    d.innerHTML = `<p><i class="bi bi-envelope-check-fill" aria-hidden="true"></i> <strong>Check your inbox.</strong></p><p>If an account exists for <strong>${esc($("#fgEmail").value)}</strong>, we've sent a reset link. It may take a minute – also check your spam folder.</p><button type="button" class="btn btn-primary" data-close>Back to login</button>`;
  });

  function renderAccount() {
    $("#authArea").hidden = loggedIn;
    $("#profileArea").hidden = !loggedIn;
    if (!loggedIn || !account) return;
    $("#pfName").textContent = "Hello, " + account.name + " 👋";
    $("#pfEmail").textContent = account.email;
    $("#pfAvatar").textContent = account.name.charAt(0).toUpperCase();
    $("#addrList").innerHTML = addresses.length
      ? addresses.map((a, i) => `<li><span><strong><i class="bi ${a.label === "Work" ? "bi-briefcase" : a.label === "Home" ? "bi-house" : "bi-pin-map"}" aria-hidden="true"></i> ${esc(a.label)}</strong>${esc(a.text)}</span><button type="button" class="text-link as-btn" data-deladdr="${i}" aria-label="Delete ${esc(a.label)} address"><i class="bi bi-trash3" aria-hidden="true"></i> Delete</button></li>`).join("")
      : `<li class="muted">No saved addresses yet. Add one below to check out faster.</li>`;
    $("#historyList").innerHTML = orders.length
      ? orders.map(o => {
          const status = o.cancelled ? '<span class="badge cancelled"><i class="bi bi-x-circle" aria-hidden="true"></i> Cancelled</span>' : o.status === 3 ? '<span class="badge"><i class="bi bi-check-circle" aria-hidden="true"></i> Delivered</span>' : '<span class="badge active"><i class="bi bi-hourglass-split" aria-hidden="true"></i> In progress</span>';
          return `<li><div><p><strong>${o.no}</strong> ${status}</p><p class="muted small">${new Date(o.placed).toLocaleDateString()} · ${o.items.map(i => i.q + "× " + esc(byId(i.id).name)).join(", ")}</p><p class="small">${rs(o.total)}</p></div><button type="button" class="btn btn-ghost btn-sm" data-reorder="${o.no}"><i class="bi bi-arrow-repeat" aria-hidden="true"></i> Reorder</button></li>`;
        }).join("")
      : `<li class="muted">No orders yet. <a href="#menu">Browse the menu</a></li>`;
    renderFavs();
  }
  function renderFavs() {
    const list = favs.map(byId).filter(Boolean);
    $("#favGrid").innerHTML = list.length ? list.map(cardHTML).join("")
      : `<p class="muted">Tap the <i class="bi bi-heart" aria-hidden="true"></i> on any dish to save it here.</p>`;
  }
  function reorder(no) {
    const o = orders.find(x => x.no === no); if (!o) return;
    o.items.forEach(i => { cart[i.id] = (cart[i.id] || 0) + i.q; });
    saveCart(true); go("cart");
    toast(`Items from ${no} added to your cart`, null, null, "bi-arrow-repeat");
  }
  $("#addrForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateWithin(e.target)) return;
    addresses.push({ label: $("#adLabel").value, text: $("#adText").value.trim() });
    store.set("addresses", addresses); $("#adText").value = "";
    $("#adText").closest(".field").classList.remove("ok");
    renderAccount(); toast("Address saved", null, null, "bi-geo-alt-fill");
  });
  function deleteAddress(i) {
    const a = addresses.splice(i, 1)[0]; store.set("addresses", addresses); renderAccount();
    toast(`${a.label} address deleted`, "Undo", () => { addresses.splice(i, 0, a); store.set("addresses", addresses); renderAccount(); }, "bi-trash3");
  }

  /* ---------- Help: contact & reviews ---------- */
  $("#contactForm").addEventListener("submit", e => {
    e.preventDefault();
    if (!validateWithin(e.target)) return;
    const name = $("#ctName").value.trim().split(" ")[0];
    const ref = "C-" + Math.floor(1000 + Math.random() * 9000);
    e.target.hidden = true;
    const d = $("#contactDone"); d.hidden = false;
    d.innerHTML = `<h2><i class="bi bi-check-circle-fill" aria-hidden="true"></i> Message sent!</h2><p>Thanks ${esc(name)}. Your reference is <strong>${ref}</strong>. We usually reply within 24 hours by email.</p><button type="button" class="btn btn-ghost" id="newMsg">Send another message</button>`;
    d.focus();
    $("#newMsg").onclick = () => { e.target.reset(); $$("#contactForm .field").forEach(f => f.classList.remove("ok")); e.target.hidden = false; d.hidden = true; $("#ctName").focus(); };
  });

  function renderReviews() {
    const avg = reviews.reduce((s, r) => s + r.stars, 0) / reviews.length;
    $("#avgRating").innerHTML = `<i class="bi bi-star-fill" aria-hidden="true"></i> ${avg.toFixed(1)} average from ${reviews.length} reviews`;
    $("#reviewList").innerHTML = reviews.map(r => `<li><span class="r-avatar" aria-hidden="true">${esc(r.name.charAt(0))}</span><div class="grow"><div class="r-head"><strong>${esc(r.name)} · ${esc(byId(r.dish).name)}</strong><span class="r-stars" aria-label="${r.stars} out of 5 stars">${'<i class="bi bi-star-fill"></i>'.repeat(r.stars)}${'<i class="bi bi-star"></i>'.repeat(5 - r.stars)}</span></div><p>${esc(r.text)}</p></div></li>`).join("");
  }
  $("#rvDish").innerHTML = DISHES.map(d => `<option value="${d.id}">${esc(d.name)}</option>`).join("");
  $("#reviewForm").addEventListener("submit", e => {
    e.preventDefault();
    const r = $('input[name="rv"]:checked');
    if (!r) { $("#rvErr").innerHTML = '<i class="bi bi-exclamation-circle-fill" aria-hidden="true"></i> Please choose a star rating first.'; return; }
    $("#rvErr").textContent = "";
    reviews.unshift({ name: loggedIn && account ? account.name : "Guest", dish: +$("#rvDish").value, stars: +r.value, text: $("#rvText").value.trim() || "No comment." });
    store.set("reviews", reviews); e.target.reset(); renderReviews();
    toast("Thanks! Your review has been posted.", null, null, "bi-star-fill");
  });

  /* ---------- Accessibility options ---------- */
  let a11y = store.get("a11y", {});
  function applyA11y() {
    const h = document.documentElement;
    h.classList.remove("text-lg", "text-xl");
    if (a11y.size) h.classList.add("text-" + a11y.size);
    h.classList.toggle("high-contrast", !!a11y.contrast);
    $$(".size-btn").forEach(b => b.setAttribute("aria-pressed", b.dataset.size === (a11y.size || "")));
    $("#hcToggle").checked = !!a11y.contrast;
    store.set("a11y", a11y);
  }
  $$(".size-btn").forEach(b => b.addEventListener("click", () => { a11y.size = b.dataset.size; applyA11y(); toast("Text size updated", null, null, "bi-type"); }));
  $("#hcToggle").addEventListener("change", e => { a11y.contrast = e.target.checked; applyA11y(); toast(e.target.checked ? "High contrast on" : "High contrast off", null, null, "bi-circle-half"); });

  /* ---------- Start ---------- */
  renderFeatured();
  renderMenu();
  updateCartUI();
  renderReviews();
  applyA11y();
  onScroll();
  if (activeOrder()) startTracking();
  route();
})();
