u.on(window, 'load', function() {
    'use strict';
    document.querySelector('#pNet')['u.Progress'].setProgress(60);
    document.querySelector('#pCPU')['u.Progress'].setProgress(69);

    document.querySelector('#pMemory')['u.Progress'].setProgress(36);
    document.querySelector('#pStorage')['u.Progress'].setProgress(32);
    document.querySelector('#pTask')['u.Progress'].setProgress(55);
    document.querySelector('#pLayout')['u.Progress'].setProgress(23);

    document.querySelector('#pCluster')['u.Progress'].setProgress(50);
    document.querySelector('#pMaster')['u.Progress'].setProgress(39);

});