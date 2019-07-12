<script>
  import { onMount } from "svelte";
  import "particles.js";

  export let id;

  onMount(() => window.particlesJS.load(id, "assets/particles.json"));
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
