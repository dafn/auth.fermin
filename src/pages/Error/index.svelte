<script>
  import ErrorBox from "components/ErrorBox";
  import "./index.css";

  const { error, error_description } = window.provider_error_data;
</script>

<section id="error_main_container">
  <section id="error_content_container">
    <h1 id="error_logo">X</h1>
    <p id="error_description">OOPS! NOTHING WAS FOUND</p>
  </section>
</section>

<ErrorBox
  title={error}
  description={error_description}
  className="error_infobox" />
