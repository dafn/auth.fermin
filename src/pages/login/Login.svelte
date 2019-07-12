<script>
  import Particles from "../../components/Particles";
  import "./Login.css";

  new Particles({
    target: document.querySelector('main'),
    props: {
      id: "particles"
    }
  })

  const idInputText = "Epost",
    keyInputText = "Passord",
    LogInButtonText = "Log In",
    action = location.href,
    id = "particles";

  let mail = "";
</script>

<section>
  <form {action} method="POST">
    <img alt="fermin logo" />

    <h2>Login to Fermin</h2>

    <div id="username_container" class="input_container">
      <input
        type="text"
        name="login"
        placeholder={idInputText}
        bind:value={mail} />
    </div>

    <div id="password_container" class="input_container">
      <input type="password" name="passsword" placeholder={keyInputText} />
    </div>

    <div id="checkbox_container">
      <input type="checkbox" name="remember" value="" />
      <label for="checkbox">Remember Me</label>
    </div>

    <button>{LogInButtonText}</button>

    <input id="prompt" name="prompt" value="login" />
  </form>
</section>
