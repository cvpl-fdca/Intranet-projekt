<script>
  /**
	 * @type {any}
	 */
   export let header
  /**
	 * @type {any}
	 */
   export let align
</script>

{#if header}
  <th {align}><slot></slot></th>
{:else}
  <td {align}><slot></slot></td>
{/if}