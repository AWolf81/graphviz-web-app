# Graphviz App with Vue.js

> Graphviz editor & rendering app with live updating.

Live demo is online here https://drawviz.surge.sh

To learn more about graphviz please have a look at http://www.graphviz.org/.

## Todos
- [x] Add about page - showing current version + some resource links
- [x] Fix exporting with pan & zoom (pan & zoom disabled at the moment)
- [x] Improve size calculation at Export settings (sometimes wrong size)
- [x] Push to ~~github pages~~ surge.sh
- [x] Add feature list to readme
- [ ] Add format selection setting (stored in localstorage) currently only dot rendering supported
- [x] Add download dot input text (see viz.js demo page)
- [ ] Add copy dot to clipboard
- [x] Add drafting feature - every new page will be automatically saved as draft + autosave (could be improved by reducing save freq. - at the moment every change will be save)

## Features
- Render graph with two-way binding (no render click required)
- Example graphs
- Save dot text in localstorage
- Pan & Zoom
- Export as PNG (with scaling) & SVG
- Settings saved in localstorage (just scale setting, more settings later)
- Drafting feature (similar to jsfiddle drafts)

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report

# run unit tests
npm run unit

# run e2e tests
npm run e2e

# run all tests
npm test
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
