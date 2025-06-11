gsap.registerPlugin(Draggable);

console.clear()

let loadingValue = document.querySelector(".loading-value");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let dragProxy = document.querySelector(".proxy");
let titles = ["Hunterbrook", "Sony Group", "Data Desk", "The Dream Factory", "Degree Show", "Miscellaneous"]
let initialProgress = 0;
let videoLenghts = [0, 630, 1890, 2520, 3150, 3780];

canvas.width = 1920;
canvas.height = 1080;

let frameCount = 5039;
let currentFrame = index => (
  `img/frm/${(index).toString().padStart(5, "0")}.webp`
);

let progression = 0.01
let images = []
let sequence = {
  frame: 0
};

let imagesToLoad = frameCount;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.onload = onLoad;
  img.src = currentFrame(i);
  images.push(img);
};

function dialNumbering() {
  let dialContainer = document.querySelector(".dial-container");
  for (let i = 0; i < videoLenghts.length; i++) {
    let rotation = videoLenghts[i] / frameCount;
    let number = document.createElement("div");
    number.textContent = i + 1;
    number.style.transform = "rotate(" + rotation + "turn)";
    number.classList.add("number");
    number.setAttribute("id", "n" + i);
    dialContainer.prepend(number);
  }
};

function progressChecker(progress) {
  if (progress >= 0 / frameCount && progress < videoLenghts[1] / frameCount){
    projectChanger(0);
  }
  else if (progress >= videoLenghts[1] / frameCount && progress < videoLenghts[2] / frameCount){
    projectChanger(1);
  } 
  else if (progress >= videoLenghts[2] / frameCount && progress < videoLenghts[3] / frameCount){
    projectChanger(2);
  } 
  else if (progress >= videoLenghts[3] / frameCount && progress < videoLenghts[4] / frameCount){
    projectChanger(3);
  } 
  else if (progress >= videoLenghts[4] / frameCount && progress < videoLenghts[5] / frameCount){
    projectChanger(4);
  } 
  else if (progress >= videoLenghts[5] / frameCount && progress < frameCount){
    projectChanger(5);
  } 
};
executed = [false, false, false, false, false, false];
function projectChanger(number) {
  if(number == 0 && !executed[0]){
    resetArr()
    executed[0] = true;
    infoSet(number);
  }
  else if (number == 1 && !executed[1]){
    resetArr()
    executed[1] = true;
    infoSet(number);
  }
  else if (number == 2 && !executed[2]){
    resetArr()
    executed[2] = true;
    infoSet(number);
  }
  else if (number == 3 && !executed[3]){
    resetArr()
    executed[3] = true;
    infoSet(number);
  }
  else if (number == 4 && !executed[4]){
    resetArr()
    executed[4] = true;
    infoSet(number);
  }
  else if (number == 5 && !executed[5]){
    resetArr()
    executed[5] = true;
    infoSet(number);
  }
};

function resetArr() {
  for (let i = 0; i < executed.length; i++){executed[i] = false;}
};

function infoSet(project) {
  
  function numberOpacity(index){
    let inactive = document.querySelectorAll(".number");
    let active = document.getElementById("n" + index);

    inactive.forEach((inactivate) => inactivate.classList.remove("active"));
    active.classList.add("active");
  }

  // function setTitle(index) {
  //   let title = document.querySelector("h1");
  //   title.textContent = titles[index];
  // }
  numberOpacity(project);
  setTitle(project);
}

function getCombinedProgress(progressAtClick) {
  let rotation = gsap.getProperty(dragProxy, "rotation") % 360;
  let normalizedRotation = (rotation < 0) ? rotation + 360 : rotation;
  let addedInitialRotation = normalizedRotation + progressAtClick;
  let progressAtRotation = addedInitialRotation / 360;
  return progressAtRotation ;
};


let imageSequencer = gsap.to(sequence, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  paused: true,
  onUpdate: render 
});

let dialRotater = gsap.to(".dial", {
  duration: frameCount/30,
  rotation: "360_cw",
  repeat: -1,
  ease: "none",
  paused: true,
  onUpdate: function(){
    imageSequencer.progress(this.progress());
    progressChecker(this.progress());
  }
});

function getInitialProgress(){
  let iP = gsap.getProperty(".dial", "rotation");
  return iP
};

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[sequence.frame], 0, 0); 
}

Draggable.create(dragProxy,{
  type: "rotation",
  onPress: function(){
    dialRotater.pause()
    initialProgress = getInitialProgress()
  },
  onDrag: function(){
    dialRotater.progress(getCombinedProgress(initialProgress))
  },
  onRelease: function(){
    gsap.set(dragProxy,{rotation: 0})
    dialRotater.play()
  }
  
})

function infoTog(){
  const 
    sections = document.querySelectorAll("section"),
    buttons = document.querySelectorAll("button")
  ;

  buttons.forEach(button =>{
    button.addEventListener("click", function (e) {
      console.log(Array.prototype.indexOf.call(buttons, button))
      let i = Array.prototype.indexOf.call(buttons, button)
      if(i == 0) {
        sections[0].classList.toggle("has-expanded")
      } else {
        sections[1].classList.toggle("has-expanded")
      }
    });
  });
};


function onLoad() {
  imagesToLoad--;
  this.onload = null;
  let percent = Math.round((frameCount - imagesToLoad) / frameCount * 100 * 2)
  if(percent <= 100){
    loadingValue.textContent = percent + "%";
  }
  
  if (percent == 100) {
    infoTog();
    gsap.set(canvas, { autoAlpha: 1 });
    gsap.to(".loading-container", { 
      autoAlpha: 0,
      onComplete: function(){
        render();
        dialRotater.play();
      }
    });    
  }
}

dialNumbering();
