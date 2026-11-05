// Hero: a scripted loop. A cursor flips switches in the extension popup and the matching parts of the page collapse away.
(function () {
  var M = window.YTFMock;
  var wrap = document.getElementById('hwWrap');
  if (!wrap || !M) return;
  var hw = document.getElementById('hw');
  var stage = document.getElementById('heroStage');
  var hp = document.getElementById('hp');
  var cursor = document.getElementById('cursor');
  var textEl = document.getElementById('heroText');
  var countEl = document.getElementById('heroCount');
  M.build(stage);

  var LW = 1060, LH = 520, compact = false, scale = 1;
  var nowEl = document.getElementById('heroNow');
  function layout() {
    compact = window.innerWidth < 760;
    var w = compact ? 760 : LW;
    hw.style.width = w + 'px';
    hw.classList.toggle('compact', compact);
    var lh = compact ? 472 : LH;
    hw.style.height = lh + 'px';
    if (compact) { if (nowEl.parentNode === hw) wrap.parentNode.insertBefore(nowEl, wrap.nextSibling); }
    else if (nowEl.parentNode !== hw) hw.appendChild(nowEl);
    scale = wrap.clientWidth / w;
    hw.style.transform = 'scale(' + scale + ')';
    wrap.style.height = (lh * scale) + 'px';
  }
  layout();
  if (window.ResizeObserver) new ResizeObserver(layout).observe(wrap); else window.addEventListener('resize', layout);

  var PAGES = {
    home: [
      { title: 'Feed and Shorts', keys: ['hideShorts', 'hideChips', 'hideHome'] },
      { title: 'Interface', keys: ['hidePromos', 'hideSidebarSubs', 'hideMoreFromYT'] },
    ],
    watch: [{ title: 'Video page', keys: M.WATCH_KEYS }],
  };
  var DONE = {
    hideShorts: 'The Shorts shelf and the Shorts tab are gone.',
    hideChips: 'The topic chips are gone.',
    hidePromos: 'The promo banner is gone.',
    hideSidebarSubs: 'The subscriptions list is gone.',
    hideMoreFromYT: 'Explore and More from YouTube are gone.',
    hideHome: 'The feed is gone. The search bar stays.',
    hideRelated: 'The recommended videos are gone.',
    hideComments: 'The comments are gone.',
    hideDescription: 'The description box is gone.',
  };

  function renderPop(page) {
    var h = '<div class="hp-head"><img src="img/icon.png" width="18" height="18" alt=""><b>Focus for YouTube</b><span>On<i class="sw on"></i></span></div>';
    PAGES[page].forEach(function (g, gi) {
      h += '<div class="hp-gh"><b>' + g.title + '</b><span>Hide all</span><i class="sw" data-all="' + gi + '"></i></div>';
      g.keys.forEach(function (k) { h += '<div class="hp-row" data-key="' + k + '"><span>' + M.LABEL[k] + '</span><i class="sw"></i></div>'; });
    });
    hp.innerHTML = h;
  }

  // ---- timing, with pause while the hero is off screen ----
  var paused = false, waiters = [];
  function setPaused(p) { paused = p; if (!p) { var w = waiters; waiters = []; w.forEach(function (f) { f(); }); } }
  function gate() { return paused ? new Promise(function (r) { waiters.push(r); }) : Promise.resolve(); }
  function sleep(ms) { return gate().then(function () { return new Promise(function (r) { setTimeout(r, ms); }); }); }
  var inView = true;
  if ('IntersectionObserver' in window) new IntersectionObserver(function (e) { inView = e[0].isIntersecting; setPaused(!inView); }, { threshold: 0.15 }).observe(wrap);
  document.addEventListener('visibilitychange', function () { setPaused(document.hidden || !inView); });

  // ---- geometry ----
  function relRect(el) {
    var a = el.getBoundingClientRect(), b = hw.getBoundingClientRect();
    return { x: (a.left - b.left) / scale, y: (a.top - b.top) / scale, w: a.width / scale, h: a.height / scale };
  }
  async function cursorTo(el) {
    if (compact) return;
    var r = relRect(el);
    cursor.style.transform = 'translate(' + (r.x + r.w / 2 + 2) + 'px,' + (r.y + r.h / 2 + 2) + 'px)';
    await sleep(700);
  }
  async function press() {
    if (compact) return;
    var m = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(cursor.style.transform);
    var d = document.createElement('div'); d.className = 'ripple';
    d.style.left = (m ? m[1] : 0) + 'px'; d.style.top = (m ? m[2] : 0) + 'px';
    hw.appendChild(d);
    d.animate([{ transform: 'translate(-50%,-50%) scale(.2)', opacity: 0.55 }, { transform: 'translate(-50%,-50%) scale(1.6)', opacity: 0 }], { duration: 560, easing: 'ease-out' }).onfinish = function () { d.remove(); };
    cursor.firstElementChild.animate([{ transform: 'scale(1)' }, { transform: 'scale(.8)' }, { transform: 'scale(1)' }], { duration: 220 });
    await sleep(160);
  }

  // ---- collapsing an element out of the layout ----
  function shown(el) { return !el.closest('.gone') && el.getClientRects().length > 0; }
  function collapse(el) {
    return new Promise(function (res) {
      var cs = getComputedStyle(el), par = getComputedStyle(el.parentElement);
      var done = function () {
        el.classList.add('gone'); el.classList.remove('hl');
        el.getAnimations().forEach(function (a) { a.cancel(); });
        el.style.overflow = ''; res();
      };
      if (cs.position === 'absolute') {
        el.animate([{ opacity: 1, transform: 'scale(1)' }, { opacity: 0, transform: 'scale(.7)' }], { duration: 300, easing: 'ease-in', fill: 'forwards' }).onfinish = done;
        return;
      }
      var r = el.getBoundingClientRect();
      var row = par.display.indexOf('flex') >= 0 && par.flexDirection.indexOf('column') < 0;
      var from, to;
      if (row) {
        from = { width: (r.width / scale) + 'px', opacity: 1 };
        to = { width: '0px', opacity: 0 };
      } else {
        var gap = parseFloat(par.rowGap) || 0;
        from = { height: (r.height / scale) + 'px', opacity: 1, marginTop: cs.marginTop, marginBottom: cs.marginBottom, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, borderTopWidth: cs.borderTopWidth, borderBottomWidth: cs.borderBottomWidth };
        to = { height: '0px', opacity: 0, marginTop: '0px', marginBottom: (-gap) + 'px', paddingTop: '0px', paddingBottom: '0px', borderTopWidth: '0px', borderBottomWidth: '0px' };
      }
      el.style.overflow = 'hidden';
      el.animate([from, to], { duration: 440, easing: 'cubic-bezier(.5,0,.2,1)', fill: 'forwards' }).onfinish = done;
    });
  }
  async function vanish(key, delay) {
    if (delay) await sleep(delay);
    var els = Array.prototype.filter.call(stage.querySelectorAll('.k-' + key), shown);
    els.forEach(function (e) { e.classList.add('hl'); });
    await sleep(420);
    await Promise.all(els.map(collapse));
  }

  // ---- text and counter ----
  var hidden = 0;
  function say(html) { textEl.innerHTML = html; textEl.classList.remove('swap'); void textEl.offsetWidth; textEl.classList.add('swap'); }
  function setCount(n) { hidden = n; countEl.textContent = n + (n === 1 ? ' thing hidden' : ' things hidden'); }
  function addHidden(n) {
    setCount(hidden + n);
    countEl.classList.remove('bump'); void countEl.offsetWidth; countEl.classList.add('bump');
  }

  // ---- one scripted step ----
  function rowOf(key) { return hp.querySelector('.hp-row[data-key="' + key + '"]'); }
  async function step(key) {
    var row = rowOf(key);
    await cursorTo(row.querySelector('.sw'));
    await press();
    row.querySelector('.sw').classList.add('on');
    say('<b>' + M.LABEL[key] + '</b> ' + (DONE[key] || ''));
    await vanish(key);
    addHidden(1);
    await sleep(320);
  }
  async function hideAll(groupIndex, keys) {
    var sw = hp.querySelector('.sw[data-all="' + groupIndex + '"]');
    await cursorTo(sw);
    await press();
    sw.classList.add('on');
    say('<b>Hide all</b> The rest of the video page goes at once.');
    var left = keys.filter(function (k) { return !rowOf(k).querySelector('.sw').classList.contains('on'); });
    left.forEach(function (k, i) { setTimeout(function () { rowOf(k).querySelector('.sw').classList.add('on'); }, i * 110); });
    await Promise.all(left.map(function (k, i) { return vanish(k, i * 110); }));
    addHidden(left.length);
  }

  // ---- page changes ----
  function resetAll() {
    stage.querySelectorAll('.gone, .hl').forEach(function (e) { e.classList.remove('gone', 'hl'); e.style.overflow = ''; e.getAnimations().forEach(function (a) { a.cancel(); }); });
    var em = stage.querySelector('.empty-msg'); if (em) em.remove();
    var pl = stage.querySelector('.player'); pl.style.height = '';
    stage.dataset.page = 'home';
    renderPop('home');
    setCount(0);
    cursor.style.transition = 'none';
    cursor.style.transform = 'translate(700px,330px)';
    void cursor.offsetWidth; cursor.style.transition = '';
    say('<b>YouTube, as it comes.</b> Everything you switch off will disappear from the page.');
  }
  async function fadeStage(fn) {
    var a = stage.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 220, fill: 'forwards' });
    await a.finished; fn(); a.cancel();
    await stage.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260 }).finished;
  }

  async function cycle() {
    resetAll();
    await fadeStage(function () {});
    await sleep(1200);
    var homeOrder = ['hideShorts', 'hideChips', 'hidePromos', 'hideSidebarSubs', 'hideMoreFromYT', 'hideHome'];
    for (var i = 0; i < homeOrder.length; i++) await step(homeOrder[i]);
    var em = document.createElement('div'); em.className = 'empty-msg'; em.textContent = 'Nothing left to scroll.';
    stage.appendChild(em);
    em.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 400, fill: 'forwards' });
    await sleep(1500);
    await fadeStage(function () { em.remove(); stage.dataset.page = 'watch'; renderPop('watch'); cursor.style.transform = 'translate(700px,330px)'; });
    say('<b>Now a video page.</b> It has its own switches.');
    await sleep(900);
    var watchOrder = ['hideRelated', 'hideComments', 'hideDescription'];
    for (var j = 0; j < watchOrder.length; j++) await step(watchOrder[j]);
    await hideAll(0, M.WATCH_KEYS);
    var pl = stage.querySelector('.player');
    pl.style.transition = 'height .9s cubic-bezier(.3,0,.2,1)';
    pl.style.height = '262px';
    cursor.style.transform = 'translate(860px,420px)';
    say('<b>Just the video.</b> Switch anything back on whenever you like.');
    await sleep(3600);
    pl.style.transition = '';
  }

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce) {
    // static end state: no looping motion
    resetAll();
    stage.dataset.page = 'watch'; renderPop('watch');
    M.WATCH_KEYS.forEach(function (k) { stage.querySelectorAll('.k-' + k).forEach(function (e) { e.classList.add('gone'); }); });
    hp.querySelectorAll('.sw').forEach(function (s) { s.classList.add('on'); });
    stage.querySelector('.player').style.height = '262px';
    cursor.style.display = 'none';
    setCount(M.WATCH_KEYS.length);
    say('<b>Just the video.</b> Everything you switch off disappears from the page.');
    return;
  }
  (async function loop() { for (;;) { await cycle(); } })();
})();
