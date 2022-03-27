// https://stackoverflow.com/a/56075718/2857231
if (!Array.prototype.includes) {
  Object.defineProperty(Array.prototype, "includes", {
    enumerable: false,
    value: function(obj) {
        var newArr = this.filter(function(el) {
          return el == obj;
        });
        return newArr.length > 0;
      }
  });
}

if (typeof NodeList.prototype.forEach !== 'function')  {
  NodeList.prototype.forEach = Array.prototype.forEach;
}

var seconds = 0, minutes = 0, hours = 0, pexesoTimeout;
var waiting = 0;

function initPexesoGrid(cards,pexesoDifficulty){
  var pexeso = document.querySelector('.pexeso-container');
  var rub = '/rub.jpg';
  pexeso.dataset.difficulty = pexesoDifficulty;
  pexeso.innerHTML = '';
  document.querySelector('.pexeso-timer .turns').dataset.turns = 0;
  document.querySelector('.pexeso-timer .turns').innerHTML = '0';
  document.querySelector('.pexeso-timer time').textContent = "00:00:00";
  seconds = 0; minutes = 0; hours = 0;
  clearTimeout(pexesoTimeout);
  var generatedCards = [];
  for (var i = 0; i < cards/2; i++) {
    var card = document.createElement('div');
    card.classList.add('card');
    dataLic = getRandomCard(generatedCards);
    generatedCards.push(dataLic);
    var pathUsage = '/cesky';
    var pathElement = '/ukrajinsky';
    if (document.querySelector('html').getAttribute('lang') == 'uk'){
      var pathUsage = '/ukimages/cesky';
      var pathElement = '/ukimages/ukrajinsky';
    }
    card.dataset.lic = pathUsage+'/'+dataLic+'.png';
    card.innerHTML = '<img src="/rub.jpg">';
    pexeso.appendChild(card);
    card = document.createElement('div');
    card.classList.add('card');
    card.dataset.lic = pathElement+'/'+dataLic+'.png';
    card.innerHTML = '<img src="'+rub+'">';
    pexeso.appendChild(card);
  }
  for (var i = pexeso.children.length; i >= 0; i--) {
    pexeso.appendChild(pexeso.children[Math.random() * i | 0]);
  }
  var pexesoCards = document.querySelectorAll('.pexeso-container .card');
  var pexesoPreviousCard = '';
  pexesoCards.forEach(function(item,index){
    var preloadImage = new Image();
    preloadImage.src = document.location.protocol+'//'+document.location.host + item.dataset.lic;

    item.addEventListener('click',function(e){
      e.preventDefault();
      if (!item.classList.contains('solved') && waiting == 0 && item != pexesoPreviousCard){
        var image = item.querySelector('img');
        image.setAttribute('src',item.dataset.lic);
        var turns = document.querySelector('.pexeso-timer .turns').dataset.turns;
        if (turns == 0){
          pexesoTimer();
        }
        turns++;
        document.querySelector('.pexeso-timer .turns').dataset.turns = turns;
        document.querySelector('.pexeso-timer .turns').innerHTML = turns;
        if (turns % 2 == 0){
          var a = item.dataset.lic.replace('ukrajinsky','').replace('cesky','');
          var b = pexesoPreviousCard.dataset.lic.replace('ukrajinsky', '').replace('cesky', '');
          var c = pexesoPreviousCard.dataset.lic.replace('ukrajinsky', '').replace('cesky', '');
          if (a != b && a != c){
            waiting = 1;
            setTimeout(function(){
              image.setAttribute('src',rub);
              pexesoPreviousCard.querySelector('img').setAttribute('src',rub);
              waiting = 0;
              pexesoPreviousCard = '';
            }, 1000);
          }
          else{
            item.classList.add('solved');
            pexesoPreviousCard.classList.add('solved');
            if (document.querySelectorAll('.pexeso-container .card.solved').length == cards){
              document.querySelector('.pexeso-message').classList.remove('hidden');
              document.querySelector('.pexeso-difficulty').scrollIntoView();
              clearTimeout(pexesoTimeout);
            }
          }
        }
        else{
          pexesoPreviousCard = item;
        }
      }
    });
  });
}

function getRandomCard(generatedCards){
  var total = 33;
  if (document.querySelector('html').getAttribute('lang') == 'uk') {
    total = 42;
  }  
  var myNumber = Math.floor((Math.random() * total) + 1);
  if (generatedCards.includes(myNumber)){
    myNumber = getRandomCard(generatedCards);
  }
  return myNumber;
}

function initPexesoDifficulty(){
  var difficultySelector = document.querySelectorAll('.pexeso-difficulty button');
  difficultySelector.forEach(function(item, index){
    item.addEventListener('click',function(e){
      e.preventDefault();
      document.querySelector('.pexeso-message').classList.add('hidden');
      difficultySelector.forEach(function(it,ind){
        it.classList.remove('btn-green');
        it.classList.add('btn-default');
      });
      item.classList.add('btn-green');
      item.classList.remove('btn-default');
      switch (index) {
        case 0:
          initPexesoGrid(12,'beginner');
          break;
        case 1:
          initPexesoGrid(22,'advanced');
          break;
        case 2:
          initPexesoGrid(32,'expert');
          break;
      }
    })
  });
}

function pexesoTimerAdd() {
  seconds++;
  if (seconds >= 60) {
    seconds = 0;
    minutes++;
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
  }
  document.querySelector('.pexeso-timer time').textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
  pexesoTimer();
}
function pexesoTimer() {
  pexesoTimeout = setTimeout(pexesoTimerAdd, 1000);
}

document.addEventListener('DOMContentLoaded', function(){
  initPexesoGrid(12,'beginner');
  initPexesoDifficulty();
}, false);
