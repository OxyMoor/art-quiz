// TO DO: 
// 2) добавить дотсы с индикацией верно / неверно по количеству картин в категории 

// переменные
const sections = document.querySelectorAll('.section'); 

const homeSection = document.querySelector('.home-page');
const settingsSection = document.querySelector('.settings-page');
const categoriesSection = document.querySelector('.categories-page');
const questionSection = document.querySelector('.question-page');
const scoreSection = document.querySelector('.score-page');

const modals = document.querySelectorAll('.modal');

const modalAnswer = document.querySelector('.modal-answer');
const modalCongratulation = document.querySelector('.modal-congratulation');
const modalGrand = document.querySelector('.modal-grand');
const modalGO = document.querySelector('.modal-game-over');

const settingsBtn = document.querySelector('.settings-button');
const volumeRangeBtn = document.querySelector('.volume-range-button');
const saveBtn = document.querySelector('.save-button');
const defaultBtn = document.querySelector('.default-button');

const fromCategoriesToHomeBtn = categoriesSection.querySelector('.to-home-button');
const fromQuestionsToHomeBtn = questionSection.querySelector('.to-home-button');
const fromScoreToHomeBtn = scoreSection.querySelector('.to-home-button');
const fromScoreToCategoriesBtn = scoreSection.querySelector('.to-categories-button');
const fromCongratulationsToHomeBtn = modalCongratulation.querySelector('.to-home-button');
const fromGrandToHomeBtn = modalGrand.querySelector('.to-home-button');
const fromCongratulationsToNextQuizBtn = modalCongratulation.querySelector('.next-quiz-button');
// const scoreBtn = document.querySelector('.score-button');
const nextQuestBtn = document.querySelector('.next-button');
const nextQuizBtn = document.querySelector('.next-quiz-button');
const yesBtn = document.querySelector('.yes-button');
const noBtn = document.querySelector('.no-button');
const nextBtn = document.querySelector('.next-button');
const moreCategoriesBtn = categoriesSection.querySelector('.show-more-categories');
const moreScoreBtn = scoreSection.querySelector('.show-more-score');
const volumeBtn = document.querySelector('.volume-range-button');
const playAgainBtn = document.querySelector('.play-again-button');

const moreBtnIcon = document.querySelector('.show-more-icon');
const volumeBtnIcon = document.querySelector('.volume-range-icon');

const categoryCards = categoriesSection.querySelectorAll('.category-card');
const pictureWrap = document.querySelector('.picture-wrap');

const artQuizBtn = document.querySelector('.artists-quiz-name');
const picQuizBtn = document.querySelector('.pictures-quiz-name');

const answers = document.querySelectorAll('.answer');

const answerResultIcon = modalAnswer.querySelector('.answer-result');
const modalPicture = document.querySelector('.modal-picture');
const modalPictureName = document.querySelector('.modal-picture-name');
const modalPictureAuthor = document.querySelector('.modal-picture-author');
const modalPictureYear = document.querySelector('.modal-picture-year');

const modalScore = document.querySelector('.modal-score-text');

const categoriesCards = categoriesSection.querySelector('.categories-cards');
const scoreCards = scoreSection.querySelector('.score-cards');

// const scoreOnCategory = document.querySelector('.category-card-score');

const timerCheckbox = document.querySelector('.timer-checkbox');
const volumeRange = document.querySelector('.volume-range');

const timerSpan = document.querySelector('.time');
let time;
let isTimeOver = false;
let interval;

const audio = new Audio();

let settings;

const default_set = {
    'volume' : 'on',
    'timer' : 'off',
    'volume-value' : '0.5'
};

let user_set = {};

let categoryNumber;
let quizType;
let firstQuestionNumber;
let lastQuestionNumber;
let questionNumber;

let rightAnswer;

let scoreCounter;
let totalScore = 0;

let playedCategories = {};

const questionsCount = 10;
const categoriesCount = 10;
const allPicturesCount = 200;
const artistsType = 0;
const picturesType = allPicturesCount / 2;

let scoreInfo = {};


// функции
async function getPict() {  
    const pictures = 'pictures.json';
    const res = await fetch(pictures);
    const data = await res.json(); 

    return data;
}

function getRandomNumber(from, to) {
    return Math.floor(Math.random() * (to - from + 1)) + from;
}

function shuffleArr(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        let temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;
    }
    
    return arr;
}

function showActiveSection(sect) {
    sections.forEach(item => item.classList.remove('section-active'));
    sect.classList.add('section-active');
}

function showModal(modal) {
    modals.forEach(item => item.classList.remove('modal-active'));
    modal.classList.add('modal-active');
}

function hideModal(modal) {
    modals.forEach(item => item.classList.remove('modal-active'));
    modal.style.transition = '0.3s';
}

function showMoreCategories(cards, button) {
    cards.style.height = '100%';
    moreBtnIcon.style.display = 'none';
    button.style.height = '0';
}

function showLessCategories(cards, button) {
    cards.removeAttribute('style');
    moreBtnIcon.style.display = 'inline';
    button.removeAttribute('style');
}

function toggleVolumeIcon() {
    if (volumeBtn.classList.contains('volume-on')) {
        volumeBtn.classList.remove('volume-on');
        volumeBtnIcon.src = 'assets/volume-off.svg';

        volumeRange.value = 0;
    } else {
        volumeBtn.classList.add('volume-on');
        volumeBtnIcon.src = 'assets/volume-on.svg';

        volumeRange.value = 0.5;
    }

    updateRange();
}

function updateRange() {
    volumeRange.style.background = `linear-gradient(to right, #660033 0%, #660033 ${volumeRange.value * 100}%, #C4C4C4 ${volumeRange.value * 100}%, #C4C4C4 100%)`;

    if (volumeRange.value === '0') {
        volumeBtn.classList.remove('volume-on');
        volumeBtnIcon.src = 'assets/volume-off.svg';
    } else {
        volumeBtn.classList.add('volume-on');
        volumeBtnIcon.src = 'assets/volume-on.svg';
    }
}

function setUserSettings() {
    if (volumeBtn.classList.contains('volume-on')) {
        user_set['volume'] = 'on';
    } else {
        user_set['volume'] = 'off';
    }
    user_set['volume-value'] = volumeRange.value;

    if (timerCheckbox.classList.contains('timer-checkbox-checked')) {
        user_set['timer'] = 'on';
    } else {
        user_set['timer'] = 'off';
    }
}

function showChosenSettings() {
    if (localStorage.getItem('settings')) {
        settings = JSON.parse(localStorage.getItem ('settings'));
    } else {
        settings = default_set;
    }

    volumeRange.value = settings['volume-value'];
    updateRange();

    if (settings['timer'] === 'on') {
        timerCheckbox.classList.add('timer-checkbox-checked');
    } else if (settings['timer'] === 'off') {
        timerCheckbox.classList.remove('timer-checkbox-checked');
    }
}

function setTime() {
    interval = setInterval(function () {
        if (time > 0) {
            time--;
            timerSpan.textContent = `${time}`;
        } else {
            clearInterval(interval);
            isTimeOver = true;
            answerResultIcon.src = 'assets/wrong-answer.svg';
            showModal(modalAnswer);

            if (settings['volume'] === 'on') {
                audio.src = './assets/audio/wrong.mp3';
                audio.volume = settings['volume-value'];
                audio.play();
            }
        } 
    }, 1000);
}
 

function renderQuestionType() {
    if (quizType === artistsType) {
        pictureWrap.innerHTML = `<img class="picture-image" src="assets/question-01.png" alt="image: picture">`;
        document.querySelector('.question').textContent = 'выберите автора картины';
    } else if (quizType === picturesType) {
        pictureWrap.innerHTML = `<img class="picture-option-image" src="assets/question-item-1.png" alt="image: picture">
        <img class="picture-option-image" src="assets/question-item-2.png" alt="image: picture">
        <img class="picture-option-image" src="assets/question-item-3.png" alt="image: picture">
        <img class="picture-option-image" src="assets/question-item-4.png" alt="image: picture">`;
        document.querySelector('.question').textContent = 'ds,thbnt rfhnbye veyrf';
    }
}

function renderArtistsQuestion() {
    if (localStorage.getItem('settings')) {
        settings = JSON.parse(localStorage.getItem ('settings'));
    } else {
        settings = default_set;
    }

    if (settings['timer'] === 'on') {
        time = 10;
        timerSpan.textContent = `${time}`;

        setTime();
    } else {
        timerSpan.textContent = 'выкл';
    }

    let answersArr = [];
    let randomAnswers;
    
    if (firstQuestionNumber === lastQuestionNumber) {
        hideModal(modalAnswer);

        modalScore.textContent = `${scoreCounter} / ${questionsCount}`;

        if (totalScore === questionsCount * categoriesCount) {
            showModal(modalGrand);
        } else {
            showModal(modalCongratulation);

            if (settings['volume'] === 'on') {
                audio.src = './assets/audio/round-completed.mp3';
                audio.volume = settings['volume-value'];
                audio.play();
            }
    
            let currentCategory = categoriesSection.querySelector(`[data-category='${categoryNumber}']`);
            currentCategory.querySelector('.category-card-score').style.display = 'inline';
            currentCategory.querySelector('.category-card-score').style.color = '#660033';
            currentCategory.querySelector('.category-card-score').textContent = `${scoreCounter} / 10`;
            currentCategory.querySelector('.category-card-number').style.color = '#660033';
            // currentCategory.querySelector('.category-card-name').style.color = '#660033';
            currentCategory.querySelector('.category-card-image').src = `assets/category-${categoryNumber}-color.png`
    
            playedCategories[categoryNumber] = scoreCounter;
        }
        
        clearInterval(interval);


        firstQuestionNumber = (+categoryNumber - 1) * questionsCount + quizType;
        categoryNumber = null;
    } else {
        document.querySelector('.picture-image').src = `https://raw.githubusercontent.com/SeriakovaOksana/image-data/master/full/${firstQuestionNumber}full.jpg`;

        // почему-то пришлось от первого номера отнять 1.......
        getPict().then((result) => {
            rightAnswer = result[firstQuestionNumber - 1]['author'];
            answersArr.push(rightAnswer);

            for (let i = 0; i < 3; i++) {
                if (quizType === artistsType) {
                    answersArr.push(result[getRandomNumber(100, 199)]['author']);
                } else {
                    answersArr.push(result[getRandomNumber(0, 99)]['author']);
                }
            }

            randomAnswers = shuffleArr(answersArr);

            randomAnswers.forEach((item, index) => {
                document.querySelector(`[data-answer='${index}']`).textContent = item;
            });

            modalPicture.src = `https://raw.githubusercontent.com/SeriakovaOksana/image-data/master/img/${result[firstQuestionNumber - 1]['imageNum']}.jpg`
            modalPictureName.textContent = result[firstQuestionNumber - 1]['name'];
            modalPictureAuthor.textContent = result[firstQuestionNumber - 1]['author'];
            modalPictureYear.textContent = result[firstQuestionNumber - 1]['year'];
        });
        
        firstQuestionNumber++;
    } 
}

const scoreCard = document.querySelectorAll('.score-card')

function renderScore() {
    scoreCard.forEach(item => {
        item.querySelector('.category-card-number').textContent = categoryNumber;
        item.querySelector('.answer-result').src = `assets/${scoreInfo[+item.dataset.score + +(categoryNumber - 1) * categoriesCount]}.svg`;
        item.querySelector('.category-card-image').src = `https://raw.githubusercontent.com/SeriakovaOksana/image-data/master/img/${(+item.dataset.score + +(categoryNumber - 1) * categoriesCount) - 1}.jpg`;
    
        if (scoreInfo[+item.dataset.score + +(categoryNumber - 1) * categoriesCount] === 'wrong-answer') {
            item.querySelector('.category-card-image').style.filter = 'invert(0%) sepia(100%) saturate(30%) hue-rotate(80deg) brightness(92%) contrast(107%)';
        } else {
            item.querySelector('.category-card-image').style.filter = '';
        }
    });
}


// листнеры
settingsBtn.addEventListener('click', function() {
    showActiveSection(settingsSection);
});

saveBtn.addEventListener('click', function() {
    showActiveSection(homeSection);
});

defaultBtn.addEventListener('click', function() {
    showActiveSection(homeSection);
});

artQuizBtn.addEventListener('click', function() {
    showActiveSection(categoriesSection);
    quizType = artistsType;
});

picQuizBtn.addEventListener('click', function() {
    showActiveSection(categoriesSection);
    quizType = picturesType;
});

fromCategoriesToHomeBtn.addEventListener('click', function() {
    showActiveSection(homeSection);
    showLessCategories(categoriesCards, moreCategoriesBtn);
});

fromScoreToHomeBtn.addEventListener('click', function() {
    showActiveSection(homeSection);
    showLessCategories(scoreCards, moreScoreBtn);
});

fromScoreToCategoriesBtn.addEventListener('click', function() {
    showActiveSection(categoriesSection);
    showLessCategories(scoreCards, moreScoreBtn);
});

categoryCards.forEach(item => {
    item.addEventListener('click', function(e) {
        categoryNumber = e.currentTarget.dataset.category;

        if (e.target === item.querySelector('.category-card-score')) {
            renderScore()
            showActiveSection(scoreSection);
        } else {
            showActiveSection(questionSection);
            showLessCategories(categoriesCards, moreCategoriesBtn);
    
            firstQuestionNumber = (+categoryNumber - 1) * questionsCount + quizType;
            lastQuestionNumber = (+categoryNumber * questionsCount) + quizType;
    
            renderQuestionType();
            renderArtistsQuestion();
    
            scoreCounter = 0;
        }

        // scoreInfo = {};
    });
});

// document.querySelectorAll('.curtain').forEach(item => item.addEventListener)

fromQuestionsToHomeBtn.addEventListener('click', function() {
    showActiveSection(homeSection);
    
    clearInterval(interval);
});

fromCongratulationsToHomeBtn.addEventListener('click', function() {
    hideModal(modalCongratulation);
    showActiveSection(homeSection);
});

fromCongratulationsToNextQuizBtn.addEventListener('click', function() {
    hideModal(modalCongratulation);
    showActiveSection(categoriesSection);
});

fromGrandToHomeBtn.addEventListener('click', function() {
    hideModal(modalGrand);
    showActiveSection(homeSection);
});

answers.forEach(item => {
    item.addEventListener('click', function(e) {
        clearInterval(interval);
        
        if (e.currentTarget.children[0].textContent === rightAnswer) {
            scoreCounter++

            item.classList.add('answer-right');
            
            answerResultIcon.src = 'assets/right-answer.svg';

            if (settings['volume'] === 'on') {
                audio.src = './assets/audio/right.mp3';
                audio.volume = settings['volume-value'];
                audio.play();
            }

            
            scoreInfo[firstQuestionNumber] = 'right-answer';
            
        } else {
            item.classList.add('answer-wrong');

            answerResultIcon.src = 'assets/wrong-answer.svg';

            if (settings['volume'] === 'on') {
                audio.src = './assets/audio/wrong.mp3';
                audio.volume = settings['volume-value'];
                audio.play();
            }

            scoreInfo[firstQuestionNumber] = 'wrong-answer';
        }

        // console.log(scoreInfo)

        if ((scoreCounter < questionsCount && firstQuestionNumber === lastQuestionNumber) || (scoreCounter < questionsCount && firstQuestionNumber !== lastQuestionNumber)) {
            document.querySelector(`[data-again='${categoryNumber}']`).style.display = 'flex';
            document.querySelector(`[data-curtain='${categoryNumber}']`).style.display = 'none';
        } else if (scoreCounter === questionsCount && firstQuestionNumber === lastQuestionNumber) {
            document.querySelector(`[data-again='${categoryNumber}']`).style.display = 'none';
            document.querySelector(`[data-curtain='${categoryNumber}']`).style.display = 'flex';

            totalScore += questionsCount;
        } 
        // else if (scoreCounter < questionsCount && firstQuestionNumber !== lastQuestionNumber) {
        //     document.querySelector(`[data-again='${categoryNumber}']`).style.display = 'none';
        //     document.querySelector(`[data-curtain='${categoryNumber}']`).style.display = 'none';
        // }

        showModal(modalAnswer);
    });
});

nextBtn.addEventListener('click', function() {
    hideModal(modalAnswer);

    renderArtistsQuestion();

    answers.forEach(item => {
        item.classList.remove('answer-right');
        item.classList.remove('answer-wrong');
    });  
});

moreCategoriesBtn.addEventListener('click', function() {
    showMoreCategories(categoriesCards, moreCategoriesBtn);
});
moreScoreBtn.addEventListener('click', function() {
    showMoreCategories(scoreCards, moreScoreBtn);
});

// scoreBtn.addEventListener('click', function() {
//     showLessCategories(categoriesCards, moreCategoriesBtn);
// });

timerCheckbox.addEventListener('click', function() {
    timerCheckbox.classList.toggle('timer-checkbox-checked');
});


volumeBtn.addEventListener('click', toggleVolumeIcon);
volumeRange.addEventListener('click', updateRange);
volumeRange.addEventListener('mousedown', updateRange);
volumeRange.addEventListener('mousemove', updateRange);
volumeRange.addEventListener('touchend', updateRange);
volumeRange.addEventListener('touchmove', updateRange);

saveBtn.addEventListener('click', function() {
    setUserSettings();
    
    localStorage.setItem('settings', JSON.stringify(user_set));
    showChosenSettings();
});

defaultBtn.addEventListener('click', function() {
    localStorage.setItem('settings', JSON.stringify(default_set));
    showChosenSettings();
});

showChosenSettings();

// console.log(`Всего: 138 / 220
// Не реализован подбор вопросов/ответам к типу викторины “картины”, лучше туда не заходить, а то все ломается... 
// 1.Стартовая страница и навигация +20
// 2.Настройки +20 (есть возможность нажать в настройках включить/выключить игру на время и эта настройка сохраняется, но ее применение не реализовано)
// 3.Страница категорий +30
// 4.Страница с вопросами +38 (варианты ответов бывает повторяются, правильный и неправильный выбранный вариант не отличаются по цвету)
// 5.Страница с результатами +0 (нет страницы с результатами)
// 6.Плавная смена изображений +10
// 7.Реализована анимация +20`)