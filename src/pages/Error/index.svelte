<script>
  import './index.css'

  const parameters = Array.from(
      new URLSearchParams(window.location.search).entries()
    ),
    title = parameters[0][1],
    description = parameters[1][1];

  console.error("ERROR ::", title, " - ", description);
</script>

<section id="error_main_container">
  <section id="error_content_container">
    <h1 id="error_logo" >X</h1>
    <p id="error_description" >OOPS! NOTHING WAS FOUND</p>
  </section>
</section>
