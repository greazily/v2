gsap.registerPlugin(Draggable);

const indicator = document.getElementById("indicator");
const header = document.getElementById("header");
let headerHeight = header.getBoundingClientRect().height;

indicator.t1 = gsap.timeline({
  onStart() {
    console.log('start');
  },
  onUpdate() {
    // console.log(this.progress())
  },
  onComplete() {
    this.restart()
    console.log('complete');
  }
})
.to("#indicator", {
  duration: 100,
  y: headerHeight,
  ease: "none"
});

const proxy = document.createElement("div");

Draggable.create(proxy, {
  type: 'y',
  trigger: indicator,
  onDragStart: function() {
    indicator.t1.pause();
  },
  onDrag: function() {
    indicator.t1.progress(this.y/headerHeight);
  },
  onDragEnd: function() {
    indicator.t1.play();
  },
  onPress: function() {
    gsap.set(this.target, {
      y: indicator.t1.progress() * headerHeight
    });
    this.update();
  },
  bounds: { minY: 0, maxY: headerHeight },
});
