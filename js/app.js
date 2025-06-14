gsap.registerPlugin(Draggable);

console.clear()

let loadingValue = document.querySelector(".loading-value");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let dragProxy = document.querySelector(".proxy");
let dial = document.querySelector(".dial");
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



let imageSequencer = gsap.to(sequence, {
  frame: frameCount,
  snap: "frame",
  ease: "none",
  paused: true,
  onUpdate: render 
});

let dialRotater = gsap.to(dial, {
  duration: frameCount/60,
  top: "calc(100% - 1px)",
  repeat: -1,
  ease: "none",
  paused: true,
  onUpdate: function(){
    imageSequencer.progress(this.progress());
  }
});

function getInitialProgress(){
  let iP = gsap.getProperty(dial, "rotation");
  return iP
};

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[sequence.frame], 0, 0); 
}

Draggable.create(dragProxy,{
  type: "y",
  bounds: ".drag-container",
  onPress: function(){
    dialRotater.pause();
  },
  onDrag: function() {
    console.log(dial.style.top, dragProxy.style.transform)
    // dial.style.top = ()
  },
  onRelease: function() {
    dialRotater.play();
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