<template>
  <a
    href="#"
    class="btn btn-default"
    @click.prevent="$emit('toggle')"
    :disabled="disabled"
  >
    <i
      class="fa"
      :class="{
        'fa-eye-slash': visibility === 'private',
        'fa-eye': visibility === 'public'
      }"
      :title="`Visibility: ${visibility}`"
    ></i>
  </a>
</template>

<script>
export default {
  props: ["visibility", "disabled"]
};
</script>
