gsap.registerPlugin(Draggable);

function initialize() {
    const root = document.querySelector(":root"),
        colors = ["white", "blue", "yellow", "green", "orange", "purple"],
        circleElement = document.querySelector("#circleAnim"),
        draggableElement = document.querySelector("#dragAnim"),
        yearTextOffset = 7, // needs to be in relation to size of circle, maybe not since font is resized
        dialOffset = 90,
        videoElements = document.querySelectorAll(".video-background"),
        videoDuration = videoElements[0].duration * 0.5, // sortened !!!!!! be sure to remove !!!!!!!!
        numberOfVideos = videoElements.length,  // Renamed variable here
        totalDuration = videoDuration * numberOfVideos;  // Updated variable usage
let progressAtClick;

function createYearElements() {
    for (let i = 0; i < videoElements.length; i++) {
        const yearElement = document.createElement("div");
        const rotationAngle = -360 / numberOfVideos * i - dialOffset - yearTextOffset;  // Updated variable usage
        yearElement.textContent = videoElements[i].dataset.number;
        yearElement.classList.add("year");
        circleElement.appendChild(yearElement);
        yearElement.style.transform = `rotate(${rotationAngle}deg)`;
    }
}

    function getCombinedProgress() {
        const rotation = gsap.getProperty(draggableElement, "rotation") % 360;
        const normalizedRotation = (rotation < 0) ? rotation + 360 : rotation;
        const progressAtRotation = normalizedRotation / 360;
        const combinedProgress = progressAtRotation + progressAtClick;
        return combinedProgress;
    }

    const videoTimeline = gsap.fromTo(
        ".video-background",
        { currentTime: 0 },
        {
            duration: videoDuration,  // Updated variable usage
            currentTime: videoElements[0].duration || 1,
            stagger: videoDuration,  // Updated variable usage
        }
    );

    function updateVideoAndColor(progress) {
        videoTimeline.progress(progress);
        // this might be the issue since "show" is being removed and add on every update, maybe not
        for (let i = 0; i < videoElements.length; i++) {
            if (progress > i / numberOfVideos && progress < (i + 1) / numberOfVideos) {  // Updated variable usage
                root.style.setProperty("--color", colors[i])
                videoElements.forEach((video) => {
                    video.classList.remove("show");
                });
                videoElements[i].classList.add("show");
            }
        }
    }

    const rotationTimeline = gsap.to(circleElement, {
        duration: totalDuration,
        rotation: "360_cw",
        repeat: -1,
        ease: "none",
        onUpdate: function () {
            updateVideoAndColor(this.progress());
            // console.log(this.progress());
            // videoTimeline.progress(this.progress());
        },
    });


    Draggable.create(draggableElement, {
        type: "rotation",
        onPress: function () {
            progressAtClick = rotationTimeline.progress();
            rotationTimeline.pause();
            videoTimeline.pause();
        },
        onDrag: function () {
            rotationTimeline.progress(getCombinedProgress());
        },
        onRelease: function () {
            rotationTimeline.progress(getCombinedProgress());
            gsap.set(draggableElement, { rotation: 0 });
            rotationTimeline.play();
        },
    });
    createYearElements();
    console.log(videoDuration, numberOfVideos, totalDuration)
}

window.onload = function() {
    initialize();
};
