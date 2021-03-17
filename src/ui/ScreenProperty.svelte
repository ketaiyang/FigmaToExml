<script>
  import {component} from "../exml/builderImpl/exmlComp";

  let node;
  let emptySelection = false;
  let selected;
	let answer = '';

  $: nodeObservable = node;

  // INIT
  import { onMount } from "svelte";
  onMount(() => {
    parent.postMessage({ pluginMessage: { type: "property" } }, "*");
  });

  onmessage = event => {
    if (!event.data.pluginMessage) {
      return;
    }

    if (emptySelection !== (event.data.pluginMessage.type === "empty")) {
      emptySelection = event.data.pluginMessage.type === "empty";
    }

    if (event.data.pluginMessage.type === "result") {
      console.log(event.data.pluginMessage.data)
    }
  };

  const onSelect = () =>{
    console.log(selected)
    // parent.postMessage({ pluginMessage: { type: "property", data:  } }, "*");
  }
</script>

<!-- <div> -->
  <select bind:value={selected} on:change="{()=>onSelect()}" on:blur="">
    {#each component as comp}
      {#if node && node.getPluginData("name")==comp}
        <option value={comp} selected>
          {comp}
        </option>
      {:else}
        <option value={comp}>
          {comp}
        </option>
      {/if}
    {/each}
  </select>
<!-- </div> -->
