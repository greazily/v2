gsap.registerPlugin(Draggable);

const indicator = document.getElementById("indicator");
const header = document.getElementById("header");
let headerHeight = header.getBoundingClientRect().height;

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




indicator.t1 = gsap.timeline({
  onStart() {
    console.log('start');
  },
  onUpdate() {
    // console.log(this.progress())
  },
  onComplete() {
    this.restart()
    console.log('complete');
  }
})
.to("#indicator", {
  duration: 100,
  y: headerHeight,
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
    indicator.t1.progress(this.y/headerHeight);
  },
  onDragEnd: function() {
    indicator.t1.play();
  },
  onPress: function() {
    gsap.set(this.target, {
      y: indicator.t1.progress() * headerHeight
    });
    this.update();
  },
  bounds: { minY: 0, maxY: headerHeight },
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
        render();
        indicator.t1.play();
      }
    });    
  }
}