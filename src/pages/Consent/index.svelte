<script>
  import { onMount } from "svelte";

  let form;
  const action = `${location.href}/confirm`;

  onMount(() => form.submit());
</script>

<form id="consent_form" bind:this={form} {action} method="POST" />
