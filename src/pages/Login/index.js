import Page from "./index.svelte";

new Page({
  target: document.querySelector("main"),
  props: {
    title: "Log in to Fermin",
    mailPlaceholder: "Epost",
    passwordPlaceholder: "Passord",
    LogInButtonText: "Log In"
  }
});
