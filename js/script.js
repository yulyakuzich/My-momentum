const timeElemet = document.querySelector('.time');
const dateElement = document.querySelector('.date');
const greetingElement = document.querySelector('.greeting');
const nameElement = document.querySelector('.name');
const bodyElement = document.querySelector('body');
const slidePrev = document.querySelector('.slide-prev');
const slideNext = document.querySelector('.slide-next');
const city = document.querySelector('.city');
let currentLanguage = localStorage.getItem('language') || 'en';
let currentBackground = localStorage.getItem('background') || 'gitHub';


//clock and calendar

function showTime() {
  const time = new Date();
  const currentTime = time.toLocaleTimeString();
  timeElemet.textContent = currentTime;
  setTimeout(showTime, 1000);
  showDate()
  getTimeOfDay()
}
showTime();

function showDate() {
  const date = new Date();
  const options = {weekday: 'long', month: 'long', day: 'numeric'};
  // const options = {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'};
  let currentDate;
  if (currentLanguage == 'en') {
    currentDate = date.toLocaleDateString('en-EN', options);
  };
  if (currentLanguage == 'ru') {
    currentDate = date.toLocaleDateString('ru-RU', options);
  };
  dateElement.textContent = currentDate;
}
//greeting

function getTimeOfDay() {
  const hour = new Date();
  const hours = hour.getHours();
  let partOfDay;
  if (hours >= 0) {
    partOfDayEn = 'night'
    partOfDay = currentLanguage == 'en' ? 'Good night' : 'Доброй ночи'
  }
  if (hours >= 6) {
    partOfDayEn = 'morning'
    partOfDay = currentLanguage == 'en' ? 'Good morning' : 'Доброе утро'
  }
  if (hours >= 12) {
    partOfDayEn = 'afternoon'
    partOfDay = currentLanguage == 'en' ? 'Good afternoon' : 'Добрый день' 
  }
  if (hours >= 18) {
    partOfDayEn = 'evening'
    partOfDay =  currentLanguage == 'en' ? 'Good evening' : 'Добрый вечер'
  }

  greetingElement.textContent = partOfDay;
  return partOfDayEn
}


function setLocalStorage() {
  localStorage.setItem('name', nameElement.value);
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setLocalStorage)

function getLocalStorage() {
  if(localStorage.getItem('name')) {
    nameElement.value = localStorage.getItem('name');
  }
  if(localStorage.getItem('city')) {
    city.value = localStorage.getItem('city')
  }
}
window.addEventListener('load', getLocalStorage)

function renderGreeting() {
  nameElement.setAttribute('placeholder', currentLanguage == 'en' ? 'your name' : 'ваше имя')
}

renderGreeting();

//slider

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

let imageIndex;
const tegInput = document.querySelector('.teg-img');

if (localStorage.getItem('tegName')) {
  tegInput.value = localStorage.getItem('tegName')
}
const saveBtn = document.querySelector('.save');
saveBtn.addEventListener('click', ()=> {
  localStorage.setItem('tegName', tegInput.value)
  setBg()
})


async function getLinkToImage() {
const tag = localStorage.getItem('tegName') ? localStorage.getItem('tegName') : getTimeOfDay()
  const url = `https://api.unsplash.com/photos/random?query=${tag}&client_id=4hoeI8NObhgtU0Z7vgD8iQW-_gBavRTNfJD3kaTDO94`;
  const res = await fetch(url);
  const data = await res.json();
  return data.urls.regular
}

async function setBg() {
  let timeOfDay = getTimeOfDay();
  if (!imageIndex) {
    imageIndex = getRandomNum(1, 20);
  }
  let bgNum  = imageIndex.toString().padStart(2, "0");
  const img = new Image();
  const source = currentBackground == 'gitHub' 
    ? `https://github.com/rolling-scopes-school/stage1-tasks/blob/assets/images/${timeOfDay}/${bgNum}.jpg?raw=true`
    : await getLinkToImage()
  img.src = source
  img.onload = () => {
    bodyElement.style.backgroundImage = `url('${source}')`;
    bodyElement.style.backgroundRepeat = 'no-repeat';
  }
}

setBg();


 

function getSlideNext() {
  imageIndex == 20 ? imageIndex = 1 : imageIndex++;
  setBg();
}

function getSlidePrev() {
  imageIndex == 1 ? imageIndex = 20 : imageIndex--;
  setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

//weather

const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');

async function getWeather() { 
  let url; 
  if (!city.value) {
    city.value = 'Minsk';
    url = `https://api.openweathermap.org/data/2.5/weather?q=Minsk&lang=${currentLanguage}&appid=03e6d464235f0c28f325dfbb6ca2c212&units=metric`;
  } else {
    url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${currentLanguage}&appid=03e6d464235f0c28f325dfbb6ca2c212&units=metric`;
  }
  const res = await fetch(url);
  const data = await res.json(); 
  if (data.cod == '404') {
    weatherError.textContent = 'city not found';
    temperature.textContent = '';
    weatherDescription.textContent = '';
    wind.textContent = '';
    humidity.textContent = '';
  }
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.floor(data.main.temp)}°C`;
  weatherDescription.textContent = data.weather[0].description;
  wind.textContent = `${currentLanguage == 'en' ? 'Wind speed:' : 'Скорость ветра:'} ${data.wind.speed}m/s`;
  humidity.textContent = `${currentLanguage == 'en' ? 'Humidity::' : 'Влажность:'} ${data.main.humidity}%`;
  weatherError.textContent = '';
  
}
getWeather();

city.addEventListener('change', getWeather);

function setCity(event) {
  if (event.code === 'Enter') {
    getWeather();
    city.blur();
  }
}

document.addEventListener('DOMContentLoaded', getWeather);
city.addEventListener('keypress', setCity);

//quote

const quoteElement = document.querySelector('.quote');
const authorElement = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote')

async function getQuotes() {  
  
  let quotes;
  if (currentLanguage == 'en') {
    quotes = 'quotes.json'
  };
  if (currentLanguage == 'ru') {
    quotes = 'ruquotes.json'
  };
  const res = await fetch(quotes);
  const data = await res.json(); 
  let indexQuote = getRandomNum(0, 6);
  quoteElement.textContent = `"${data[indexQuote].text}"`;
  authorElement.textContent = `- ${data[indexQuote].author}`
}
getQuotes();

changeQuote.addEventListener('click', getQuotes);

//audio
const playBtn = document.querySelector('.play');
const playPrevBtn = document.querySelector('.play-prev');
const playNextBtn = document.querySelector('.play-next');
const playListContainer = document.querySelector('.play-list');
const playerControlsMain = document.querySelector('.player-controls-main');
const playName = document.querySelector('.play-name');
const totalTime = document.querySelector('.total-time');
const currentTime = document.querySelector('.current-time');
const playProgress = document.querySelector('#playProgress');
const volume = document.querySelector('#volume');
const mute = document.querySelector('#mute');
const unmute = document.querySelector('#unmute');
const audio = new Audio();
let isPlay = false;
let playNum = 0;

let prevVolume = 0;

volume.addEventListener('change', (e) => {
  const vol = e.target.value / 100
  prevVolume = vol
  audio.volume = vol
  
  if (vol <= 0.01) {
    mute.classList.add('sound-button-active')
    unmute.classList.remove('sound-button-active')
  } else {
    mute.classList.remove('sound-button-active')
    unmute.classList.add('sound-button-active')
  }
})

unmute.addEventListener('click', () => {
  audio.volume = 0.01
  volume.value = 0
  mute.classList.add('sound-button-active')
  unmute.classList.remove('sound-button-active')
})

mute.addEventListener('click', () => {
  audio.volume = prevVolume
  volume.value = prevVolume * 100
  mute.classList.remove('sound-button-active')
  unmute.classList.add('sound-button-active')
})

function timeToSeconds(t) {
  var a = t.split(':'); 
  return (+a[0]) * 60 + (+a[1]); 
}

function secondsToTime(seconds) {
  return new Date(seconds * 1000).toISOString().slice(14, 19);
}

function playAudio() {
  playerControlsMain.classList.remove('player-controls-main-hide')
  if(!isPlay) {
    audio.src = playList[playNum].src;
    audio.currentTime = 0;
    audio.play();
    playName.textContent = playList[playNum].title
    const duration = playList[playNum].duration
    totalTime.textContent = duration

    

    audio.addEventListener('ended', () => {
      playNext();
    })
    playProgress.setAttribute('max', timeToSeconds(duration))
    
    let playerInterval = setInterval(() => {
      currentTime.textContent = secondsToTime(Math.floor(audio.currentTime))
      playProgress.value = audio.currentTime
    }, 250)
    playProgress.addEventListener('mousedown', (e) => {
      clearInterval(playerInterval)
    })
    
    playProgress.addEventListener('mouseup', (e) => {
      audio.currentTime = e.target.value
      playerInterval = setInterval(() => {
        currentTime.textContent = secondsToTime(Math.floor(audio.currentTime))
        playProgress.value = audio.currentTime
      }, 250)
    })


    isPlay = true;
  } else {
    audio.pause();
    isPlay = false;
  }
  createPlayList()
}
playBtn.addEventListener('click', playAudio);

function toggleBtn() {
  if(isPlay) {
    playBtn.classList.add('pause');
  } else {
    playBtn.classList.remove('pause');
  }
}
playBtn.addEventListener('click', toggleBtn);

function playNext() {
  isPlay = false;
  playNum == playList.length - 1 ? playNum = 0 : playNum++;
  playAudio();
  toggleBtn();
  createPlayList()
}
function playPrev() {
  isPlay = false;
  playNum == 0 ? playNum = playList.length - 1 : playNum--;
  playAudio();
  toggleBtn();
  createPlayList()
}

playNextBtn.addEventListener('click', playNext);
playPrevBtn.addEventListener('click', playPrev);

function createPlayList() {
  playListContainer.innerHTML = ''
  for(let i = 0; i < playList.length; i++) {
    const li = document.createElement('li');
    li.classList.add('play-item');
    playNum == i && isPlay && li.classList.add('play-item-active');

    li.textContent = playList[i].title;
    playListContainer.append(li);
  }
}
 createPlayList()

 //settings

 const settingIcon = document.querySelector('.settings-icon');
 const settingContainer = document.querySelector('.settings-container');
 const closeIcon = document.querySelector('.close-btn');

 settingIcon.addEventListener('click', () => {
  settingContainer.classList.toggle('settings-container-active')
 });
 closeIcon.addEventListener('click', () => {
  settingContainer.classList.remove('settings-container-active')
 })

 const languageElements = document.querySelectorAll('.settings-lang-value'); 

Array.from(languageElements).map(el => { 
  el.classList.add(el.getAttribute('data-language-name') == currentLanguage ? 'settings-value-selected' : 'no')
  el.addEventListener('click', (event) => {
    if (event.target.getAttribute('data-language-name') !== currentLanguage) {
    Array.from(languageElements).map(node => {
        node.classList.toggle('settings-value-selected')
      }
      );
      localStorage.setItem('language', el.getAttribute('data-language-name'));
      currentLanguage = el.getAttribute('data-language-name');
      getQuotes();
      getWeather();
      getTimeOfDay();
      renderGreeting();
    }
})});

  const backgroundElements = document.querySelectorAll('.settings-img-value');
  
  Array.from(backgroundElements).map(el => {
    el.classList.add(el.getAttribute('data-img-source-name') == currentBackground ? 'settings-value-selected' : 'no');
    el.addEventListener('click', (event) => {
      if (event.target.getAttribute('data-img-source-name') !== currentBackground) {
      Array.from(backgroundElements).map(node => {
          node.classList.toggle('settings-value-selected');
        })
        localStorage.setItem('background',el.getAttribute('data-img-source-name'));
        currentBackground = el.getAttribute('data-img-source-name');
        setBg();
      }
    })
  })
 
function changeShowOption(event) {
  const optionName = event.target.getAttribute('data-optiom-name')
  event.target.classList.toggle('settings-value-selected');
  document.getElementById(optionName).classList.toggle('hidden');
  let hiddenElements = JSON.parse(localStorage.getItem('hiddenElements')) || []
  if (!hiddenElements.find(el => el == optionName)) {
    localStorage.setItem('hiddenElements', JSON.stringify([...hiddenElements, optionName]))
  } else {
    localStorage.setItem('hiddenElements', JSON.stringify(hiddenElements.filter(el => el !== optionName)))
  }
}
const showElementsOptions = document.querySelectorAll('.settings-show-value');
if (JSON.parse(localStorage.getItem('hiddenElements'))) {
  JSON.parse(localStorage.getItem('hiddenElements')).map(option => {
    document.getElementById(option).classList.toggle('hidden');
    Array.from(showElementsOptions).map(el => {
      if(el.getAttribute('data-optiom-name') == option) {
        el.classList.toggle('settings-value-selected')
      }
    })
  })
}

Array.from(showElementsOptions).map(el => el.addEventListener('click', changeShowOption));

//to-do list

const closeListBtn = document.querySelector('.close-list-btn');
const openListBtn =document.querySelector('.list-icon');
const toDoContainer = document.querySelector('.to-do-container');
closeListBtn.addEventListener('click', () => {
  toDoContainer.classList.remove('to-do-container-active')
});
openListBtn.addEventListener('click', () => {
  toDoContainer.classList.toggle('to-do-container-active')
})
const toDoDefault = [
  {
    name: 'Hit the gym',
    checked: true,
  },
  {
    name: 'Pay bills',
    checked: false,
  },
]
if (!localStorage.getItem('toDo')) {
  localStorage.setItem('toDo', JSON.stringify(toDoDefault))
} 

let allToDos = JSON.parse(localStorage.getItem('toDo'));


function renderToDoList() {
  let list = document.querySelector('.ul');
  list.innerHTML = '';

  allToDos.map(el => {
    
    let li = document.createElement("li");
    li.classList.add('list-element');
    li.textContent = el.name;
    if (el.checked) {
      li.classList.add('checked')
    }
    let span = document.createElement("SPAN");
    let txt = document.createTextNode("\u00D7");
    span.className = "close-element";
    span.appendChild(txt);
    span.addEventListener('click', () => {
      allToDos = allToDos.filter(e => e !== el)
      
      localStorage.setItem('toDo', JSON.stringify(allToDos));
      renderToDoList()
    });
    li.addEventListener('click', () => {
      
      li.classList.toggle('checked');
      allToDos = allToDos.map(el => {
        return li.textContent.slice(0, li.textContent.length - 1) == el.name ? {...el, checked: !el.checked} : el
      })

      localStorage.setItem('toDo', JSON.stringify(allToDos));
      renderToDoList()
    })
    li.appendChild(span);
    list.appendChild(li)
  })
}
renderToDoList()

function newElement() {
  let inputValue = document.getElementById("myInput").value;
  if (inputValue === '') {
    alert("You must write something!");
  } else {
    allToDos.push({name: inputValue, checked: false})
    
    localStorage.setItem('toDo', JSON.stringify(allToDos))
  }
  document.getElementById("myInput").value = "";
  renderToDoList();
}