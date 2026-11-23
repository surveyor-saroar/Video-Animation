const TOTAL_DURATION = 48000;
let startTime = null;
let triggeredEvents = new Set();
let animFrameId = null;

function el(id) {
    return document.getElementById(id);
}

function addShowClass(id) {
    const node = el(id);
    if (node) node.classList.add('show-up');
}

function removeClass(id, className) {
    const node = el(id);
    if (node) node.classList.remove(className);
}

function addClass(id, className) {
    const node = el(id);
    if (node) node.classList.add(className);
}

function showScene(sceneNum) {
    document.querySelectorAll('.scene').forEach((s) => s.classList.remove('active'));
    if (sceneNum) {
        const target = el(`scene-${sceneNum}`);
        if (target) target.classList.add('active');
    }
}

function triggerWipe() {
    const wipe = el('wipe-overlay');
    if (!wipe) return;
    wipe.classList.remove('wipe-animate');
    void wipe.offsetWidth;
    wipe.classList.add('wipe-animate');
}

const timeline = [
    { t: 0,     fn: () => { showScene(1); addShowClass('s1-hello'); addShowClass('s1-orbit'); } },
    { t: 800,   fn: () => addShowClass('s1-name') },
    { t: 1600,  fn: () => addShowClass('s1-b1') },
    { t: 2300,  fn: () => addShowClass('s1-b2') },
    { t: 3000,  fn: () => addShowClass('s1-b3') },
    { t: 4100,  fn: () => triggerWipe() },

    { t: 4600,  fn: () => { showScene(2); addShowClass('s2-c1'); } },
    { t: 6800,  fn: () => addShowClass('s2-c2') },
    { t: 9500,  fn: () => { addShowClass('s2-arrow'); addShowClass('s2-t1'); addClass('s2-t1', 'highlight'); } },
    { t: 10800, fn: () => { removeClass('s2-t1', 'highlight'); addShowClass('s2-t2'); addClass('s2-t2', 'highlight'); } },
    { t: 12000, fn: () => { removeClass('s2-t2', 'highlight'); addShowClass('s2-t3'); addClass('s2-t3', 'highlight'); } },
    { t: 13500, fn: () => removeClass('s2-t3', 'highlight') },

    { t: 15500, fn: () => { showScene(3); addShowClass('s3-gd'); addShowClass('s3-l1'); addShowClass('s3-q'); } },
    { t: 16800, fn: () => { addShowClass('s3-l2'); addShowClass('s3-ve'); } },
    { t: 17800, fn: () => addShowClass('s3-top') },

    { t: 20000, fn: () => showScene(4) },
    { t: 20600, fn: () => addShowClass('s4-sub') },
    { t: 21500, fn: () => addShowClass('s4-title') },
    { t: 22600, fn: () => addShowClass('s4-phone') },
    { t: 24200, fn: () => addShowClass('s4-brand') },

    { t: 26500, fn: () => { showScene(5); addShowClass('s5-head'); } },
    { t: 28500, fn: () => addShowClass('s5-gd') },
    { t: 29800, fn: () => addShowClass('s5-ve') },
    { t: 31200, fn: () => addShowClass('s5-ai') },
    { t: 33200, fn: () => addShowClass('s5-tech') },
    { t: 34500, fn: () => addShowClass('s5-more') },
    { t: 36000, fn: () => triggerWipe() },

    { t: 36500, fn: () => { showScene(6); addShowClass('s6-phone'); addShowClass('s6-title'); } },
    { t: 38500, fn: () => addShowClass('s6-c1') },
    { t: 39800, fn: () => addShowClass('s6-c2') },
    { t: 41000, fn: () => triggerWipe() },

    { t: 41600, fn: () => { showScene(7); addShowClass('s7-head'); addShowClass('s7-bar'); } },
    { t: 43000, fn: () => {
        const btn = el('s7-fbtn');
        if (btn) {
            btn.classList.add('following');
            btn.textContent = '✓ Following';
        }
    }},
    { t: 44200, fn: () => addShowClass('s7-cbox') },
    { t: 46200, fn: () => addShowClass('s7-cta') }
];

function resetAll() {
    triggeredEvents.clear();
    document.querySelectorAll('.show-up').forEach((node) => node.classList.remove('show-up'));
    const btn = el('s7-fbtn');
    if (btn) {
        btn.classList.remove('following');
        btn.textContent = 'Follow';
    }
    startTime = performance.now();
}

function updateLoop(now) {
    if (!startTime) startTime = now;
    const elapsed = now - startTime;

    timeline.forEach((item, idx) => {
        if (elapsed >= item.t && !triggeredEvents.has(idx)) {
            triggeredEvents.add(idx);
            item.fn();
        }
    });

    const clamped = Math.min(elapsed, TOTAL_DURATION);
    const progressLine = el('progress-line');
    if (progressLine) progressLine.style.width = `${(clamped / TOTAL_DURATION) * 100}%`;

    const timeDisplay = el('time-display');
    if (timeDisplay) {
        const sec = Math.floor(clamped / 1000);
        timeDisplay.textContent = `00:${sec.toString().padStart(2, '0')} / 00:48`;
    }

    if (elapsed < TOTAL_DURATION) {
        animFrameId = requestAnimationFrame(updateLoop);
    }
}

function startAnimation() {
    if (animFrameId) cancelAnimationFrame(animFrameId);
    resetAll();
    animFrameId = requestAnimationFrame(updateLoop);
}

const replayBtn = el('replay-btn');
if (replayBtn) replayBtn.addEventListener('click', startAnimation);

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startAnimation);
} else {
    startAnimation();
}