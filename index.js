// Properties
const N = 200;

const number = document.getElementById("number");
const selector = document.getElementById("selector");
const clear_history = document.getElementById("clear_history");
const list_history = document.getElementById("list_history");
const histories = document.getElementById("histories");

const mt = new MersenneTwister();

const easing = (x) => {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}

const drawn = [];
const Chusen = () => {
    let rand = mt.nextInt(1, N + 1);
    while(drawn.some(e => e == rand)) {
        rand = mt.nextInt(1, N + 1);
    }
    number.textContent = rand;
};

// アニメーション
let animationId = null;

const renderLoop = () => {
    Chusen();
    animationId = requestAnimationFrame(renderLoop);
};

const isPaused = () => {
    return animationId === null;
};

const roll = () => {
    if (drawn.length < N) {
        selector.textContent = "ストップ！";
        mt.setSeed(Math.floor(Math.random() * (2 << 32)));
        renderLoop();
    } else {
        number.textContent = "終わり";
    }
};

const pause = () => {
    selector.textContent = "抽選";
    cancelAnimationFrame(animationId);
    animationId = null;
    drawn.push(parseInt(number.textContent));
    drawn.sort((a, b) => a < b ? -1 : 1);
    if (historyShowing) histories.textContent = drawn.toString();
};

// ヒストリー
let historyShowing = false;

const listHistory = () => {
    if (!historyShowing) {
        histories.textContent = drawn.toString();
        historyShowing = true;
    } else {
        histories.textContent = "";
        historyShowing = false;
    }
};

const clearHistory = () => {
    drawn.splice(0);
    if (historyShowing) histories.textContent = drawn.toString();
};


// DOMにイベント追加
selector.addEventListener("click", event => {
    if (isPaused()) {
        roll();
    } else {
        pause();
    }
});

list_history.addEventListener("click", event => {
    listHistory();
});

clear_history.addEventListener("click", event => {
    clearHistory();
    number.textContent = "Start";
});

