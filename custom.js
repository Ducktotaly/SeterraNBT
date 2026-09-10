const areaList = document.querySelector('[data-qa="area-list"]');

let timerInterval = null;
let secondsElapsed = 0;

const startBtn = document.getElementById('startBtn')
startBtn.addEventListener("click", () => {startGame()})

const ids = areaList.dataset.areaIds.split(',');
const labels = areaList.dataset.areaLabels.split(',');

const countries = ids.map((id, index) => ({
    id: id,
    label: labels[index]
}));

const cities = document.querySelectorAll('[data-qa^="CITY_"]');


// ==========================
// ФЛАГИ
// ==========================

const flagCodes = {
    CITY_AMSTERDAM: "nl",
    CITY_ANDORRALAVELLA: "ad",
    CITY_ATHENS: "gr",
    CITY_BELGRADE: "rs",
    CITY_BERLIN: "de",
    CITY_BERN: "ch",
    CITY_BRATISLAVA: "sk",
    CITY_BRUSSELS: "be",
    CITY_BUCHAREST: "ro",
    CITY_BUDAPEST: "hu",
    CITY_CHISINAU: "md",
    CITY_COPENHAGEN: "dk",
    CITY_DUBLIN: "ie",
    CITY_HELSINKI: "fi",
    CITY_KIEV: "ua",
    CITY_LISBON: "pt",
    CITY_LJUBLJANA: "si",
    CITY_LONDON: "gb",
    CITY_LUXEMBURG: "lu",
    CITY_MADRID: "es",
    CITY_MINSK: "by",
    CITY_MONACO: "mc",
    CITY_MOSCOW: "ru",
    CITY_NICOSIA: "cy",
    CITY_OSLO: "no",
    CITY_PARIS: "fr",
    CITY_PODGORICA: "me",
    CITY_PRAGUE: "cz",
    CITY_PRISTINA: "xk",
    CITY_REYKJAVIK: "is",
    CITY_RIGA: "lv",
    CITY_ROME: "it",
    CITY_SANMARINO: "sm",
    CITY_SARAJEVO: "ba",
    CITY_SKOPJE: "mk",
    CITY_SOFIA: "bg",
    CITY_STOCKHOLM: "se",
    CITY_TALLINN: "ee",
    CITY_TIRANE: "al",
    CITY_VADUZ: "li",
    CITY_VALLETTA: "mt",
    CITY_VIENNA: "at",
    CITY_VILNIUS: "lt",
    CITY_WARSAW: "pl",
    CITY_ZAGREB: "hr"
};


// ==========================
// UI
// ==========================

const questionLabel = document.querySelector(
    '.game-header_pinQuestionTextBackground__sBJKI label'
);

const flagImage = document.querySelector(
    '.game-header_topRightImage__N1wKi'
);


// ==========================
// СОСТОЯНИЕ ИГРЫ
// ==========================

let currentQuestion = null;

// Здесь хранятся столицы, которые ещё НЕ были показаны
let availableCountries = [...countries];


// ==========================
// НОВЫЙ ВОПРОС
// ==========================

function startGame() {
    const startUi = document.getElementById('startgameui')
    startUi.classList.add('hideStart')
    startTimer(); 
}

function showResults(time) {
    const modal = document.getElementById('modalResults');

    const resTimeEl = document.getElementById('res-time');
    if (resTimeEl) {
        resTimeEl.innerText = time;
    }

    // Показываем окно
    modal.classList.remove('modal_hidden');
    modal.style.display = 'flex';
}

// Повесь события на кнопки
document.getElementById('btn-play-again')?.addEventListener('click', () => {
    document.getElementById('score-modal').style.display = 'none';
    // Вызов твоей функции рестарта игры
    restartGame(); 
});

document.getElementById('btn-close-modal')?.addEventListener('click', () => {
    document.getElementById('score-modal').style.display = 'none';
});


chosenCountries = document.getElementById('chosen')
function nextQuestion() {

    // Если вопросов больше нет
    if (availableCountries.length === 0) {
        const finalTimeStr = stopTimer();
        chosenCountries.innerText = `45 / 45`
        showResults(finalTimeStr);
        return;
    }


    // Берём случайную столицу
    const randomIndex = Math.floor(
        Math.random() * availableCountries.length
    );

    currentQuestion =
        availableCountries[randomIndex];


    // Удаляем её из списка доступных
    // Поэтому второй раз она уже никогда не выпадет
    availableCountries.splice(randomIndex, 1);


    // Название столицы
    questionLabel.textContent =
        currentQuestion.label;


    // Флаг
    const flagCode =
        flagCodes[currentQuestion.id];

    if (flagCode && flagImage) {

        flagImage.src =
            `./flags/${flagCode}.svg`;
    }


    console.log(
        "🎯 Нужно найти:",
        currentQuestion.label,
        currentQuestion.id
    );

    console.log(
        "Осталось:",
        availableCountries.length
    );

    chosenCountries.innerText = `${44-availableCountries.length} / 45`
}


function addCheatMarker(city) {
    const hitboxDot = city.querySelector(
        '[data-type="hitbox-dot"]'
    );

    if (!hitboxDot) return;

    const cx = hitboxDot.getAttribute("cx");
    const cy = hitboxDot.getAttribute("cy");

    if (city.querySelector(".custom-cheat-marker")) {
        return;
    }

    const markerGroup = document.createElementNS(
        SVG_NS,
        "g"
    );

    markerGroup.classList.add("custom-cheat-marker");
    markerGroup.style.pointerEvents = "none";

    const whiteCircle = document.createElementNS(
        SVG_NS,
        "circle"
    );

    whiteCircle.setAttribute("cx", cx);
    whiteCircle.setAttribute("cy", cy);
    whiteCircle.setAttribute("r", "6");
    whiteCircle.setAttribute(
        "class",
        "hitbox-dot_dot__laacR hitbox-dot_colorWhite__qyuwK"
    );

    const blackCircle = document.createElementNS(
        SVG_NS,
        "circle"
    );

    blackCircle.setAttribute("cx", cx);
    blackCircle.setAttribute("cy", cy);
    blackCircle.setAttribute("r", "3");
    blackCircle.setAttribute(
        "class",
        "hitbox-dot_centerDot__U_nYl"
    );

    markerGroup.appendChild(whiteCircle);
    markerGroup.appendChild(blackCircle);

    city.appendChild(markerGroup);
}

// ==========================
// КОНЕЦ ИГРЫ
// ==========================

function finishGame() {

    currentQuestion = null;

    questionLabel.textContent = "Completed!";

    if (flagImage) {
        flagImage.style.display = "none";
    }


    console.log("🎉 Игра закончена!");
}


function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    
    // Добавляем ведущие нули через padStart
    const padM = String(minutes).padStart(2, '0');
    const padS = String(seconds).padStart(2, '0');
    
    return `${padM}:${padS}`;
}

// Запуск таймера при старте игры
function startTimer() {
    // Сбрасываем старый интервал, если был
    clearInterval(timerInterval);
    secondsElapsed = 0;
    
    // Каждую секунду прибавляем 1
    timerInterval = setInterval(() => {
        secondsElapsed++;
        
        // Опционально: если на странице есть элемент с тикающим временем во время игры
        const currentTimeEl = document.getElementById('inGameTime');
        if (currentTimeEl) {
            currentTimeEl.innerText = formatTime(secondsElapsed);
        }
    }, 1000);
}

// Остановка таймера при победе/завершении
function stopTimer() {
    clearInterval(timerInterval);
    return formatTime(secondsElapsed); // Возвращает готовую строку, например "01:42"
}

// ==========================
// SCORE MODAL
// ==========================

function showScoreModal() { //deprecated

    // Если модалка уже существует, не создаём вторую
    if (document.querySelector('[data-qa="score-modal"]')) {
        return;
    }


    // Затемнение фона
    const overlay = document.createElement("div");

    overlay.className =
        "custom-score-overlay";


    // Само окно
    const modal = document.createElement("div");

    modal.className =
        "custom-score-modal";

    modal.setAttribute(
        "data-qa",
        "score-modal"
    );


    // Заголовок
    const title = document.createElement("div");

    title.className =
        "custom-score-title";

    title.textContent =
        "Well done!";


    // Результат
    const result = document.createElement("div");

    result.className =
        "custom-score-result";

    result.textContent =
        "You found all 44 capitals!";


    // Игра
    const gameName = document.createElement("div");

    gameName.className =
        "custom-score-game";

    gameName.textContent =
        "Europe: Capitals";


    // Кнопка Play again
    const playAgain = document.createElement("button");

    playAgain.className =
        "custom-score-button";

    playAgain.textContent =
        "Play again";


    playAgain.addEventListener("click", () => {

        // Убираем модалку
        overlay.remove();

        // Возвращаем флаг
        if (flagImage) {
            flagImage.style.display = "";
        }


        // Сбрасываем найденные города
        cities.forEach(city => {
            city.classList.remove("answered");
        });


        // Восстанавливаем все вопросы
        availableCountries = [...countries];


        // Новый вопрос
        nextQuestion();
    });


    // Кнопка закрытия
    const closeButton = document.createElement("button");

    closeButton.className =
        "custom-score-close";

    closeButton.textContent =
        "×";


    closeButton.addEventListener("click", () => {
        overlay.remove();
    });


    // Собираем модалку
    modal.appendChild(closeButton);
    modal.appendChild(title);
    modal.appendChild(result);
    modal.appendChild(gameName);
    modal.appendChild(playAgain);

    overlay.appendChild(modal);

    document.body.appendChild(overlay);
}


// ==========================
// HOVER CIRCLE
// ==========================

const SVG_NS = "http://www.w3.org/2000/svg";

const hoverCircle =
    document.createElementNS(SVG_NS, "circle");

hoverCircle.setAttribute("r", "12");
hoverCircle.setAttribute("fill", "none");
hoverCircle.setAttribute("stroke", "white");
hoverCircle.setAttribute("stroke-width", "2");

hoverCircle.style.pointerEvents = "none";
hoverCircle.style.display = "none";


const svg = cities[0]?.ownerSVGElement;

if (svg) {
    svg.appendChild(hoverCircle);
}


// ==========================
// ГОРОДА
// ==========================

cities.forEach(city => {

    const hitboxDot = city.querySelector(
        '[data-type="hitbox-dot"]'
    );


    // ---------- HOVER ----------

    city.addEventListener("mouseenter", () => {

        if (!hitboxDot) return;


        hoverCircle.setAttribute(
            "cx",
            hitboxDot.getAttribute("cx")
        );

        hoverCircle.setAttribute(
            "cy",
            hitboxDot.getAttribute("cy")
        );

        hoverCircle.style.display = "";
    });


    city.addEventListener("mouseleave", () => {

        hoverCircle.style.display = "none";
    });


    // ---------- CLICK ----------

    city.addEventListener("click", () => {
    if (!currentQuestion) return;

    const correctCity = document.querySelector(
        `[data-qa="${currentQuestion.id}"]`
    );

    if (!correctCity) return;

    console.log(
        "✅ Засчитано:",
        currentQuestion.label
    );

    addCheatMarker(correctCity);

    correctCity.classList.add("answered");

    // 1. Делаем правильный город некликабельным
    correctCity.style.pointerEvents = "none";

    nextQuestion();
});

});


// ==========================
// СТАРТ ИГРЫ
// ==========================

nextQuestion();