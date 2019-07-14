<script>
  import Particles from "../../components/Particles";
  import "./index.css";

  const src = require("../../assets/fermin-inverted.png"),
    title = "Log in to Fermin",
    mailPlaceholder = "Epost",
    passwordPlaceholder = "Passord",
    LogInButtonText = "Log In",
    action = location.href + "/login",
    id = "particles";

  let mail = "",
    password = "",
    checked = true;

  $: disabled = !(
    mail.includes("@") &&
    password.length >= 8 &&
    password.length <= 18
  );

  new Particles({
    target: document.querySelector("main"),
    props: {
      id: "particles"
    }
  });
</script>

<section>
  <form {action} method="POST">
    <img alt="fermin logo" {src} />

    <h2>{title}</h2>

    <div id="username_container" class="input_container">
      <input
        type="text"
        name="email"
        placeholder={mailPlaceholder}
        bind:value={mail} />
    </div>

    <div id="password_container" class="input_container">
      <input
        type="password"
        name="password"
        placeholder={passwordPlaceholder}
        bind:value={password} />
    </div>

    <label id="checkbox_container">
      Remember Me
      <input {checked} type="checkbox" name="remember" value="" />
      <span class="checkmark" />
    </label>

    <button class:disabled {disabled}>{LogInButtonText}</button>

    <input id="prompt" name="prompt" value="login" />
  </form>
</section>
