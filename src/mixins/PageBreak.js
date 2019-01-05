export default {
  data() {
    return {
      screenWidth: document.documentElement.clientWidth
    };
  },
  computed: {
    largeScreen() {
      return this.screenWidth > 768 - 17; // 751; // 17px = 15px for padding + 2px for borders (1 on each side) --> couldn't change this with css - so it could be from something else
      // 748 px --> page break happend
      // 766 px --> handle ok
      // 756 px --> no handle
      // 752 px --> no handle
      // 750 px --> OK, pagebreak
      // --> better but how to restore previous pane width
    }
  },
  // bind event handlers to the `handleResize` method (defined below)
  mounted: function() {
    window.addEventListener("resize", this.handleResize);
  },
  beforeDestroy: function() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    // whenever the document is resized, re-set the 'fullHeight' variable
    handleResize() {
      this.screenWidth = document.documentElement.clientWidth;
    }
  }
};
