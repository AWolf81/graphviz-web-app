<template>
  <div id="app">
    <!-- <img src="./assets/logo.png"> -->
    <router-view :key="$route.path"></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="scss">
$icon-font-path: '~bootstrap-sass/assets/fonts/bootstrap/';
@import '~bootstrap-sass/assets/stylesheets/_bootstrap.scss';
@import "~nanoscroller/bin/css/nanoscroller.css";

$spacing: 8px; // spacing between render and definition

body { padding-top: 60px; }

textarea {
  width: 100%;
  min-height: 200px;
  padding-bottom: 10px;
  font-family: "Lucida Console", Monaco, monospace
}

footer {
  font-size: 0.9em;
  text-align: right;
}

.btn-group {
  padding-bottom: 0.5em;
}

.col-md-4 {
  padding-left: $spacing;
  padding-right: $spacing;
  padding-bottom: $spacing;
}
.col-md-8 {
  padding-left: 0;
  padding-right: $spacing;
}

.nano {
  /*background: #bba; */
  height: 300px;
}
.nano > .nano-content { padding: 10px; }
.nano > .nano-pane   {
  background: #e1f5fe;
  width: 5px;
}
.nano > .nano-pane > .nano-slider {
  background: #467a93;
  /*#111; */
}
/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
