<script lang="ts">
  import { theme } from '../stores';
  import { onMount } from 'svelte';

  let currentTheme: 'light' | 'dark' = 'light';
  let mounted = false;

  onMount(() => {
    mounted = true;
  });

  theme.subscribe((value) => {
    currentTheme = value;
  });

  function toggleTheme() {
    theme.update(current => current === 'light' ? 'dark' : 'light');
  }
</script>

<button 
  class="theme-toggle" 
  on:click={toggleTheme}
  aria-label="Toggle theme"
  title="Toggle between light and dark mode"
>
  {#if mounted}
    {#if currentTheme === 'light'}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="5"/>
        <path d="m12 1 1.5 3.5L17 6l-3.5 1.5L12 11l-1.5-3.5L7 6l3.5-1.5L12 1z"/>
        <path d="m12 13 1.5 3.5L17 18l-3.5 1.5L12 23l-1.5-3.5L7 18l3.5-1.5L12 13z"/>
      </svg>
    {:else}
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
    {/if}
  {:else}
    <div class="theme-placeholder"></div>
  {/if}
</button>

<style>
  .theme-toggle {
    background: none;
    border: none;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    color: var(--text-primary);
  }

  .theme-toggle:hover {
    background-color: var(--bg-hover);
    transform: scale(1.05);
  }

  .theme-toggle:focus {
    outline: 2px solid var(--accent-color);
    outline-offset: 2px;
  }

  .theme-placeholder {
    width: 20px;
    height: 20px;
  }

  @media (max-width: 768px) {
    .theme-toggle {
      padding: 6px;
    }
  }
</style>
