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

body { padding-top: 65px; }

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

/*#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}*/
</style>
