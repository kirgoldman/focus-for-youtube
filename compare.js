// Before / after slider on the mock page, and the channel filter demo.
(function () {
  var M = window.YTFMock;
  var frame = document.getElementById('cmpFrame');
  if (frame && M) {
    var layer = document.getElementById('cmpLayer');
    var a = document.getElementById('cmpA'), b = document.getElementById('cmpB');
    M.build(a); M.build(b); M.injectCss();
    b.dataset.on = ['hideShorts', 'hideChips', 'hidePromos', 'hideSidebarSubs', 'hideMoreFromYT', 'grayThumbs'].concat(M.WATCH_KEYS).join(' ');
    M.fit(frame, layer, 760, 440);
    var range = document.getElementById('cmpRange');
    function setPos(p) {
      frame.style.setProperty('--p', p + '%');
      range.value = p;
    }
    setPos(100);
    var tabs = document.querySelectorAll('[data-cmp-tab]');
    tabs.forEach(function (t) {
      t.addEventListener('click', function () {
        a.dataset.page = b.dataset.page = t.dataset.cmpTab;
        tabs.forEach(function (x) { x.setAttribute('aria-selected', String(x === t)); });
      });
    });
    range.addEventListener('input', function () { frame.style.setProperty('--p', range.value + '%'); touched = true; });
    var touched = false, played = false;
    function sweep() {
      if (played) return; played = true;
      var t0 = null, from = 100, to = 46, dur = 1700;
      function ease(x) { return 1 - Math.pow(1 - x, 3); }
      function tick(ts) {
        if (touched) return;
        if (t0 === null) t0 = ts;
        var k = Math.min(1, (ts - t0) / dur);
        setPos(from + (to - from) * ease(k));
        if (k < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (e, o) { if (e[0].isIntersecting) { sweep(); o.disconnect(); } }, { threshold: 0.2 }).observe(frame);
    } else { setPos(46); }
  }

  // ---- channel filter ----
  var list = document.getElementById('chList');
  if (!list) return;
  var ITEMS = [
    ['Open Lectures', 'Linear algebra, lecture 4', 'c1'],
    ['Clip Farm', 'You will not believe this ending', 'c2'],
    ['Slow Chemistry', 'Why ice floats, in 12 minutes', 'c3'],
    ['Daily Drama', 'The feud everyone is talking about', 'c4'],
    ['Clip Farm', 'Short: cat vs cucumber', 'c5', true],
    ['Open Lectures', 'Short: one formula, explained', 'c6', true],
  ];
  var MODES = {
    off: { hide: [], text: 'Filter off. Every channel shows up.', chips: [] },
    block: { hide: ['Clip Farm', 'Daily Drama'], text: 'Block: the channels on your list disappear. Everything else stays.', chips: ['Clip Farm', 'Daily Drama'] },
    allow: { hide: null, only: ['Open Lectures', 'Slow Chemistry'], text: 'Only these: you see the channels on your list, nothing else. Their Shorts too; other Shorts go.', chips: ['Open Lectures', 'Slow Chemistry'] },
  };
  list.innerHTML = '';
  ITEMS.forEach(function (it) {
    var w = document.createElement('div'); w.className = 'ch-item';
    var inner = document.createElement('div'); inner.className = 'ch-in';
    inner.innerHTML = '<div class="ch-row"><div class="ch-th ' + it[2] + (it[3] ? ' short' : '') + '"></div><div class="ch-tx"><b></b><span></span>' + (it[3] ? '<em>Short</em>' : '') + '</div></div>';
    inner.querySelector('b').textContent = it[1];
    inner.querySelector('span').textContent = it[0];
    w.appendChild(inner); list.appendChild(w); it.el = w;
  });
  var modeText = document.getElementById('chText');
  var chips = document.getElementById('chChips');
  var btns = document.querySelectorAll('[data-mode]');
  function setMode(m) {
    var cfg = MODES[m];
    ITEMS.forEach(function (it) {
      var gone = cfg.hide ? cfg.hide.indexOf(it[0]) >= 0 : cfg.only.indexOf(it[0]) < 0;
      it.el.classList.toggle('out', gone);
    });
    modeText.textContent = cfg.text;
    chips.innerHTML = '';
    cfg.chips.forEach(function (c) { var s = document.createElement('span'); s.textContent = c; chips.appendChild(s); });
    chips.hidden = !cfg.chips.length;
    btns.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.mode === m)); });
  }
  btns.forEach(function (b) { b.addEventListener('click', function () { setMode(b.dataset.mode); auto = false; }); });
  setMode('off');
  // a gentle intro: cycle the three modes once when the block scrolls into view
  var auto = true;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e, o) {
      if (!e[0].isIntersecting) return; o.disconnect();
      var seq = ['block', 'allow'];
      seq.forEach(function (m, i) { setTimeout(function () { if (auto) setMode(m); }, 900 + i * 2600); });
    }, { threshold: 0.5 }).observe(list);
  }
})();
