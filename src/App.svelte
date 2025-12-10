<script lang="ts">
  import UserTable from './lib/UserTable.svelte';
  import Counter from './lib/Counter.svelte';
  import './app.css';
</script>

<main>
  <h1>Welcome to SvelteKit</h1>
  <p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>
  
  <UserTable />
  
  <div class="card">
    <Counter />
  </div>

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank" rel="noreferrer">SvelteKit</a>, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">
    Click on the Vite and Svelte logos to learn more
  </p>
</main>

<style>
  .card {
    padding: 2em;
  }

  .read-the-docs {
    color: #888;
  }
</style>
