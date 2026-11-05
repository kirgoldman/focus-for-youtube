// Shared mock YouTube page, the switch list and the texts. Used by the hero, the before/after slider and the playground.
window.YTFMock = (function () {
  var GROUPS = [
    { id: 'feed', title: 'Feed and Shorts', keys: ['hideShorts', 'hideHome', 'hideChips', 'hideMixes'] },
    { id: 'video', title: 'Video page', keys: ['hideRelated', 'hideComments', 'hideDescription', 'hideActions', 'hideEndCards', 'hideInfoCards', 'hideLiveChat', 'hidePlaylist', 'hideMerch', 'disableAutoplay'] },
    { id: 'ui', title: 'Interface', keys: ['hideSidebarSubs', 'hideMoreFromYT', 'hideSidebar', 'hideVoiceSearch', 'hidePromos', 'grayThumbs'], notInAll: ['hideSidebar'] },
  ];
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

  function vc(cls, extra) {
    return '<div class="vc ' + (extra || '') + '"><div class="thumb ' + cls + '"></div><div class="l1"></div><div class="l2"></div></div>';
  }
  function rel(cls, extra) {
    return '<div class="rel ' + (extra || '') + '"><div class="thumb ' + cls + '"></div><div class="t"><div class="l1"></div><div class="l2"></div></div></div>';
  }
  function side(n, dot) {
    var h = '';
    for (var i = 0; i < n; i++) h += '<div class="si' + (dot ? ' dot' : '') + '"><i></i><b></b></div>';
    return h;
  }

  function build(stage) {
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
          '<div class="sec k-hideSidebarSubs"><div class="h"></div>' + side(4, true) + '</div>' +
          '<div class="sec k-hideMoreFromYT"><div class="h"></div>' + side(2) + '</div>' +
          '<div class="sec k-hideMoreFromYT"><div class="h"></div>' + side(3) + '</div>' +
        '</div>' +
        '<div class="m-main m-home">' +
          '<div class="m-chips k-hideChips"><i></i><i></i><i></i><i></i><i></i><i></i></div>' +
          '<div class="m-grid k-hideHome">' + vc('c1') + vc('c2') + vc('c3') + vc('c4') + vc('c5', 'mix k-hideMixes') + vc('c6') + '</div>' +
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
  }

  // one hiding rule per switch, for stages that use the data-on attribute
  var cssDone = false;
  function injectCss() {
    if (cssDone) return; cssDone = true;
    var css = '';
    GROUPS.forEach(function (g) { g.keys.forEach(function (k) { css += '.stage[data-on~="' + k + '"] .k-' + k + '{display:none!important}'; }); });
    var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
  }

  // fit a fixed-size layer (w x h) into the width of its frame
  function fit(frame, layer, w, h) {
    function go() {
      var s = frame.clientWidth / w;
      layer.style.transform = 'scale(' + s + ')';
      frame.style.height = (h * s) + 'px';
      return s;
    }
    go();
    if (window.ResizeObserver) new ResizeObserver(go).observe(frame); else window.addEventListener('resize', go);
    return go;
  }

  return { GROUPS: GROUPS, LABEL: LABEL, HINT: HINT, WATCH_KEYS: WATCH_KEYS, build: build, injectCss: injectCss, fit: fit };
})();
