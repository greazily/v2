gsap.registerPlugin(Draggable);


const vid = document.getElementById('video');


function onVideoLoad(){
  vid.addEventListener('loadeddata', function() {
    main();
  }, false);
};

function main(){
  // const dial = 
  let dur = vid.duration;
  
  console.log(vid.duration, vid.currentTime);

  let dialRotater = gsap.to('#dial', {
    duration: dur,
    rotation: "360_cw",
    repeat: -1,
    ease: "none",
    onUpdate: ()=> {console.log(this.progress())}
  });
  

};

onVideoLoad();