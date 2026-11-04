// Interactive demo: a mock YouTube page plus the same switches as the extension popup.
(function () {
  var GROUPS = [
    { id: 'feed', title: 'Feed and Shorts', keys: ['hideShorts', 'hideHome', 'hideChips', 'hideMixes'] },
    { id: 'video', title: 'Video page', keys: ['hideRelated', 'hideComments', 'hideDescription', 'hideActions', 'hideEndCards', 'hideInfoCards', 'hideLiveChat', 'hidePlaylist', 'hideMerch', 'disableAutoplay'] },
    { id: 'ui', title: 'Interface', keys: ['hideSidebarSubs', 'hideMoreFromYT', 'hideSidebar', 'hideVoiceSearch', 'hidePromos', 'grayThumbs'], notInAll: ['hideSidebar'] },
  ];
  // The gallery also lists the one switch that has no picture of its own in the mock.
  var GALLERY_EXTRA = { feed: ['homeToSubs'] };
  var LABEL = {
    hideShorts: 'Hide Shorts', hideHome: 'Hide home feed', homeToSubs: 'Open Subscriptions instead of Home', hideChips: 'Hide topic chips', hideMixes: 'Hide Mix playlists',
    hideRelated: 'Hide recommended videos', hideComments: 'Hide comments', hideDescription: 'Hide video description', hideActions: 'Hide like and share buttons',
    hideEndCards: 'Hide end cards', hideInfoCards: 'Hide info cards and annotations', hideLiveChat: 'Hide live chat', hidePlaylist: 'Hide playlist panel',
    hideMerch: 'Hide merch, tickets and offers', disableAutoplay: 'Turn off autoplay', hideSidebarSubs: 'Hide subscriptions in the sidebar',
    hideMoreFromYT: 'Hide Explore and “More from YouTube”', hideSidebar: 'Hide the whole sidebar', hideVoiceSearch: 'Hide voice search',
    hidePromos: 'Hide promo banners', grayThumbs: 'Black and white thumbnails',
  };
  var HINT = {
    hideShorts: 'Shorts shelves and cards in search, home and channel pages, and the Shorts tab in the menu. Shorts links open as normal videos.',
    hideHome: 'The recommended feed on the home page. The search bar stays.',
    homeToSubs: 'The Home button opens your Subscriptions instead.',
    hideChips: 'The row of topic chips above the feed.',
    hideMixes: 'Mix (radio) playlists among the recommendations.',
    hideRelated: 'The recommended videos column next to the video.',
    hideComments: 'The comments block under the video.',
    hideDescription: 'The box with the description and the view count.',
    hideActions: 'The like, dislike, share and save buttons.',
    hideEndCards: 'Cards with other videos that cover the end of a clip.',
    hideInfoCards: 'The info button and its pop-up cards on top of the video, and annotations.',
    hideLiveChat: 'The live chat next to a stream.',
    hidePlaylist: 'The playlist panel next to the video.',
    hideMerch: 'Merch, tickets and offers shelves under the video.',
    disableAutoplay: 'The autoplay switch in the player is turned off for you.',
    hideSidebarSubs: 'The list of your subscriptions in the sidebar.',
    hideMoreFromYT: 'The “Explore” block (Gaming and others) and the “More from YouTube” block (Premium, Music, Kids) in the sidebar.',
    hideSidebar: 'The whole left menu and its button.',
    hideVoiceSearch: 'The microphone button next to the search bar.',
    hidePromos: 'YouTube promo banners in the feed.',
    grayThumbs: 'Video thumbnails turn black and white, so they grab you less.',
  };
  var WATCH_KEYS = GROUPS[1].keys;

  var stage = document.getElementById('stage');
  if (!stage) return;

  // ---- mock page -----------------------------------------------------------
  function card(cls, extra) {
    return '<div class="vc ' + (extra || '') + '"><div class="thumb ' + cls + '"></div><div class="l1"></div><div class="l2"></div></div>';
  }
  function rel(cls, extra) {
    return '<div class="rel ' + (extra || '') + '"><div class="thumb ' + cls + '"></div><div class="t"><div class="l1"></div><div class="l2"></div></div></div>';
  }
  var sideItems = function (n, dot) {
    var h = '';
    for (var i = 0; i < n; i++) h += '<div class="si' + (dot ? ' dot' : '') + '"><i></i><b></b></div>';
    return h;
  };
  stage.innerHTML =
    '<div class="m-top">' +
      '<div class="m-burger k-hideSidebar"><i></i><i></i><i></i></div>' +
      '<div class="m-logo"><b></b><i></i></div>' +
      '<div class="m-search"><span class="go"></span><span class="m-mic k-hideVoiceSearch"></span></div>' +
      '<div class="m-right"><i></i><i></i><i></i></div>' +
    '</div>' +
    '<div class="m-body">' +
      '<div class="m-side k-hideSidebar">' +
        '<div class="si"><i></i><b></b></div>' +
        '<div class="si k-hideShorts"><i></i><b></b></div>' +
        '<div class="si"><i></i><b></b></div>' +
        '<div class="sec k-hideSidebarSubs"><div class="h"></div>' + sideItems(4, true) + '</div>' +
        '<div class="sec k-hideMoreFromYT"><div class="h"></div>' + sideItems(2) + '</div>' +
        '<div class="sec k-hideMoreFromYT"><div class="h"></div>' + sideItems(3) + '</div>' +
      '</div>' +
      '<div class="m-main m-home">' +
        '<div class="m-chips k-hideChips"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
        '<div class="m-grid k-hideHome">' + card('c1') + card('c2') + card('c3') + card('c4') + card('c5', 'mix k-hideMixes') + card('c6') + '</div>' +
        '<div class="m-shelf k-hideShorts"><div class="head"><i></i><b></b></div><div class="row"><i></i><i></i><i></i><i></i><i></i><i></i></div></div>' +
        '<div class="m-promo k-hidePromos"><i></i><b></b><u></u></div>' +
      '</div>' +
      '<div class="m-watch">' +
        '<div class="w-left">' +
          '<div class="player"><div class="play"></div><div class="info-btn k-hideInfoCards"></div>' +
            '<div class="end-cards k-hideEndCards"><i></i><i></i></div>' +
            '<div class="pbar"></div><div class="ctl"><i></i><i></i><span class="autoplay"></span></div></div>' +
          '<div class="w-title"></div>' +
          '<div class="w-chan"><div class="av"></div><div class="nm"><i></i><i></i></div><div class="subbtn"></div>' +
            '<div class="acts k-hideActions"><i></i><i></i><i></i></div></div>' +
          '<div class="w-desc k-hideDescription"><i></i><i></i></div>' +
          '<div class="w-merch k-hideMerch"><i></i><i></i><i></i><b></b></div>' +
          '<div class="w-comm k-hideComments"><div class="r"><i></i><div style="flex:1"><b></b><b></b></div></div><div class="r"><i></i><div style="flex:1"><b></b><b></b></div></div></div>' +
        '</div>' +
        '<div class="w-right">' +
          '<div class="w-chat k-hideLiveChat"><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="w-list k-hidePlaylist"><i></i><i></i><i></i></div>' +
          '<div class="rel-list k-hideRelated">' + rel('c1') + rel('c4', 'mix k-hideMixes') + rel('c3') + rel('c6') + '</div>' +
        '</div>' +
      '</div>' +
    '</div>';
  stage.dataset.page = 'home';
  stage.dataset.on = '';

  // one hiding rule per switch
  var css = '';
  GROUPS.forEach(function (g) { g.keys.forEach(function (k) { css += '.stage[data-on~="' + k + '"] .k-' + k + '{display:none!important}'; }); });
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  // scale the 760x440 stage to the width of its frame
  var wrap = document.getElementById('stageWrap');
  function fit() {
    var s = wrap.clientWidth / 760;
    stage.style.transform = 'scale(' + s + ')';
    wrap.style.height = (440 * s) + 'px';
  }
  fit();
  if (window.ResizeObserver) new ResizeObserver(fit).observe(wrap); else window.addEventListener('resize', fit);

  // ---- state ---------------------------------------------------------------
  var on = {};
  function sync() {
    var list = Object.keys(on).filter(function (k) { return on[k]; });
    stage.dataset.on = list.join(' ');
    refreshPanel();
  }
  function setPage(p) { stage.dataset.page = p; refreshTabs(); }
  function pageFor(k) { return WATCH_KEYS.indexOf(k) >= 0 ? 'watch' : (k === 'hideMixes' || k === 'hideVoiceSearch' || k === 'grayThumbs' ? stage.dataset.page : 'home'); }
  function flash(k) {
    stage.querySelectorAll('.k-' + k).forEach(function (el) {
      if (el.animate) el.animate([{ opacity: 0.2 }, { opacity: 1 }], { duration: 350 });
    });
  }
  var caption = document.getElementById('demoCaption');
  function say(k) {
    caption.innerHTML = '<b></b><span></span>';
    caption.firstChild.textContent = LABEL[k];
    caption.lastChild.textContent = HINT[k];
  }
  function toggle(k, v) {
    on[k] = typeof v === 'boolean' ? v : !on[k];
    setPage(pageFor(k));
    sync();
    say(k);
    if (!on[k]) flash(k);
  }

  // ---- panel ---------------------------------------------------------------
  var panel = document.getElementById('demoPanel');
  var rows = {}, groupSw = {};
  GROUPS.forEach(function (g) {
    var box = document.createElement('div'); box.className = 'p-group';
    var head = document.createElement('div'); head.className = 'p-gh';
    head.innerHTML = '<b></b><span>Hide all</span>';
    head.firstChild.textContent = g.title;
    var gs = document.createElement('button'); gs.className = 'sw'; gs.type = 'button'; gs.setAttribute('aria-label', 'Hide all: ' + g.title);
    head.appendChild(gs); groupSw[g.id] = gs;
    gs.addEventListener('click', function () {
      stopDemo();
      var keys = g.keys.filter(function (k) { return !(g.notInAll || []).includes(k); });
      var all = keys.every(function (k) { return on[k]; });
      keys.forEach(function (k) { on[k] = !all; });
      if (g.id === 'video') setPage('watch'); else if (g.id === 'feed' || g.id === 'ui') setPage('home');
      sync();
      caption.innerHTML = '<b></b><span></span>';
      caption.firstChild.textContent = g.title + ': Hide all';
      caption.lastChild.textContent = 'Switches the whole block on or off at once.';
    });
    box.appendChild(head);
    g.keys.forEach(function (k) {
      var r = document.createElement('div'); r.className = 'p-row';
      var t = document.createElement('span'); t.textContent = LABEL[k];
      var s = document.createElement('button'); s.className = 'sw'; s.type = 'button'; s.setAttribute('aria-label', LABEL[k]);
      r.appendChild(t); r.appendChild(s); box.appendChild(r); rows[k] = { row: r, sw: s };
      r.addEventListener('mouseenter', function () { if (!demoRunning) say(k); });
      r.addEventListener('click', function () { stopDemo(); toggle(k); });
    });
    panel.appendChild(box);
  });
  function refreshPanel() {
    GROUPS.forEach(function (g) {
      g.keys.forEach(function (k) { rows[k].sw.classList.toggle('on', !!on[k]); });
      var keys = g.keys.filter(function (k) { return !(g.notInAll || []).includes(k); });
      var n = keys.filter(function (k) { return on[k]; }).length;
      groupSw[g.id].classList.toggle('on', n === keys.length);
      groupSw[g.id].classList.toggle('mid', n > 0 && n < keys.length);
    });
  }
  refreshPanel();

  // page tabs above the mock
  var tabs = document.querySelectorAll('[data-page-tab]');
  function refreshTabs() { tabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.pageTab === stage.dataset.page)); }); }
  tabs.forEach(function (b) { b.addEventListener('click', function () { setPage(b.dataset.pageTab); }); });
  refreshTabs();

  // ---- play demo -----------------------------------------------------------
  var demoRunning = false, demoToken = 0;
  var playBtn = document.getElementById('demoPlay');
  var ORDER = ['hideShorts', 'hideChips', 'hideHome', 'hidePromos', 'hideSidebarSubs', 'hideMoreFromYT', 'hideVoiceSearch', 'grayThumbs',
    'hideInfoCards', 'hideEndCards', 'hideRelated', 'hideComments', 'hideDescription', 'hideActions', 'hideMerch', 'hidePlaylist', 'hideLiveChat', 'disableAutoplay'];
  function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
  function stopDemo() { demoToken++; demoRunning = false; playBtn.textContent = '▶ Play demo'; }
  playBtn.addEventListener('click', async function () {
    if (demoRunning) { stopDemo(); return; }
    var my = ++demoToken; demoRunning = true; playBtn.textContent = '■ Stop';
    on = {}; setPage('home'); sync();
    caption.innerHTML = '<b>Watch it work</b><span>One switch at a time, starting from YouTube as it normally looks.</span>';
    await wait(1400);
    for (var i = 0; i < ORDER.length; i++) {
      if (my !== demoToken) return;
      toggle(ORDER[i], true);
      await wait(1500);
    }
    if (my !== demoToken) return;
    caption.innerHTML = '<b>That is the whole “Maximum” idea</b><span>Every switch is separate, so you keep only what you want. “Hide all” does a whole block in one click.</span>';
    await wait(2400);
    if (my !== demoToken) return;
    on = {}; setPage('home'); sync();
    stopDemo();
  });

  // ---- picture gallery ------------------------------------------------------
  var pics = document.getElementById('pics');
  var gtabs = document.querySelectorAll('[data-gtab]');
  function renderGallery(id) {
    var g = GROUPS.filter(function (x) { return x.id === id; })[0];
    var keys = g.keys.concat(GALLERY_EXTRA[id] || []);
    pics.innerHTML = '';
    keys.forEach(function (k) {
      var d = document.createElement('div'); d.className = 'pic';
      var im = document.createElement('img'); im.src = 'img/hints/' + k + '.jpg'; im.alt = LABEL[k] + ': the hidden part is outlined in red'; im.loading = 'lazy'; im.width = 648; im.height = 365;
      var t = document.createElement('div');
      var h = document.createElement('h4'); h.textContent = LABEL[k];
      var p = document.createElement('p'); p.textContent = HINT[k];
      t.appendChild(h); t.appendChild(p); d.appendChild(im); d.appendChild(t); pics.appendChild(d);
    });
    gtabs.forEach(function (b) { b.setAttribute('aria-selected', String(b.dataset.gtab === id)); });
  }
  gtabs.forEach(function (b) { b.addEventListener('click', function () { renderGallery(b.dataset.gtab); }); });
  renderGallery('feed');
})();
