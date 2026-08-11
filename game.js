window.yakitoriGame = {

    start: function (dotNetHelper) {

        const yakitori = document.querySelector(".yakitori-image");
        const target = document.querySelector(".hinano-area");

        if (!yakitori || !target) {
            console.log("画像が見つかりません");
            return;
        }

        // すでにイベントが設定されていた場合は何もしない
        if (yakitori.dataset.dragReady === "true") {
            console.log("ドラッグ処理は設定済みです");
            return;
        }

        yakitori.dataset.dragReady = "true";

        let dragging = false;

        function moveImage(x, y) {

            yakitori.style.position = "fixed";
            yakitori.style.zIndex = "9999";
            yakitori.style.pointerEvents = "none";

            yakitori.style.left =
                (x - yakitori.offsetWidth / 2) + "px";

            yakitori.style.top =
                (y - yakitori.offsetHeight / 2) + "px";
        }

        function resetImage() {

            yakitori.style.position = "absolute";
            yakitori.style.left = "20px";
            yakitori.style.top = "20px";
            yakitori.style.zIndex = "10";
            yakitori.style.pointerEvents = "auto";
        }

        function checkDrop(x, y) {

            const rect = target.getBoundingClientRect();

            const margin = 30;

            const targetLeft = rect.left - margin;
            const targetRight = rect.right + margin;
            const targetTop = rect.top - margin;
            const targetBottom = rect.bottom + margin;

            const inside =
                x >= targetLeft &&
                x <= targetRight &&
                y >= targetTop &&
                y <= targetBottom;

            if (inside) {

    console.log("ひなのんに焼き鳥を届けました！");

    alert("ひなのんに焼き鳥を届けました！");

    dotNetHelper.invokeMethodAsync(
        "CheckAnswer"
    );
}

            resetImage();
        }

        // =========================
        // PC
        // =========================

        yakitori.addEventListener("mousedown", function (event) {

            dragging = true;

            moveImage(
                event.clientX,
                event.clientY
            );

            event.preventDefault();

        });

        document.addEventListener("mousemove", function (event) {

            if (!dragging) {
                return;
            }

            moveImage(
                event.clientX,
                event.clientY
            );

        });

        document.addEventListener("mouseup", function (event) {

            if (!dragging) {
                return;
            }

            dragging = false;

            checkDrop(
                event.clientX,
                event.clientY
            );

        });

        // =========================
        // スマホ
        // =========================

        yakitori.addEventListener("touchstart", function (event) {

            dragging = true;

            const touch = event.touches[0];

            moveImage(
                touch.clientX,
                touch.clientY
            );

            event.preventDefault();

        }, { passive: false });

        document.addEventListener("touchmove", function (event) {

            if (!dragging) {
                return;
            }

            const touch = event.touches[0];

            moveImage(
                touch.clientX,
                touch.clientY
            );

            event.preventDefault();

        }, { passive: false });

        document.addEventListener("touchend", function (event) {

            if (!dragging) {
                return;
            }

            dragging = false;

            const touch = event.changedTouches[0];

            checkDrop(
                touch.clientX,
                touch.clientY
            );

        });

    },
    getHighScore: function () {

        const score =
            localStorage.getItem("hinanoYakitoriHighScore");

        if (score === null) {
            return 0;
        }

        return parseInt(score);
    },

    saveHighScore: function (score) {

        localStorage.setItem(
            "hinanoYakitoriHighScore",
            score
        );
    }
};