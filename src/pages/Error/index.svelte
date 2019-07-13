<script>
  const parameters = Array.from(
      new URLSearchParams(window.location.search).entries()
    ),
    title = parameters[0][1],
    description = parameters[1][1];

  console.log(title, description);
</script>

<style>
  #main_container {
    display: grid;
    grid-template-rows: 1fr 2fr 1fr;
    grid-template-areas:
      "top"
      "mid"
      "bottom";
    background: #ededed;
    position: absolute;
    height: 100vh;
    width: 100vw;
    top: 0;
    left: 0;
  }
  #error_container {
    grid-area: mid;
    display: grid;
    grid-template-columns: 1fr 2fr 1fr;
    grid-template-rows: 1fr 1fr 1fr;
    grid-template-areas:
      "top-left top top-right"
      "mid mid mid"
      "bottom-left bottom bottom-right";
  }
  h1 {
    grid-area: top;
    font: lighter 82px Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
    cursor: default;
    color: #333333;
    border: dotted 2px;
    border-radius: 50%;
    padding: 35px 60px;
    margin: auto;
  }
  p {
    grid-area: mid;
    cursor: default;
    font: 300 32px Lato, "Helvetica Neue", Arial, Helvetica, sans-serif;
    color: #333333;
    letter-spacing: 2px;
    margin: auto;
  }

  @media only screen and (max-width: 600px) {
    h1 {
      font-size: 58px;
      padding: 35px 55px;
    }
    p {
      font-size: 18px;
    }
  }
</style>

<section id="main_container">
  <section id="error_container">
    <h1>X</h1>
    <p>OOPS! NOTHING WAS FOUND</p>
  </section>
</section>
