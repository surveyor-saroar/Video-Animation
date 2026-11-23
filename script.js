window.addEventListener("DOMContentLoaded", function () {
    const stage = document.getElementById("stage");
    if (stage) {
        const msg = document.createElement("div");
        msg.textContent = "JS WORKING OK!";
        msg.style.cssText = "position:fixed;top:20px;left:20px;z-index:9999;background:#ff6a00;color:#000;padding:10px 18px;font-weight:700;border-radius:8px;";
        stage.appendChild(msg);
    }
});
