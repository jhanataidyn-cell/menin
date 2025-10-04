// Секцияларды ауыстыру
function showSection(id) {
  ["home","quiz","rating","persons","scoreboard"].forEach(sec=>{
    document.getElementById(sec).style.display="none";
  });
  document.getElementById(id).style.display="block";
  if(id==="rating") loadRating();
  if(id==="scoreboard") loadPlayers();
}

// Сұрақтар
const questions = [
  {question:"Абай Құнанбайұлының туған жылы?",answers:["1845","1835","1850","1825"],correct:0},
  {question:"«Қыз Жібек» жыры кімнің шығармасы?",answers:["Ж.Шайхисламұлы","Махамбет","Ш.Уәлиханов","Б.Майлин"],correct:0},
  {question:"Жамбыл Жабаев қай жылы дүниеге келген?",answers:["1846","1852","1860","1875"],correct:0},
  {question:"«Алпамыс батыр» жыры қандай жанрға жатады?",answers:["Эпос","Лирика","Драма","Поэма"],correct:0},
  {question:"«Мен жастарға сенемін» өлеңінің авторы кім?",answers:["Мағжан Жұмабаев","Абай","Жүсіпбек Аймауытов","Сәкен Сейфуллин"],correct:0}
];

let currentUser = null;
let currentQuestion = 0;
let score = 0;

function setUser(){
  const nick = document.getElementById("nickname").value;
  if(nick){
    currentUser = nick;
    document.getElementById("username-box").innerText = "Сәлем, " + nick;
    showSection("quiz");
    startQuiz();
  }
}

function startQuiz() {
  document.getElementById("quiz").style.display = "block";
  currentQuestion = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const quizBox = document.getElementById("quiz");
  const q = questions[currentQuestion];
  quizBox.innerHTML = `
    <h2>${q.question}</h2>
    ${q.answers.map((ans, i) => `
      <button class="answer-btn" onclick="checkAnswer(${i})">${ans}</button>
    `).join("")}
  `;
}

function checkAnswer(i) {
  if (i === questions[currentQuestion].correct) {
    score += 10; // әр дұрыс жауап 10 ұпай
  }
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    endQuiz();
  }
}

function endQuiz() {
  const quizBox = document.getElementById("quiz");
  quizBox.innerHTML = `
    <h2>Ойын аяқталды!</h2>
    <p>${currentUser}, сіздің нәтижеңіз: ${score} ұпай</p>
    <button onclick="startQuiz()">Қайта ойнау</button>
  `;
  saveScore(currentUser, score);
  savePlayer(currentUser, score);
}

// Рейтинг сақтау
function saveScore(user, score){
  let rating = JSON.parse(localStorage.getItem("rating")||"[]");
  rating.push({user,score});
  localStorage.setItem("rating", JSON.stringify(rating));
}
function loadRating(){
  const list = document.getElementById("rating-list");
  list.innerHTML="";
  let rating = JSON.parse(localStorage.getItem("rating")||"[]");
  rating.sort((a,b)=>b.score-a.score);
  rating.forEach(r=>{
    let li=document.createElement("li");
    li.textContent = r.user + " — " + r.score + " ұпай";
    list.appendChild(li);
  });
}

// Ойыншылар кестесі
function savePlayer(user, score){
  let players = JSON.parse(localStorage.getItem("players")||"[]");
  let found = players.find(p=>p.user===user);
  if(found){
    if(score > found.score) found.score = score;
  } else {
    players.push({user,score});
  }
  localStorage.setItem("players", JSON.stringify(players));
}

function loadPlayers(){
  const list = document.getElementById("players-list");
  list.innerHTML="";
  let players = JSON.parse(localStorage.getItem("players")||"[]");
  players.sort((a,b)=>b.score-a.score);
  players.forEach(p=>{
    let li=document.createElement("li");
    li.textContent = p.user + " — " + p.score + " ұпай";
    list.appendChild(li);
  });
}
