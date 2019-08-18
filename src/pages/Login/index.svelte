<script>
  import Particles from "../../components/Particles";
  import "./index.css";

  const src = require("../../assets/fermin-inverted.png"),
    title = "Log in to Fermin",
    mailPlaceholder = "Epost",
    passwordPlaceholder = "Passord",
    LogInButtonText = "Log In",
    action = `${location.href}/login`,
    id = "particles";

  let mail = "",
    password = "",
    checked = true,
    authenticationFailure = false;

  $: disabled = !(
    mail.includes("@") &&
    password.length >= 8 &&
    password.length <= 18
  );

  const onKeydown = e => {
    if (!disabled && e.key === "Enter") postForm();
  };

  const postForm = () => {
    fetch(action, {
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

<Particles id="particles" />

<section>
  <form {action} method="POST">
    <img alt="fermin logo" {src} />

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
        type="password"
        name="password"
        on:change={() => {
          authenticationFailure = false;
        }}
        placeholder={passwordPlaceholder}
        class:authenticationFailure
        bind:value={password} />
    </div>

    <label id="checkbox_container">
      Remember Me
      <input {checked} type="checkbox" name="remember" value="" />
      <span class="checkmark" />
    </label>

    <button class:disabled {disabled} type="button" on:click={postForm}>
      {LogInButtonText}
    </button>

    <input id="prompt" name="prompt" value="login" />
  </form>
</section>
