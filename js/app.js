gsap.registerPlugin(Draggable);




function onVideoLoad(){
  var video = document.getElementById('output');
  video.src = 'vid/output-5k.webm';
  video.load();
  video.addEventListener('loadeddata', function() {
    main(video);
  }, false);
};


function main(vid){
  let 
    dur = vid.duration,
    storedRot = 0
  ;

  function infoTog(){
    const 
      sections = document.querySelectorAll('section'),
      buttons = document.querySelectorAll('button')
    ;

    buttons.forEach(button =>{
      button.addEventListener('click', function (e) {
        console.log(Array.prototype.indexOf.call(buttons, button))
        let i = Array.prototype.indexOf.call(buttons, button)
        if(i == 0) {
          sections[0].classList.toggle('has-expanded')
        } else {
          sections[1].classList.toggle('has-expanded')
        }
      });
    });


  };


  function playVid(){
    vid.play()
  };
  
  function resetVid(){
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
      playVid();
      infoTog();
    },
    onRepeat: function(){
      resetVid(); 
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