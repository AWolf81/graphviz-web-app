<template>
  <div class="container-fluid">
    <div class="row" v-if="user">
        <div class="well">
            <h1>Dashboard from {{user.username}}</h1>
            <h2>Graphs (saved in cloud)</h2>
            <div v-if="loadingDotfiles">
              loading...
            </div>
            <div v-else>
              <div class="list-group" v-if="dotfiles && dotfiles.length > 0">
              <router-link :to="`/${dot.metadata.ghUser}/${dot.slug}`" 
                class="list-group-item" 
                v-for="dot in dotfiles" :key="dot['_id']">
                    <h3>{{dot.title}}</h3>
                    <p><span v-html="dot.content"></span>{{formatDate(dot.created_at)}}</p>
                    <!--<pre>{{dot}}</pre>-->
                </router-link>
              </div>
              <div class="alert alert-info" v-else>
                No graph saved yet.
              </div>
            </div>
            <h2>Graphs (saved locally)</h2>
            <div class="list-group">
              <router-link :to="`/${graph.slug}`" 
                class="list-group-item" 
                v-for="(graph, key, index) in storedGraphs" :key="index">
                  <h3>{{graph.name}}</h3>
                  <p>{{formatDate(graph.createdAt)}}</p>
                </router-link>
            </div>
            <pre>{{JSON.stringify(dotfiles, null, 2)}}</pre>
        </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
// import gql from 'graphql-tag'
import axios from 'axios'
import {formatDate} from '../helpers/date'
// import localGraphStorage from './LocalGraphStorage'
// import Cosmic from 'cosmicjs'

export default {
  /*
  apollo: {
    // Simple query that will update the 'hello' vue property
    hello: gql`{objects: objectsByType(bucket_slug: "8daee320-4d88-11e8-a743-1fe133019f0d", read_key: "I24grSLDE1eiKrPEn2qIcTGX6kUhpRgec7MbZDGSx2gIbHfzfh", limit: 4, type_slug: "dotfiles") {
            title
            type_slug
        }
    }`
  }, */
  async created () {
    /*
    // direct fetch
    const api = Cosmic()
    const bucket = api.bucket({
      slug: '8daee320-4d88-11e8-a743-1fe133019f0d'
    })
    const data = await bucket.getObjects()
    console.log('data', data) */
    const {data} = await axios.get('/.netlify/functions/data')
    console.log(data)
    this.dotfiles = data.dotfiles
    this.loadingDotfiles = false
  },
  computed: {
    ...mapState({
      user: state => state.auth.user,
      storedGraphs: state => state.storedGraphs
    })
  },
  data () {
    return {
      dotfiles: undefined,
      loadingDotfiles: true
    }
  },
  methods: {
    formatDate
  }
}
</script>
