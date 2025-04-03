gsap.registerPlugin(Draggable);


const vid = document.getElementById('video');


function onVideoLoad(){
  vid.addEventListener('loadeddata', function() {
    main();
  }, false);
};

function play(){
  vid.play()
};

function restart(){
  vid.currentTime = 0;
};

function pause(){
  vid.pause()
};


function main(){
  let dur = vid.duration;
  
  console.log(vid.duration, vid.currentTime);

  let rotate = gsap.to('#dial', {
    duration: dur,
    rotation: "360_cw",
    repeat: -1,
    ease: "none",
    onStart: function(){
      play()
    },
    onRepeat: function(){
      restart(); 
      play()
    }
  });

  Draggable.create("#proxy",{
    type: "rotation",
    onPress: function(){
      rotate.pause()
      pause()
    },
    onDrag: function(){
      
    },
    onRelease: function(){
      rotate.play()
      play()
    }
    // ,
    // onDrag: function(){
    //   dialRotater.progress(getCombinedProgress(initialProgress))
    // },
    // onRelease: function(){
    //   gsap.set(dragProxy,{rotation: 0})
    //   dialRotater.play()
    // }
  })

  
    // onUpdate: function(){
    //   console.log(rotate.progress())
    //   vid.currentTime = 33 * rotate.progress()
    // }
  

};

onVideoLoad();