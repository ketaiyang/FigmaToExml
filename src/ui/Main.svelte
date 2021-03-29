<script>
	import {
		fade,
		fly
	} from "svelte/transition";

	import {
		Tabs,
		Tab,
		TabList,
		TabPanel
	} from "./svelte-tabs/index";

	import copy from "clipboard-copy";

	function delay(ms) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	let visible = false;

	function updateClipboard(event) {
		copy(event.detail.text);

		visible = true;
		delay(1000).then(() => {
			visible = false;
		});
	}

	let showCode = false

	function updateShowCode(event) {
		showCode = event.detail.showCode
	}

	import ScreenExml from "./ScreenExml.svelte";
	import ScreenProperty from "./ScreenProperty.svelte";

</script>

<style lang="postcss">
	@import "tailwindcss/base";
	@import "tailwindcss/components";
	@import "tailwindcss/utilities";

</style>

<Tabs>

	<TabList>
		<Tab>Exml</Tab>
		<Tab>Property</Tab>
	</TabList>

	<TabPanel>
		<ScreenExml on:clipboard={updateClipboard} on:setShowCode={updateShowCode} showCode={showCode} />
	</TabPanel>

	<TabPanel>
		<ScreenProperty />
	</TabPanel>

</Tabs>

{#if visible}
	<div class="p-2">
	  <div class="fixed bottom-0 left-0 w-full px-2 mb-2">
		<div
		  class="flex items-center justify-center w-full h-8 bg-green-600
		  rounded-lg"
		  in:fly={{ y: 20, duration: 800 }}
		  out:fade>
		  <p class="text-white">Copied!</p>
		</div>
	  </div>
	</div>
  {/if}
  
