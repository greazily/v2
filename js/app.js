gsap.registerPlugin(Draggable);


const vid = document.getElementById('video');


function onVideoLoad(){
  vid.addEventListener('loadeddata', function() {
    main();
  }, false);
};


function main(){
  let 
    dur = vid.duration,
    storedRot = 0
  ;

  function infoTog(){
    const 
      infos = document.querySelectorAll('.info-container'),
      buttons = document.querySelectorAll('.info-button')
    ;

    infos.forEach((info) => {
      info.classList.add('closed');
      console.log('fire')
    });

    buttons.forEach((button)=>{
      button.addEventListener('click', function (e) {
        console.log(this.className, this.parentNode)
        this.parentNode.classList.toggle('open')
        this.querySelector('.arrow').classList.toggle('open')

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

// LOOPING VIDEO SECTION CODE
// 
// videojs('vid').ready(function () {
//   this.on('timeupdate', onVideoTimeupdate );
// });

// function onVideoTimeupdate() {
//   var loopStart = parseFloat(document.getElementById('loopStart').value);
//   var loopEnd = parseFloat(document.getElementById('loopEnd').value);
//   var loopEnabled = document.getElementById('loopEnabled').checked;

//   if(loopEnabled){
//     if (this.currentTime() < loopStart || this.currentTime() >= loopEnd ) {
//       this.currentTime( loopStart );
//     }
//   }
// }