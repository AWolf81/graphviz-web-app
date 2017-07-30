function requireAll (r) {
  r.keys().forEach(r)
}

requireAll(
  require.context('../../node_modules/codemirror/theme', false, /\.css$/))
