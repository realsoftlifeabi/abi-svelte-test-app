<script lang="ts">
  import UserTable from './lib/UserTable.svelte';
  import { fade } from 'svelte/transition';
  import './app.css';
</script>

<main>
  <div class="dashboard-header" transition:fade>
    <h1>User Management Dashboard</h1>
    <p class="subtitle">Manage your users easily</p>
  </div>
  
  <UserTable />
</main>

<style>
  .dashboard-header {
    text-align: center;
    margin-bottom: 2rem;
    padding: 2rem 1rem;
  }

  h1 {
    margin: 0 0 0.5rem 0;
    color: var(--text-primary);
    font-size: 2.5rem;
    font-weight: 700;
  }

  .subtitle {
    margin: 0;
    color: var(--text-secondary);
    font-size: 1.1rem;
    font-weight: 400;
  }

  @media (max-width: 768px) {
    .dashboard-header {
      padding: 1rem;
      margin-bottom: 1rem;
    }

    h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }
</style>
