gsap.registerPlugin(Draggable);

console.clear()

let loadingValue = document.querySelector(".loading-value");
let canvas = document.querySelector("#canvas");
let context = canvas.getContext("2d");
let dragProxy = document.querySelector(".proxy");
let frameRate = 30;
let framesPerProject = 0;   // use to get number of projects for creating project
let initialProgress = 0;


canvas.width = 1024;
canvas.height = 1024;

let frameCount = 773;
let currentFrame = index => (
  `/img/seq/${(index + 1).toString().padStart(4, '0')}.webp`
);

let progression = 0.01
let images = []
let airpods = {
  frame: 0
};

let imagesToLoad = frameCount;

for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.onload = onLoad;
  img.src = currentFrame(i);
  images.push(img);
}

function getCombinedProgress(progressAtClick) {
  let rotation = gsap.getProperty(dragProxy, "rotation") % 360;
  let normalizedRotation = (rotation < 0) ? rotation + 360 : rotation;
  let addedInitialRotation = normalizedRotation + progressAtClick;
  let progressAtRotation = addedInitialRotation / 360;
  return progressAtRotation ;

}

function onLoad() {
  imagesToLoad--;
  this.onload = null;  
  loadingValue.textContent = Math.round((frameCount - imagesToLoad) / frameCount * 100) + "%"
    
  if (!imagesToLoad) {
    render();
    gsap.set(canvas, { autoAlpha: 1 });
    gsap.to(".loading-container", { autoAlpha: 0 });
    initializeAnimation();    
  }
}

function initializeAnimation(){
    let imageSequencer = gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      duration: frameCount/frameRate,
      ease: "none",
      onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
    });
    imageSequencer.pause()
    
    let dialRotater = gsap.to(".dial", {
      duration: frameCount/frameRate,
      rotation: "360_cw",
      repeat: -1,
      ease: "none",
      onUpdate: function(){
        imageSequencer.progress(this.progress())
      }
    })
    
    function getInitialProgress(){
      let iP = gsap.getProperty(".dial", "rotation");
      return iP
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
}

function render() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(images[airpods.frame], 0, 0); 
  }

