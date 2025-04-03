gsap.registerPlugin(Draggable);


const vid = document.getElementById('video');


function onVideoLoad(){
  vid.addEventListener('loadeddata', function() {
    main();
  }, false);
};


function main(){
  let dur = vid.duration,
      storedRot = 0;

  function playVid(){
    vid.play()
  };
  
  function restartVid(){
    vid.currentTime = 0;
  };
  
  function pauseVid(){
    vid.pause()
  };
  
  function resetProxy(){
    gsap.set('#proxy',{rotation: 0})
  };

  function playRot(){
    rotate.play()
  };

  function pauseRot(){
    rotate.pause()
  };

  function dragRot(){
    let combinedProg = (gsap.getProperty('#proxy', "rotation") + storedRot) % 360
    combinedProg = (combinedProg < 0) ? combinedProg + 360 : combinedProg;
    combinedProg = combinedProg / 360
    return combinedProg;
  };

  function pressRot(){
    let initialRot = 360 * rotate.progress();
    return initialRot;
  };

  function storeRot(){
    storedRot = pressRot()
  };

  function controlVidRot(){
    rotate.progress(dragRot())
    vid.currentTime = dur * dragRot()
  };

  let rotate = gsap.to('#dial', {
    duration: dur,
    rotation: "360_cw",
    repeat: -1,
    ease: "none",
    onStart: function(){
      playVid()
    },
    onRepeat: function(){
      restartVid(); 
      playVid()
    }
  });

  Draggable.create("#proxy",{
    type: "rotation",
    onPress: function(){
      pauseRot()
      pauseVid()
      storeRot()
      
    },
    onDrag: function(){
      controlVidRot()
    },
    onRelease: function(){
      playRot()
      playVid()
      resetProxy()
    }

  });

};

onVideoLoad();