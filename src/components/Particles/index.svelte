<script>
  import { onMount } from "svelte";
  import config from '../../config/particles.config.js'
  import "./particles.js";

  export let id;

  onMount(() => window.particlesJS.load(id, config));
</script>

<style>
  figure {
    position: absolute;
    min-height: 100vh;
    min-width: 100vw;
    margin: 0;
  }
</style>

<figure {id} />
