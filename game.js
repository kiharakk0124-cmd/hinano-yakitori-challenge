window.yakitoriGame = {

    start: function (dotNetHelper) {

        console.log("yakitoriGame.start 開始");

        const yakitori = document.querySelector(".game-area .yakitori-image");
        const target = document.querySelector(".game-area .character-area");

        console.log("焼き鳥:", yakitori);
        console.log("キャラクター:", target);

        if (!yakitori || !target) {
            console.error("焼き鳥またはキャラクターが見つかりません");
            return;
        }

        // 二重登録防止
        if (yakitori.dataset.dragInitialized === "true") {
            console.log("ドラッグ処理は既に設定されています");
            return;
        }

        yakitori.dataset.dragInitialized = "true";

        let dragging = false;

        let offsetX = 0;
        let offsetY = 0;

        // =========================================
        // ドラッグ開始
        // =========================================

        function startDrag(event) {

            event.preventDefault();

            dragging = true;

            const rect = yakitori.getBoundingClientRect();

            const clientX =
                event.clientX !== undefined
                    ? event.clientX
                    : event.touches[0].clientX;

            const clientY =
                event.clientY !== undefined
                    ? event.clientY
                    : event.touches[0].clientY;

            offsetX = clientX - rect.left;
            offsetY = clientY - rect.top;

            yakitori.style.cursor = "grabbing";
            yakitori.style.zIndex = "1000";

            console.log("焼き鳥ドラッグ開始");
        }


        // =========================================
        // ドラッグ中
        // =========================================

        function moveDrag(event) {

            if (!dragging) {
                return;
            }

            event.preventDefault();

            const gameRect =
                document.querySelector(".game-area").getBoundingClientRect();

            const clientX =
                event.clientX !== undefined
                    ? event.clientX
                    : event.touches[0].clientX;

            const clientY =
                event.clientY !== undefined
                    ? event.clientY
                    : event.touches[0].clientY;


            // ゲームエリア内での座標に変換
            let left =
                clientX -
                gameRect.left -
                offsetX;

            let top =
                clientY -
                gameRect.top -
                offsetY;


            // ゲームエリアから完全にはみ出さないようにする
            const maxLeft =
                gameRect.width -
                yakitori.offsetWidth;

            const maxTop =
                gameRect.height -
                yakitori.offsetHeight;


            left = Math.max(0, Math.min(left, maxLeft));
            top = Math.max(0, Math.min(top, maxTop));


            yakitori.style.left = left + "px";
            yakitori.style.top = top + "px";
        }


        // =========================================
        // ドラッグ終了
        // =========================================

        function endDrag() {

            if (!dragging) {
                return;
            }

            dragging = false;

            yakitori.style.cursor = "grab";

            console.log("焼き鳥ドラッグ終了");

            checkDrop();
        }


        // =========================================
        // ドロップ判定
        // =========================================

        function checkDrop() {

            const yakitoriRect =
                yakitori.getBoundingClientRect();

            const targetRect =
                target.getBoundingClientRect();


            // 少し判定を甘くする
            const margin = 25;


            const isOverlap =
                yakitoriRect.right > targetRect.left - margin &&
                yakitoriRect.left < targetRect.right + margin &&
                yakitoriRect.bottom > targetRect.top - margin &&
                yakitoriRect.top < targetRect.bottom + margin;


            if (isOverlap) {

                console.log("焼き鳥がキャラクターに届きました！");

                if (dotNetHelper) {

                    dotNetHelper.invokeMethodAsync(
                        "CheckAnswer"
                    );
                }

            }
            else {

                console.log("キャラクターに届きませんでした");

                resetYakitori();
            }
        }


        // =========================================
        // 元の位置へ戻す
        // =========================================

        function resetYakitori() {

            yakitori.style.left = "35px";
            yakitori.style.top = "35px";
            yakitori.style.zIndex = "100";

            console.log("焼き鳥を初期位置へ戻しました");
        }


        // =========================================
        // マウス
        // =========================================

        yakitori.addEventListener(
            "mousedown",
            startDrag
        );

        document.addEventListener(
            "mousemove",
            moveDrag,
            { passive: false }
        );

        document.addEventListener(
            "mouseup",
            endDrag
        );


        // =========================================
        // スマートフォン
        // =========================================

        yakitori.addEventListener(
            "touchstart",
            startDrag,
            { passive: false }
        );

        document.addEventListener(
            "touchmove",
            moveDrag,
            { passive: false }
        );

        document.addEventListener(
            "touchend",
            endDrag
        );


        // =========================================
        // 初期設定
        // =========================================

        yakitori.style.position = "absolute";
        yakitori.style.left = "35px";
        yakitori.style.top = "35px";
        yakitori.style.zIndex = "100";
        yakitori.style.cursor = "grab";
        yakitori.style.touchAction = "none";
        yakitori.style.userSelect = "none";
        yakitori.draggable = false;

        console.log("焼き鳥ドラッグ処理の設定完了");
    },


    getHighScore: function () {

        const score =
            localStorage.getItem(
                "hinanoYakitoriHighScore"
            );

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