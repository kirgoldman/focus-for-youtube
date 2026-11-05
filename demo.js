// Playground: the same switches as the extension, a mock page that reacts, and the three presets.
(function () {
  var M = window.YTFMock;
  var stage = document.getElementById('stage');
  if (!stage || !M) return;
  M.build(stage);
  M.injectCss();
  var wrap = document.getElementById('stageWrap');
  M.fit(wrap, stage, 760, 440);

  var PRESETS = {
    minimal: ['hideShorts', 'hideRelated', 'hideEndCards', 'hideInfoCards', 'disableAutoplay'],
    study: ['hideShorts', 'hideHome', 'hideChips', 'hideMixes', 'hideRelated', 'hideComments', 'hideEndCards', 'hideInfoCards', 'hideLiveChat', 'disableAutoplay', 'hidePromos', 'grayThumbs'],
    max: ['hideShorts', 'hideHome', 'hideChips', 'hideMixes', 'hideRelated', 'hideComments', 'hideDescription', 'hideActions', 'hideEndCards', 'hideInfoCards', 'hideLiveChat', 'hidePlaylist', 'hideMerch', 'disableAutoplay', 'hideSidebarSubs', 'hideMoreFromYT', 'hideVoiceSearch', 'hidePromos', 'grayThumbs'],
  };

  var on = {};
  var caption = document.getElementById('demoCaption');
  var panel = document.getElementById('demoPanel');
  var rows = {}, groupSw = {}, presetBtns = [];

  function sync() {
    stage.dataset.on = Object.keys(on).filter(function (k) { return on[k]; }).join(' ');
    M.GROUPS.forEach(function (g) {
      g.keys.forEach(function (k) { rows[k].sw.classList.toggle('on', !!on[k]); });
      var keys = g.keys.filter(function (k) { return !(g.notInAll || []).includes(k); });
      var n = keys.filter(function (k) { return on[k]; }).length;
      groupSw[g.id].classList.toggle('on', n === keys.length);
      groupSw[g.id].classList.toggle('mid', n > 0 && n < keys.length);
    });
    presetBtns.forEach(function (b) {
      var set = PRESETS[b.dataset.preset];
      var same = Object.keys(on).filter(function (k) { return on[k]; }).length === set.length && set.every(function (k) { return on[k]; });
      b.setAttribute('aria-pressed', String(same));
    });
  }
  function setPage(p) { stage.dataset.page = p; refreshTabs(); }
  function pageFor(k) {
    if (M.WATCH_KEYS.indexOf(k) >= 0) return 'watch';
    if (k === 'hideMixes' || k === 'hideVoiceSearch' || k === 'grayThumbs') return stage.dataset.page;
    return 'home';
  }
  function say(title, text) {
    caption.innerHTML = '<b></b><span></span>';
    caption.firstChild.textContent = title;
    caption.lastChild.textContent = text;
  }
  function flash(k) {
    stage.querySelectorAll('.k-' + k).forEach(function (el) { if (el.animate) el.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 350 }); });
  }
  function toggle(k) {
    on[k] = !on[k];
    setPage(pageFor(k));
    sync();
    say(M.LABEL[k], M.HINT[k]);
    if (!on[k]) flash(k);
  }

  // presets
  var pre = document.createElement('div'); pre.className = 'p-pre';
  pre.innerHTML = '<span>Presets</span>';
  [['minimal', 'Minimal'], ['study', 'Study'], ['max', 'Maximum']].forEach(function (p) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'p-chip'; b.textContent = p[1]; b.dataset.preset = p[0];
    b.addEventListener('click', function () {
      on = {}; PRESETS[p[0]].forEach(function (k) { on[k] = true; });
      sync();
      say(p[1], p[0] === 'minimal' ? 'Shorts, recommendations, end cards, info cards and autoplay.' : p[0] === 'study' ? 'Also the home feed, topic chips, Mix, comments, live chat, promo banners and grey thumbnails.' : 'Everything except hiding the whole sidebar.');
    });
    pre.appendChild(b); presetBtns.push(b);
  });
  panel.appendChild(pre);

  M.GROUPS.forEach(function (g) {
    var box = document.createElement('div'); box.className = 'p-group';
    var head = document.createElement('div'); head.className = 'p-gh';
    head.innerHTML = '<b></b><span>Hide all</span>';
    head.firstChild.textContent = g.title;
    var gs = document.createElement('button'); gs.className = 'sw'; gs.type = 'button'; gs.setAttribute('aria-label', 'Hide all: ' + g.title);
    head.appendChild(gs); groupSw[g.id] = gs;
    gs.addEventListener('click', function () {
      var keys = g.keys.filter(function (k) { return !(g.notInAll || []).includes(k); });
      var all = keys.every(function (k) { return on[k]; });
      keys.forEach(function (k) { on[k] = !all; });
      setPage(g.id === 'video' ? 'watch' : 'home');
      sync();
      say(g.title + ': Hide all', 'Switches the whole block on or off at once.');
    });
    box.appendChild(head);
    g.keys.forEach(function (k) {
      var r = document.createElement('div'); r.className = 'p-row'; r.tabIndex = 0; r.setAttribute('role', 'switch');
      var t = document.createElement('span'); t.textContent = M.LABEL[k];
      var s = document.createElement('span'); s.className = 'sw';
      r.appendChild(t); r.appendChild(s); box.appendChild(r); rows[k] = { row: r, sw: s };
      r.addEventListener('mouseenter', function () { say(M.LABEL[k], M.HINT[k]); });
      r.addEventListener('click', function () { toggle(k); });
      r.addEventListener('keydown', function (e) { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); toggle(k); } });
    });
    panel.appendChild(box);
  });

  var tabs = document.querySelectorAll('[data-page-tab]');
  function refreshTabs() { tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.pageTab === stage.dataset.page)); }); }
  tabs.forEach(function (b) { b.addEventListener('click', function () { setPage(b.dataset.pageTab); }); });
  refreshTabs();
  sync();

  // gallery of pictures, one per switch
  var pics = document.getElementById('pics');
  var gtabs = document.querySelectorAll('[data-gtab]');
  var EXTRA = { feed: ['homeToSubs'] };
  function renderGallery(id) {
    var g = M.GROUPS.filter(function (x) { return x.id === id; })[0];
    var keys = g.keys.concat(EXTRA[id] || []);
    pics.innerHTML = '';
    keys.forEach(function (k) {
      var d = document.createElement('figure'); d.className = 'pic';
      var im = document.createElement('img'); im.src = 'img/hints/' + k + '.jpg'; im.alt = M.LABEL[k] + ': the hidden part is outlined in red'; im.loading = 'lazy'; im.width = 648; im.height = 365;
      var c = document.createElement('figcaption');
      var h = document.createElement('b'); h.textContent = M.LABEL[k];
      var p = document.createElement('span'); p.textContent = M.HINT[k];
      c.appendChild(h); c.appendChild(p); d.appendChild(im); d.appendChild(c); pics.appendChild(d);
    });
    gtabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.gtab === id)); });
  }
  gtabs.forEach(function (b) { b.addEventListener('click', function () { renderGallery(b.dataset.gtab); }); });
  renderGallery('feed');
})();
