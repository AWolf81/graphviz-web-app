import Hammer from "hammerjs";

// source code from pan-zoom mobile demo
export default {
  haltEventListeners: [
    "touchstart",
    "touchend",
    "touchmove",
    "touchleave",
    "touchcancel"
  ],
  init(options) {
    let instance = options.instance;
    let initialScale = 1;
    let pannedX = 0;
    let pannedY = 0;
    // Init Hammer
    // Listen only for pointer and touch events
    this.hammer = Hammer(options.svgElement, {
      inputClass: Hammer.SUPPORT_POINTER_EVENTS
        ? Hammer.PointerEventInput
        : Hammer.TouchInput
    });
    // Enable pinch
    this.hammer.get("pinch").set({ enable: true });
    // Handle double tap
    this.hammer.on("doubletap", function() {
      instance.zoomIn();
    });

    // Handle pan
    this.hammer.on("panstart panmove", function(ev) {
      // On pan start reset panned variables
      if (ev.type === "panstart") {
        pannedX = 0;
        pannedY = 0;
      }
      // Pan only the difference
      instance.panBy({ x: ev.deltaX - pannedX, y: ev.deltaY - pannedY });
      pannedX = ev.deltaX;
      pannedY = ev.deltaY;
    });
    // Handle pinch
    this.hammer.on("pinchstart pinchmove", function(ev) {
      // On pinch start remember initial zoom
      if (ev.type === "pinchstart") {
        initialScale = instance.getZoom();
        instance.zoom(initialScale * ev.scale);
      }
      instance.zoom(initialScale * ev.scale);
    });
    // Prevent moving the page on some devices when panning over SVG
    options.svgElement.addEventListener("touchmove", function(e) {
      e.preventDefault();
    });
  },
  destroy() {
    this.hammer.destroy();
  }
};
