/*
 * Dean dashboard routing fix.
 * The official Dean dashboard is qms-no-login.html.
 * It opens in the application's main frame when available.
 */
(function () {
  'use strict';

  const DEAN_PAGE_URL = './qms-no-login.html';

  function openDeanDashboard() {
    const frame = document.querySelector('#main-frame, #main-content iframe, iframe[data-main-frame]');
    if (frame) {
      frame.src = DEAN_PAGE_URL;
      frame.removeAttribute('hidden');
      return frame;
    }

    const main = document.querySelector('#main-content, #main-frame, main');
    if (main) {
      main.innerHTML = '<iframe title="Dean Dashboard" src="' + DEAN_PAGE_URL + '" style="width:100%;min-height:calc(100vh - 120px);border:0;display:block" loading="eager"></iframe>';
      return main.querySelector('iframe');
    }

    window.location.href = DEAN_PAGE_URL;
    return null;
  }

  window.QMS_DEAN_PAGE_URL = DEAN_PAGE_URL;
  window.openDeanDashboard = openDeanDashboard;

  if (typeof window.mountDeanDashboard === 'function') {
    window.mountDeanDashboard = openDeanDashboard;
  }
})();
