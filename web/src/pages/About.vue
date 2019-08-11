<template lang="html">
  <div class="container-fluid">
    <div class="row">
      <div class="well">
        <h1>About</h1>
        <blockquote>
          Graphviz is a way to create a graph from a specification written as
          text. It's like markdown but for creating graphs. Check-out the links
          below to learn more about it.
        </blockquote>
        <p>
          This app can be used for free and if you like you can also improve the
          app by cloning/forking it at Github (see link below).
        </p>
        <p>
          It won't store or share any of your entered data with a server.
          Everything will remain client side.
        </p>
        <h2>Useful resources</h2>
        <div class="list-group">
          <a
            v-bind:key="index"
            v-for="(link, index) in links"
            :href="link.url"
            class="list-group-item"
          >
            <h4 class="list-group-item-heading">{{ link.caption }}</h4>
            <p class="list-group-item-text">{{ link.description }}</p>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      links: [
        {
          url: "https://github.com/AWolf81/graphviz-web-app",
          caption: "AWolf81/graphviz-web-app",
          description: "Github source of this app"
        },
        {
          url: "http://www.graphviz.org/gallery/",
          caption: "Graphviz gallery",
          description: "Some of the examples graphs are from this gallery"
        },
        {
          url: "https://graphviz.gitlab.io/_pages/doc/info/lang.html",
          caption: "DOT language",
          description: "Documentation of DOT language"
        },
        {
          url: "https://github.com/mdaines/viz.js/",
          caption: "mdaines/viz.js",
          description: "Source code for Viz.js (Graphviz wrapper for JS)"
        }
      ]
    };
  }
};
</script>

<style lang="css"></style>
