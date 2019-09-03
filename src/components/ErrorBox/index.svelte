<script>
  import "./index.css";

  export let className = "",
    title,
    description;
</script>

<section class={`${className} infobox_error_container`}>
  <h1 class="infobox_error_title">{title}</h1>
  <p class="infobox_error_description">{description}</p>
</section>
