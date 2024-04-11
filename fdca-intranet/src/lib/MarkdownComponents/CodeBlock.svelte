<script lang="ts">
    import { CodeBlock } from '@skeletonlabs/skeleton';
    import hljs from 'highlight.js';
    import { afterUpdate } from 'svelte';
  
    export let lang = 'plaintext';
    export let text = '';
  
    // Decompose `infostring` to extract language if necessary
    // This is a placeholder for any parsing logic you might need
    // For example, if `infostring` includes more than just the language
    let language = lang || 'plaintext'; // Direct assignment, adjust as needed
  
    // Check if the language is registered in highlight.js
    if (!hljs.getLanguage(language)) {
      console.warn(`Language '${language}' is not registered in highlight.js`);
      language = 'plaintext'; // Fallback to plaintext
    }
  
    // Define other properties for styling
    let lineNumbers: boolean = true;
    let background: string = 'bg-neutral-900/90';
    let blur: string = '';
    let color: string = 'text-white';
    let rounded: string = 'rounded-container-token';
    let shadow: string = 'shadow';
    let button: string = 'btn btn-sm variant-soft !text-white';
    let buttonLabel: string = 'Copy';
    let buttonCopied: string = '🚀';
  
    // Update the language reactively when `lang` changes
    $: {
      language = lang || 'plaintext';
  
      if (!hljs.getLanguage(language)) {
        console.warn(`Language '${language}' is not registered in highlight.js`);
        language = 'plaintext'; // Fallback to plaintext
      }
    }
  
  </script>
  
  
  <CodeBlock
    {language}
    code={text}
    {lineNumbers}
    {background}
    {blur}
    {color}
    {rounded}
    {shadow}
    {button}
    {buttonLabel}
    {buttonCopied}
    
  />
  