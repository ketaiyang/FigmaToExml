<script>
	import {
		components
	} from "../exml/builderImpl/exmlComponent";

	let emptySelection = false;

	let dict = {};

	// INIT
	import {
		onMount
	} from "svelte";
	onMount(() => {
		parent.postMessage({
			pluginMessage: {
				type: "property"
			}
		}, "*");
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
		}
	};

	const onSelect = (target) => {
		console.log("select value:" + target.value)
		parent.postMessage({
			pluginMessage: {
				type: "property",
				data: [
					["name", target.value]
				]
			}
		}, "*");
	}

	const onInput = (target) => {
		console.log("input change:" + target.name + "," + target.value)
		parent.postMessage({
			pluginMessage: {
				type: "property",
				data: [
					[target.name, target.value]
				]
			}
		}, "*");
	}

</script>

<div class="px-2 pt-2 bg-gray-50">
    <!-- svelte-ignore empty-block -->
    {#if emptySelection}

    {:else}
        <div class="w-full pt-2 border rounded-lg bg-white">
            <div class="px-2">
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
                {#if dict["property"]}
                    {#each dict["property"] as arr}
                        <div class="h-2" />
                        <p class="text-lg font-bold">{arr[2]}</p>
                        <input class="border border-gray-400 rounded" value={arr[1]} name={arr[0]} type="{arr[3]}" on:change="{event => onInput(event.target)}">
                    {/each}
                {/if}
                <div class="h-2" />
            </div>
        </div>
    {/if}
    <div class="h-2" />
</div>
