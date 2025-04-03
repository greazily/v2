gsap.registerPlugin(Draggable);


const vid = document.getElementById('video');


function onVideoLoad(){
  vid.addEventListener('loadeddata', function() {
    main();
  }, false);
};

function main(){
  
  console.log(vid.duration, vid.currentTime);
  

};

onVideoLoad();