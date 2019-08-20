<!-- TODO: Make a funny and clever error page -->

<script>
  import "./index.css";

  const { error, error_description } = JSON.parse(document.getElementById("error_data").innerHTML)

</script>

<section id="error_main_container">
  <section id="error_content_container">
    <h1 id="error_logo">X</h1>
    <p id="error_description">OOPS! NOTHING WAS FOUND</p>
  </section>
</section>
