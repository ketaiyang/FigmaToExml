<script>
  import {components} from "../exml/builderImpl/exmlComponent";

  let emptySelection = false;

  let arrData = new Array();
  let dict = {};

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
      dict = event.data.pluginMessage.data
      console.log(dict)
      // dict = {}
      // if (arrData && arrData.length > 0){
      //   arrData.forEach(element => {
      //     dict[element[0]] = element[1]
      //   });
      // }
    }
  };

  const onSelect = (target) =>{
    console.log("select value:"+target.value)
    parent.postMessage({ pluginMessage: { type: "property", data: [["name",target.value]] } }, "*");
  }

  const onInput = (target) =>{
    console.log("input change:"+target.name+","+target.value)
    parent.postMessage({ pluginMessage: { type: "property", data: [[target.name,target.value]] } }, "*");
  }
</script>

<!-- svelte-ignore empty-block -->
{#if emptySelection}

{:else}
<!-- <div> -->
  <p class="text-lg font-bold">组件：</p>
  <select class="border border-gray-400 rounded" on:change="{event=>onSelect(event.target)}" on:blur="">
    {#if dict["fix"]}
      {#if dict["option"]}
        {#each dict["option"] as option}
          {#if dict["name"] && dict["name"]==option}
            <option value={option} selected>
              {option}
            </option>
          {:else}
            <option value={option}>
              {option}
            </option>
          {/if}
        {/each}
      {:else}
        <option value={dict["name"]} selected>
          {dict["name"]}
        </option>
      {/if}
    {:else}
      {#each Object.keys(components) as comp}
        {#if dict["name"] && dict["name"]==comp}
          <option value={comp} selected>
            {comp}
          </option>
        {:else if !components[comp].fix}
          <option value={comp}>
            {comp}
          </option>
        {/if}
      {/each}

      {#if !dict["name"]}
        <option value="" selected />
      {:else}
        <option value="" />
      {/if}
    {/if}
  </select>
<!-- </div> -->
  {#if dict["property"]}
    {#each dict["property"] as arr}
      <!-- {#if arr[0] != "name"} -->
        <div class="h-2" />
        <p class="text-lg font-bold">{arr[2]}</p>
        <input class="border border-gray-400 rounded" value={arr[1]} name={arr[0]} type="{arr[3]}" on:change="{event => onInput(event.target)}">
      <!-- {/if} -->
    {/each}
  {/if}
{/if}
