<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { fly } from 'svelte/transition';

  export let type: 'success' | 'error' | 'warning' | 'info' = 'info';
  export let message: string = '';
  export let duration: number = 3000;
  export let dismissible: boolean = true;

  const dispatch = createEventDispatcher();
  let visible = true;

  function dismiss() {
    visible = false;
    setTimeout(() => {
      dispatch('dismiss');
    }, 300);
  }

  // Auto-dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      if (visible) dismiss();
    }, duration);
  }
</script>

{#if visible}
  <div 
    class="alert alert-{type}" 
    role="alert"
    transition:fly={{ x: 100, duration: 300 }}
    on:introend={() => visible = true}
  >
    <div class="alert-content">
      <div class="alert-icon">
        {#if type === 'success'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        {:else if type === 'error'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        {:else if type === 'warning'}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        {:else}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="16" x2="12" y2="12"/>
            <line x1="12" y1="8" x2="12.01" y2="8"/>
          </svg>
        {/if}
      </div>
      <span class="alert-message">{message}</span>
    </div>
    {#if dismissible}
      <button class="alert-close" on:click={dismiss} aria-label="Dismiss alert">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 6L6 18M6 6l12 12"/>
        </svg>
      </button>
    {/if}
  </div>
{/if}

<style>
  .alert {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    border-radius: 8px;
    margin-bottom: 16px;
    box-shadow: var(--shadow-sm);
    border: 1px solid transparent;
    transition: all 0.2s ease;
  }

  .alert-content {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
  }

  .alert-icon {
    flex-shrink: 0;
  }

  .alert-message {
    font-size: 14px;
    font-weight: 500;
  }

  .alert-close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    border-radius: 4px;
    color: currentColor;
    opacity: 0.7;
    transition: opacity 0.2s;
  }

  .alert-close:hover {
    opacity: 1;
  }

  .alert-success {
    background-color: var(--success-color);
    color: white;
    border-color: var(--success-color);
  }

  .alert-error {
    background-color: var(--danger-color);
    color: white;
    border-color: var(--danger-color);
  }

  .alert-warning {
    background-color: var(--warning-color);
    color: white;
    border-color: var(--warning-color);
  }

  .alert-info {
    background-color: var(--accent-color);
    color: white;
    border-color: var(--accent-color);
  }

  @media (max-width: 768px) {
    .alert {
      padding: 10px 12px;
    }

    .alert-message {
      font-size: 13px;
    }
  }
</style>
