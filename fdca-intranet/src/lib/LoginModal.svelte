<!-- LoginModal.svelte -->
<script lang="ts">
    export let showModal: boolean = true;
    export let onLogin: Function;

    let username = '';
    let password = '';

    const handleSubmit = () => {
        if (onLogin && typeof onLogin === 'function') {
            onLogin({ username, password });
        }
    };
</script>

{#if showModal}
<div class="modal-backdrop">
    <div class="modal">
        <div class="modal-header">
            <h2>Login</h2>
        </div>
        <div class="modal-body">
            <form on:submit|preventDefault={handleSubmit}>
                <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" bind:value={username} placeholder="Your username" required>
                </div>
                <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" bind:value={password} placeholder="Your password" required>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn">Login</button>
                </div>
            </form>
        </div>
    </div>
</div>
{/if}

<style>
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
    }

    .modal {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 300px;
    }

    .form-group + .form-group {
        margin-top: 10px;
    }

    .btn {
        margin-top: 20px;
        display: inline-block;
        padding: 10px 20px;
        background-color: #007bff;
        color: white;
        border: none;
        cursor: pointer;
        border-radius: 5px;
    }

    .modal-header h2 {
        margin: 0;
    }
</style>