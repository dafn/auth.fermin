<script>
  import Particles from "../../components/Particles";
  import "./index.css";

  export let title, mailPlaceholder, passwordPlaceholder, LogInButtonText;

  const logo = require("../../assets/fermin-inverted.png"),
    eye = require("../../assets/eye.svg"),
    id = "particles";

  let mail = "",
    password = "",
    checked = true,
    authenticationFailure = false,
    showPassword = false;

  $: disabled = !(
    mail.includes("@") &&
    password.length >= 8 &&
    password.length <= 18
  );

  const onKeydown = e => {
    if (!disabled && e.key === "Enter") authenticate();
  };

  const authenticate = () => {
    fetch(`${location.href}/login`, {
      method: "POST",
      body: `email=${mail}&password=${encodeURIComponent(
        password
      )}&remember=${checked}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" }
    })
      .then(response => {
        if (response.status === 406) authenticationFailure = true;
        else return response.json();
      })
      .then(data => (window.location.href = data.redirectURL))
      .catch(error => console.error("Error:", error));
  };
</script>

<svelte:window on:keydown={onKeydown} />

<Particles {id} />

<section>
  <form>
    <img id="logo" alt="fermin logo" src={logo} />

    <h2>{title}</h2>

    {#if authenticationFailure}
      <p>wrong email and / or password</p>
    {/if}

    <div id="username_container" class="input_container">
      <input
        type="text"
        name="email"
        on:change={() => {
          authenticationFailure = false;
        }}
        placeholder={mailPlaceholder}
        class:authenticationFailure
        bind:value={mail} />
    </div>

    <div id="password_container" class="input_container">
      <input
        type={showPassword ? 'text' : 'password'}
        name="password"
        on:keyup={({ target: { value } }) => {
          password = value;
          authenticationFailure = false;
        }}
        placeholder={passwordPlaceholder}
        class:authenticationFailure
        value={password} />
      <img
        id="eye"
        src={eye}
        alt="eye"
        on:click={() => {
          showPassword = !showPassword;
        }}
        class:showPassword />
    </div>

    <label id="checkbox_container">
      Remember Me
      <input {checked} type="checkbox" name="remember" value="" />
      <span class="checkmark" />
    </label>

    <button class:disabled {disabled} type="button" on:click={authenticate}>
      {LogInButtonText}
    </button>

    <input id="prompt" name="prompt" value="login" />
  </form>
</section>
