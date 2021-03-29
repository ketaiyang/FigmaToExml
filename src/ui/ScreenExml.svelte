<script>
  import Prism from "svelte-prism";
  import "prism-theme-night-owl";

  let codeData = "";
  let emptySelection = false;

  export let showCode;

  $: codeObservable = codeData;
  $: emptyObservable = emptySelection;

  onmessage = event => {
    // console.log("got this from the plugin code", event.data);
    if (!event.data.pluginMessage) {
      return;
    }

    if (emptySelection !== (event.data.pluginMessage.type === "empty")) {
      emptySelection = event.data.pluginMessage.type === "empty";
    }

    if (event.data.pluginMessage.type === "result") {
      codeData = event.data.pluginMessage.data;
    }
  };

  import Switch from "./Switch.svelte";

  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  const clipboard = data => dispatch("clipboard", { text: data });

  function handleClipboard(event) {
    clipboard(event.detail.text);
  }

  // INIT
  import { onMount } from "svelte";
  onMount(() => {
    parent.postMessage({ pluginMessage: { type: "exml" } }, "*");
  });

  // TO EXML
  import { writeFile } from "../io/fs"
  const toExml = () =>{
    writeFile("_.exml", codeData)
  }

  // showCode
  const handleShowCode = data => dispatch("setShowCode", { showCode: data });
  const onChange = (target) =>{
    handleShowCode(showCode)
  }

  const sectionStyle = "border rounded-lg bg-white";
</script>

<div class="px-2 pt-2 bg-gray-50">

  {#if emptySelection}
    <div
      class="flex flex-col space-y-2 m-auto items-center justify-center p-4 {sectionStyle}">
      <p class="text-lg font-bold">Nothing is selected</p>
      <p class="text-xs">Try selecting a layer, any layer</p>
    </div>
  {:else}
    <div class="w-full pt-2 {sectionStyle}">
      <div class="flex items-center justify-between px-2 space-x-2">
        <!-- <p
          class="px-4 py-2 text-lg font-medium text-center bg-gray-200
          rounded-lg">
          Code
        </p> -->

      <div class="flex items-center content-center justify-start mx-2 mb-2 space-x-8">
        <Switch bind:checked={showCode} id="showCode" text="ShowCode" on:change="{event => onChange(event.target)}" />
      </div>

        <div class="flex items-center content-center justify-end mx-2 mb-2 space-x-1">
          <button
            class="px-4 py-2 font-semibold text-blue-700 bg-transparent border
            border-blue-500 rounded hover:bg-blue-500 hover:text-white
            hover:border-transparent"
            on:click={clipboard(codeObservable)}>
            Copy
          </button>
          <button
            class="px-4 py-2 font-semibold text-blue-700 bg-transparent border
            border-blue-500 rounded hover:bg-blue-500 hover:text-white
            hover:border-transparent"
            on:click={toExml}>
            To Exml
          </button>
        </div>
      </div>

      {#if showCode}
        <Prism language="xml" source={codeObservable} />
      {/if}

    </div>

  {/if}
  <div class="h-2" />
</div>
