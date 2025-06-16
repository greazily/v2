gsap.registerPlugin(Draggable);

const indicator = document.getElementById("indicator");
const work = document.getElementById("work");
let workHeight = work.getBoundingClientRect().height;

let loadingValue = document.querySelector(".loading-value");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
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

function render() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.drawImage(images[sequence.frame], 0, 0);
}

let imageSequencer = gsap.to(sequence, {
  frame: frameCount,
  snap: "frame",
  ease: "none",
  paused: true,
  onUpdate: render 
});

indicator.t1 = gsap.timeline({
  paused: true,
  repeat: -1, 
  onStart() {
    console.log('start')
  },
  onUpdate() {
    imageSequencer.progress(this.progress());
  },
  onComplete() {
    console.log('complete', images);
  }
})
.to("#indicator", {
  duration: frameCount/30,
  y: workHeight,
  ease: "none"
});

const proxy = document.createElement("div");

Draggable.create(proxy, {
  type: 'y',
  trigger: indicator,
  onDragStart: function() {
    indicator.t1.pause();
  },
  onDrag: function() {
    //temporary fix that works but sends an error
    if(this.y/workHeight > 0.999) {
      indicator.t1.progress(0.999)
    } else if (this.y/workHeight < 0.001){
      indicator.t1.progress(0.01)
    } else {
      indicator.t1.progress(this.y/workHeight);
    }
    console.log(this.y/workHeight);
  },
  onDragEnd: function() {
      indicator.t1.play();

  },
  onPress: function() {
    gsap.set(this.target, {
      y: indicator.t1.progress() * workHeight
    });
    this.update();
  },
  bounds: { minY: 0, maxY: workHeight },
});

function onLoad() {
  imagesToLoad--;
  this.onload = null;
  let percent = Math.round((frameCount - imagesToLoad) / frameCount * 100 * 2)
  if(percent <= 100){
    loadingValue.textContent = percent + "%";
  }
  
  if (percent == 100) {
    gsap.set(canvas, { autoAlpha: 1 });
    gsap.to(".loading-container", { 
      autoAlpha: 0,
      onComplete: function(){
        indicator.t1.play();
      }
    });    
  }
}