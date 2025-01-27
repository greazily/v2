gsap.registerPlugin(Draggable);
const d = 30,
    c = document.querySelector("#circleAnim"),
    r = document.querySelector("#dragAnim"),
    dv = 4,
    yrs = document.querySelectorAll(".year"),
    compYrRotation = 8,
    video1 = document.querySelector('#video1'),
    video2 = document.querySelector('#video2'),
    prjs = [1,2];
let progressAtClick;

function placeYear(){
    for (let i = 0; i < yrs.length; i++) {
        let newR = 360/dv * (i+1) - compYrRotation;
        yrs[i].style.transform = "rotate(" + newR + "deg)"
      }
}

function init(){
    function getCombinedProgress() {
        var rotation = gsap.getProperty(r, "rotation") % 360,
            deg = (rotation < 0) ? rotation + 360 : rotation,
            progressAtDeg = 1/360 * deg,
            comProgress = progressAtDeg + progressAtClick;
        return comProgress
    }


    //clean up and fix duplicate maybe gsap.util?? array of animations
    let tweenVideo1 = gsap.fromTo(video1, 
        {
            currentTime: 0,
        },
        {
            currentTime: video1.duration || 1
        },
    ),
    tweenVideo2 = gsap.fromTo(video2, 
        {
            currentTime: 0,
        },
        {
            currentTime: video2.duration || 1
        },
    )
    let tween = gsap.to(c, {
        duration: d,
        rotation: "360_cw",
        repeat: -1,
        ease: "none",
        onUpdate: function(){
            setBackgroundColor(this.progress())
            
            // dv number of divisions
        }
    })

    tweenVideo1.pause()
    tweenVideo2.pause()

    function setBackgroundColor(progress){
        // console.log(progress)
        if(progress > 0 && progress < 1/dv){
            tweenVideo1.progress((progress * dv) % 1)
            document.body.style.backgroundColor = "red";
        } else if (progress > 1/dv && progress < 2/dv){
            tweenVideo2.progress((progress * dv) % 1)
            document.body.style.backgroundColor = "blue";
        } else if (progress > 2/dv && progress < 3/dv){
            document.body.style.backgroundColor = "green";
        } else {
            document.body.style.backgroundColor = "yellow";
        }
    }

    Draggable.create(r, {
        type: "rotation",
        onPress: function() {
            progressAtClick = tween.progress();
            tween.pause()
            tweenVideo1.pause()
            tweenVideo2.pause()

        },
        onDrag: function() {
            tween.progress(getCombinedProgress())

        },
        onRelease: function() {
            tween.progress(getCombinedProgress())
            gsap.set(r, {rotation: 0})
            tween.play()
        }
    })



}

window.onload = () => {
    init();
    placeYear();
}


