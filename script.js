(function () {
    const TOTAL_MS = 48000;
    const STEP_MS = 50;

    let currentMs = 0;
    let intervalId = null;
    let firedSet = new Set();

    const byId = (id) => document.getElementById(id);

    function showItem(id) {
        const node = byId(id);
        if (node) node.classList.add('show-up');
    }

    function setHighlight(id, active) {
        const node = byId(id);
        if (!node) return;
        if (active) {
            node.classList.add('highlight');
        } else {
            node.classList.remove('highlight');
        }
    }

    function activateScene(num) {
        document.querySelectorAll('.scene').forEach((scene) => {
            scene.classList.remove('active');
        });
        const target = byId(`scene-${num}`);
        if (target) target.classList.add('active');
    }

    function playWipe() {
        const wipe = byId('wipe-overlay');
        if (!wipe) return;
        wipe.classList.remove('wipe-animate');
        void wipe.offsetWidth;
        wipe.classList.add('wipe-animate');
    }

    const cues = [
        { at: 0,     run: () => { activateScene(1); showItem('s1-hello'); showItem('s1-orbit'); } },
        { at: 800,   run: () => showItem('s1-name') },
        { at: 1600,  run: () => showItem('s1-b1') },
        { at: 2300,  run: () => showItem('s1-b2') },
        { at: 3000,  run: () => showItem('s1-b3') },
        { at: 4100,  run: () => playWipe() },

        { at: 4600,  run: () => { activateScene(2); showItem('s2-c1'); } },
        { at: 6800,  run: () => showItem('s2-c2') },
        { at: 9500,  run: () => { showItem('s2-arrow'); showItem('s2-t1'); setHighlight('s2-t1', true); } },
        { at: 10800, run: () => { setHighlight('s2-t1', false); showItem('s2-t2'); setHighlight('s2-t2', true); } },
        { at: 12000, run: () => { setHighlight('s2-t2', false); showItem('s2-t3'); setHighlight('s2-t3', true); } },
        { at: 13500, run: () => setHighlight('s2-t3', false) },

        { at: 15500, run: () => { activateScene(3); showItem('s3-gd'); showItem('s3-l1'); showItem('s3-q'); } },
        { at: 16800, run: () => { showItem('s3-l2'); showItem('s3-ve'); } },
        { at: 17800, run: () => showItem('s3-top') },

        { at: 20000, run: () => activateScene(4) },
        { at: 20600, run: () => showItem('s4-sub') },
        { at: 21500, run: () => showItem('s4-title') },
        { at: 22600, run: () => showItem('s4-phone') },
        { at: 24200, run: () => showItem('s4-brand') },

        { at: 26500, run: () => { activateScene(5); showItem('s5-head'); } },
        { at: 28500, run: () => showItem('s5-gd') },
        { at: 29800, run: () => showItem('s5-ve') },
        { at: 31200, run: () => showItem('s5-ai') },
        { at: 33200, run: () => showItem('s5-tech') },
        { at: 34500, run: () => showItem('s5-more') },
        { at: 36000, run: () => playWipe() },

        { at: 36500, run: () => { activateScene(6); showItem('s6-phone'); showItem('s6-title'); } },
        { at: 38500, run: () => showItem('s6-c1') },
        { at: 39800, run: () => showItem('s6-c2') },
        { at: 41000, run: () => playWipe() },

        { at: 41600, run: () => { activateScene(7); showItem('s7-head'); showItem('s7-bar'); } },
        { at: 43000, run: () => {
            const btn = byId('s7-fbtn');
            if (btn) {
                btn.classList.add('following');
                btn.textContent = '✓ Following';
            }
        } },
        { at: 44200, run: () => showItem('s7-cbox') },
        { at: 46200, run: () => showItem('s7-cta') }
    ];

    function renderBar() {
        const clamped = Math.min(currentMs, TOTAL_MS);
        const bar = byId('progress-line');
        if (bar) {
            bar.style.width = `${(clamped / TOTAL_MS) * 100}%`;
        }
        const label = byId('time-display');
        if (label) {
            const sec = Math.floor(clamped / 1000);
            label.textContent = `00:${String(sec).padStart(2, '0')} / 00:48`;
        }
    }

    function resetState() {
        currentMs = 0;
        firedSet.clear();

        document.querySelectorAll('.show-up').forEach((el) => el.classList.remove('show-up'));
        document.querySelectorAll('.topic-pill.highlight').forEach((el) => el.classList.remove('highlight'));

        const btn = byId('s7-fbtn');
        if (btn) {
            btn.classList.remove('following');
            btn.textContent = 'Follow';
        }

        renderBar();
    }

    function stepTimeline() {
        cues.forEach((cue, index) => {
            if (currentMs >= cue.at && !firedSet.has(index)) {
                firedSet.add(index);
                cue.run();
            }
        });

        renderBar();

        if (currentMs >= TOTAL_MS) {
            clearInterval(intervalId);
            intervalId = null;
            return;
        }

        currentMs += STEP_MS;
    }

    function start() {
        if (intervalId) {
            clearInterval(intervalId);
        }
        resetState();
        stepTimeline();
        intervalId = setInterval(stepTimeline, STEP_MS);
    }

    function boot() {
        const replay = byId('replay-btn');
        if (replay) {
            replay.addEventListener('click', start);
        }
        start();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', boot);
    } else {
        boot();
    }
})();
