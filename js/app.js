gsap.registerPlugin(Draggable);
const d = 30,
    c = document.querySelector("#circleAnim"),
    r = document.querySelector("#dragAnim"),
    yrs = document.querySelectorAll(".year"),
    yrTxtOffset = 7,
    dialOffset = 90,
    dVideo = document.querySelector("#video"),
    videos = document.querySelectorAll(".video-background"),
    dv = videos.length,
    prjs = [1,2];
let progressAtClick;

console.log(dv, d/dv)

function placeYear(){
    for (let i = 0; i < videos.length; i++) {
        let yearElement = document.createElement("div");
        let newR = -360/dv * (i) - dialOffset - yrTxtOffset;
        yearElement.textContent = videos[i].dataset.year
        yearElement.setAttribute("class", "year")
        c.appendChild(yearElement)
        yearElement.style.transform = "rotate(" + newR + "deg)"
        console.log(videos[i].dataset.year)
        console.log(newR)
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
    let tweenVideo = gsap.fromTo(".video-background", 
        {
            currentTime: 0,
        },
        {
            duration: d/dv,
            currentTime: dVideo.duration || 1,
            stagger: d/dv
        },
    )

    let tween = gsap.to(c, {
        duration: d,
        rotation: "360_cw",
        repeat: -1,
        ease: "none",
        onUpdate: function(){
            setBackgroundColor(this.progress())
        }
    })

    function setBackgroundColor(progress){
        tweenVideo.progress(progress)

        for (let i = 0; i < videos.length; i++) {
                    if(progress > i/dv && progress < (i+1)/dv){
                        videos.forEach((video)=>{
                            video.classList.remove("show")
                        })
                        videos[i].classList.add("show")
                    }
            }
    }

    Draggable.create(r, {
        type: "rotation",
        onPress: function() {
            progressAtClick = tween.progress();
            tween.pause()
            tweenVideo.pause()

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


