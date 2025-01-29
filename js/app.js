gsap.registerPlugin(Draggable);

console.clear()

let loadingValue = document.querySelector(".loading-value");
let canvas = document.querySelector("#canvas");
let dial = document.querySelector(".dial");
let context = canvas.getContext("2d");
let frameCount = 773;
let frameRate = 30;
let images = []
let airpods = {
  frame: 0
};
let imagesToLoad = frameCount;
// let progression = 0.01


canvas.width = 1024;
canvas.height = 1024;

let currentFrame = index => (
    `/img/seq/${(index + 1).toString().padStart(4, '0')}.webp`
);

for (let i = 0; i < frameCount; i++) {
    const img = new Image();
    img.onload = onLoad;
    img.src = currentFrame(i);
    images.push(img);
}


function createProjectNumbers() {
    let dialOffset = 90;
    let textOffset = 7;
    let framesPerProject = 154.6;
    let numberOfProjects = frameCount / framesPerProject;

    for (let i = 0; i < numberOfProjects; i++) {
        const projectNumber = document.createElement("div");
        const rotationAngle = -360 / numberOfProjects * i - dialOffset - textOffset;  // Updated variable usage
        // projectNumber.textContent = `P${(i + 1).toString().padStart(3, '0')}`;
        projectNumber.textContent = `P${i + 1}`;
        projectNumber.classList.add("project-number");
        dial.appendChild(projectNumber);
        projectNumber.style.transform = `rotate(${rotationAngle}deg)`;
    }
}

createProjectNumbers();


function onLoad() {
  imagesToLoad--;
  this.onload = null;  
  loadingValue.textContent = Math.round((frameCount - imagesToLoad) / frameCount * 100) + "%";


  if (!imagesToLoad) {
    render();
    gsap.to(".loading-container", { autoAlpha: 0, duration: 1, onComplete: function(){
        createProjectNumbers();
        gsap.to(canvas, { autoAlpha: 1, duration: 1, onComplete: initializeAnimation});
    }
    });
        
  }
}

function initializeAnimation(){
    let initialProgress = 0;
    let dragProxy = document.querySelector(".proxy");

    function getCombinedProgress(progressAtClick) {
        let rotation = gsap.getProperty(dragProxy, "rotation") % 360;
        let normalizedRotation = (rotation < 0) ? rotation + 360 : rotation;
        let addedInitialRotation = normalizedRotation + progressAtClick;
        let progressAtRotation = addedInitialRotation / 360;
        return progressAtRotation ;  
    }

    let imageSequencer = gsap.to(airpods, {
      frame: frameCount - 1,
      snap: "frame",
      duration: frameCount/frameRate,
      ease: "none",
      onUpdate: render // use animation onUpdate instead of scrollTrigger's onUpdate
    });
    imageSequencer.pause()
    
    let dialRotater = gsap.to(dial, {
      duration: frameCount/frameRate,
      rotation: "360_cw",
      repeat: -1,
      ease: "none",
      onUpdate: function(){
        imageSequencer.progress(this.progress())
      }
    })
    
    function getInitialProgress(){
      let iP = gsap.getProperty(dial, "rotation");
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

