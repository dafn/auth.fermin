<script>
  import { onMount } from "svelte";

  const action = `${location.href}/confirm`;

  onMount(() => document.getElementById("consent_form").submit());
</script>

<form id="consent_form" {action} method="POST" />
