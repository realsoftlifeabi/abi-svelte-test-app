<script lang="ts">
  import { users, nextId } from '../stores';
  import type { User, FormData } from '../types';
  
  let searchTerm = '';
  let filteredUsers: User[] = [];
  let showModal = false;
  let showDeleteConfirm = false;
  let isEditMode = false;
  let editingUserId: number | null = null;
  let deletingUserId: number | null = null;
  let formData: FormData = {
    name: '',
    email: '',
    role: 'User'
  };
  let usersList: User[] = [];
  let currentNextId = 5;

  users.subscribe((value: User[]) => {
    usersList = value;
  });

  nextId.subscribe((value: number) => {
    currentNextId = value;
  });

  $: filteredUsers = usersList.filter((user: User) => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  function handleEdit(userId: number) {
    const user = usersList.find((u: User) => u.id === userId);
    if (user) {
      isEditMode = true;
      editingUserId = userId;
      formData = { ...user };
      showModal = true;
    }
  }

  function handleDelete(userId: number) {
    deletingUserId = userId;
    showDeleteConfirm = true;
  }

  function openModal() {
    isEditMode = false;
    editingUserId = null;
    showModal = true;
    formData = { name: '', email: '', role: 'User' };
  }

  function closeModal() {
    showModal = false;
    isEditMode = false;
    editingUserId = null;
    formData = { name: '', email: '', role: 'User' };
  }

  function handleSubmit() {
    if (formData.name && formData.email && formData.role) {
      if (isEditMode && editingUserId) {
        // Update existing user
        users.update((currentUsers: User[]) => 
          currentUsers.map((user: User) => 
            user.id === editingUserId 
              ? { ...user, ...formData }
              : user
          )
        );
      } else {
        // Add new user
        const newId = currentNextId;
        nextId.update((n: number) => n + 1);
        users.update((currentUsers: User[]) => [...currentUsers, { id: newId, ...formData }]);
      }
      closeModal();
    }
  }

  function confirmDelete() {
    if (deletingUserId) {
      users.update((currentUsers: User[]) => currentUsers.filter((user: User) => user.id !== deletingUserId));
      closeDeleteConfirm();
    }
  }

  function closeDeleteConfirm() {
    showDeleteConfirm = false;
    deletingUserId = null;
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeModal();
    }
  }
</script>

<div class="user-table-container">
  <div class="header-actions">
    <h2>User Management</h2>
    <button class="btn btn-primary" on:click={openModal}>
      Add New User
    </button>
  </div>

  <div class="search-container">
    <input
      type="text"
      placeholder="Search by name or email..."
      bind:value={searchTerm}
      class="search-input"
    />
    {#if searchTerm}
      <button class="btn btn-secondary btn-sm" on:click={() => searchTerm = ''}>
        Clear
      </button>
    {/if}
  </div>
  <table class="user-table">
    <thead>
      <tr>
        <th>Name</th>
        <th>Email</th>
        <th>Role</th>
        <th>Actions</th>
      </tr>
    </thead>
    <tbody>
      {#each filteredUsers as user (user.id)}
        <tr>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>
            <span class="role-badge role-{user.role.toLowerCase()}">
              {user.role}
            </span>
          </td>
          <td class="actions">
            <button 
              class="btn btn-edit" 
              on:click={() => handleEdit(user.id)}
            >
              Edit
            </button>
            <button 
              class="btn btn-delete" 
              on:click={() => handleDelete(user.id)}
            >
              Delete
            </button>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>

  {#if filteredUsers.length === 0 && searchTerm}
    <div class="no-results">
      <p>No users found matching "{searchTerm}"</p>
    </div>
  {/if}
</div>

<!-- Modal -->
{#if showModal}
  <div 
    class="modal-backdrop" 
    role="dialog" 
    aria-modal="true"
    aria-labelledby="modal-title"
    tabindex="-1"
    on:click={handleBackdropClick}
    on:keydown={(e) => e.key === 'Escape' && closeModal()}
  >
    <div class="modal">
      <div class="modal-header">
        <h3 id="modal-title">{isEditMode ? 'Edit User' : 'Add New User'}</h3>
        <button class="modal-close" on:click={closeModal} aria-label="Close modal">×</button>
      </div>
      
      <form class="modal-form" on:submit|preventDefault={handleSubmit}>
        <div class="form-group">
          <label for="name">Name</label>
          <input
            id="name"
            type="text"
            bind:value={formData.name}
            placeholder="Enter name"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            bind:value={formData.email}
            placeholder="Enter email"
            required
          />
        </div>
        
        <div class="form-group">
          <label for="role">Role</label>
          <select id="role" bind:value={formData.role} required>
            <option value="User">User</option>
            <option value="Admin">Admin</option>
            <option value="Editor">Editor</option>
          </select>
        </div>
        
        <div class="modal-actions">
          <button type="button" class="btn btn-secondary" on:click={closeModal}>
            Cancel
          </button>
          <button type="submit" class="btn btn-primary">
            {isEditMode ? 'Update User' : 'Add User'}
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if showDeleteConfirm}
  <div 
    class="modal-backdrop" 
    role="dialog" 
    aria-modal="true"
    aria-labelledby="delete-title"
    tabindex="-1"
    on:keydown={(e) => e.key === 'Escape' && closeDeleteConfirm()}
  >
    <div class="modal modal-sm">
      <div class="modal-header">
        <h3 id="delete-title">Confirm Delete</h3>
        <button class="modal-close" on:click={closeDeleteConfirm} aria-label="Close modal">×</button>
      </div>
      
      <div class="modal-content">
        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
      </div>
      
      <div class="modal-actions">
        <button type="button" class="btn btn-secondary" on:click={closeDeleteConfirm}>
          Cancel
        </button>
        <button type="button" class="btn btn-delete" on:click={confirmDelete}>
          Delete User
        </button>
      </div>
    </div>
  </div>
{/if}

<style>
  .user-table-container {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }

  .header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }

  .search-container {
    display: flex;
    gap: 12px;
    margin-bottom: 20px;
    align-items: center;
  }

  .search-input {
    flex: 1;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .search-input:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .btn-sm {
    padding: 8px 12px;
    font-size: 12px;
  }

  .no-results {
    text-align: center;
    padding: 40px 20px;
    color: #6b7280;
  }

  .no-results p {
    margin: 0;
    font-size: 16px;
  }

  h2 {
    margin: 0;
    color: #333;
    font-size: 24px;
  }

  .user-table {
    width: 100%;
    border-collapse: collapse;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }

  .user-table th,
  .user-table td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid #e5e7eb;
  }

  .user-table th {
    background-color: #f9fafb;
    font-weight: 600;
    color: #374151;
    border-bottom: 2px solid #e5e7eb;
  }

  .user-table tbody tr:hover {
    background-color: #f9fafb;
  }

  .user-table tbody tr:last-child td {
    border-bottom: none;
  }

  .role-badge {
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 500;
    text-transform: uppercase;
  }

  .role-admin {
    background-color: #fef3c7;
    color: #92400e;
  }

  .role-user {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .role-editor {
    background-color: #d1fae5;
    color: #065f46;
  }

  .actions {
    display: flex;
    gap: 8px;
  }

  .btn {
    padding: 6px 12px;
    border: none;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    font-weight: 500;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  .btn-edit {
    background-color: #3b82f6;
    color: white;
  }

  .btn-edit:hover {
    background-color: #2563eb;
  }

  .btn-delete {
    background-color: #ef4444;
    color: white;
  }

  .btn-delete:hover {
    background-color: #dc2626;
  }

  .btn-primary {
    background-color: #10b981;
    color: white;
  }

  .btn-primary:hover {
    background-color: #059669;
  }

  .btn-secondary {
    background-color: #6b7280;
    color: white;
  }

  .btn-secondary:hover {
    background-color: #4b5563;
  }

  /* Modal Styles */
  .modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
  }

  .modal {
    background: white;
    border-radius: 8px;
    width: 90%;
    max-width: 500px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e5e7eb;
  }

  .modal-header h3 {
    margin: 0;
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }

  .modal-close {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6b7280;
    padding: 0;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .modal-close:hover {
    color: #374151;
  }

  .modal-content {
    padding: 0 24px 20px;
  }

  .modal-content p {
    margin: 0;
    color: #6b7280;
    line-height: 1.5;
  }

  .modal-sm {
    max-width: 400px;
  }

  .modal-form {
    padding: 24px;
  }

  .form-group {
    margin-bottom: 20px;
  }

  .form-group label {
    display: block;
    margin-bottom: 6px;
    font-weight: 500;
    color: #374151;
    font-size: 14px;
  }

  .form-group input,
  .form-group select {
    width: 100%;
    padding: 10px 12px;
    border: 1px solid #d1d5db;
    border-radius: 6px;
    font-size: 14px;
    transition: border-color 0.2s;
  }

  .form-group input:focus,
  .form-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
  }

  .modal-actions {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 24px;
  }

  @media (max-width: 768px) {
    .header-actions {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;
    }

    .search-container {
      flex-direction: column;
      align-items: stretch;
    }

    .modal {
      width: 95%;
      margin: 20px;
      max-height: 85vh;
    }

    .modal-form {
      padding: 20px;
    }

    .modal-actions {
      flex-direction: column;
    }

    .user-table-container {
      padding: 10px;
    }

    .user-table th,
    .user-table td {
      padding: 8px 12px;
      font-size: 14px;
    }

    .actions {
      flex-direction: column;
      gap: 4px;
    }

    .btn {
      padding: 4px 8px;
      font-size: 12px;
    }

    .role-badge {
      font-size: 10px;
      padding: 2px 8px;
    }
  }

  @media (max-width: 480px) {
    .user-table-container {
      padding: 5px;
    }

    h2 {
      font-size: 20px;
    }

    .user-table th,
    .user-table td {
      padding: 6px 8px;
      font-size: 12px;
    }

    .search-input {
      font-size: 14px;
    }

    .modal-header {
      padding: 16px 20px;
    }

    .modal-form {
      padding: 16px;
    }

    .form-group input,
    .form-group select {
      padding: 8px 10px;
      font-size: 14px;
    }
  }
</style>
