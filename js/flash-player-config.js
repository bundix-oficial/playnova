/* Only Ruffle itself is trusted JavaScript. SWFs cannot call page scripts or open URLs. */
window.RufflePlayer = window.RufflePlayer || {};
window.RufflePlayer.config = {
  autoplay: 'off',
  unmuteOverlay: 'visible',
  letterbox: 'on',
  allowScriptAccess: false,
  allowNetworking: 'none',
  openUrlMode: 'deny',
  backgroundExecutionMode: 'none',
  showSwfDownload: false,
  contextMenu: 'on',
  quality: (() => {
    try { return window.parent.FrivPerformance?.light ? 'low' : 'high'; }
    catch { return 'high'; }
  })()
};
