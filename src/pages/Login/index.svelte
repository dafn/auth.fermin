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

<style>
  #checkbox_container {
    position: relative;
    padding-left: 23px;
    user-select: none;
    margin: 5px auto 0 25px;
  }
  #checkbox_container input {
    position: absolute;
    opacity: 0;
    height: 0;
    width: 0;
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 14px;
    width: 14px;
    transition: background 0.1s ease;
    border: solid 1px #bfbfbf;
    border-radius: 3px;
  }
  #checkbox_container input:checked ~ .checkmark {
    border-color: #2185d0;
    background: #2185d0;
  }
  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
  }
  #checkbox_container input:checked ~ .checkmark:after {
    display: block;
  }
  #checkbox_container .checkmark:after {
    left: 4px;
    top: 2px;
    width: 3px;
    height: 6px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }
</style>

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
