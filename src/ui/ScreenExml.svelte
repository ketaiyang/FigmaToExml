<script>
  import Prism from "svelte-prism";
  import "prism-theme-night-owl";

  let codeData = "";
  let emptySelection = false;
  let showCode = false;
  let resUrl = "";
  let exmlName = "";
  let floderName = "";

  $: codeObservable = codeData;
  $: emptyObservable = emptySelection;

  onmessage = event => {
    console.log("got this from the plugin code", event.data);
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

  // let jsx = false;
  // $: if (jsx || !jsx) {
  //   parent.postMessage({ pluginMessage: { type: "jsx", data: jsx } }, "*");
  // }

  // let layerName = false;
  // $: if (layerName || !layerName) {
  //   parent.postMessage(
  //     { pluginMessage: { type: "layerName", data: layerName } },
  //     "*"
  //   );
  // }

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
  import {writeFile} from "../io/fs"
  const toExml = () =>{
    if (resUrl == null || resUrl == "" || resUrl == undefined || resUrl.split(" ").length != 1) {
      alert("res url can not be empty!")
      return
    }
    if (exmlName == null || exmlName == "" || exmlName == undefined || exmlName.split(" ").length != 1) {
      alert("exml name can not be empty!")
      return
    }
    
    writeFile("resUrl.txt", resUrl, ()=>{
      alert("ok")
    })
  }

  const sectionStyle = "border rounded-lg bg-white";
</script>

<!-- <div>
  <div class="flex flex-col items-center p-4 bg-gray-50">

    <div class="flex">
      <svg class="h-16 w-1/4 m-auto" viewBox="0 0 256 361">
        <path
          d="M255.555 70.766l-23.241 260.36-104.47 28.962-104.182-28.922L.445
          70.766h255.11z"
          fill="#E44D26" />
        <path
          d="M128 337.95l84.417-23.403 19.86-222.49H128V337.95z"
          fill="#F16529" />
        <path
          d="M82.82 155.932H128v-31.937H47.917l.764 8.568 7.85
          88.01H128v-31.937H85.739l-2.919-32.704zM90.018 236.542h-32.06l4.474
          50.146 65.421 18.16.147-.04V271.58l-.14.037-35.568-9.604-2.274-25.471z"
          fill="#EBEBEB" />
        <path
          d="M24.18
          0h16.23v16.035h14.847V0h16.231v48.558h-16.23v-16.26H40.411v16.26h-16.23V0zM92.83
          16.103H78.544V0h44.814v16.103h-14.295v32.455h-16.23V16.103h-.001zM130.47
          0h16.923l10.41 17.062L168.203 0h16.93v48.558h-16.164V24.49l-11.166
          17.265h-.28L146.35 24.49v24.068h-15.88V0zM193.21
          0h16.235v32.508h22.824v16.05h-39.06V0z" />
        <path
          d="M127.89 220.573h39.327l-3.708 41.42-35.62
          9.614v33.226l65.473-18.145.48-5.396
          7.506-84.08.779-8.576H127.89v31.937zM127.89
          155.854v.078h77.143l.64-7.178 1.456-16.191.763-8.568H127.89v31.86z"
          fill="#FFF" />
          <path id="svg_1" d="m320.390543,212.969494c-4.301913,-5.960366 -9.564996,-10.785905 -14.844243,-14.161557c-6.160052,3.460062 -13.662662,5.566984 -21.841965,5.566984c-8.195363,0 -15.708765,-2.111027 -21.857956,-5.566984c-5.279235,3.375652 -10.547695,8.20119 -14.860166,14.161557c-10.010751,13.838262 -11.111689,28.032788 -2.465205,31.713239c3.87226,1.657926 7.932269,0.422204 12.126718,-2.677483c-0.735764,3.142888 -1.165435,6.549371 -1.165435,10.112457c0,15.82988 8.018265,28.652742 17.899904,28.652742c5.955997,0 8.904392,-4.669092 10.322141,-11.817827c1.412519,7.148735 4.36089,11.817827 10.295301,11.817827c9.897878,0 17.916217,-12.822862 17.916217,-28.652742c0,-3.563091 -0.429814,-6.969569 -1.181569,-10.112457c4.205093,3.099687 8.259761,4.33541 12.142771,2.677483c8.641162,-3.680452 7.523967,-17.874983 -2.486506,-31.713239l-0.000006,0zm-36.696778,-13.994746c16.627024,0 30.112408,-10.343116 30.112408,-23.102125s-13.485384,-23.102153 -30.112408,-23.102153c-16.63268,0 -30.128714,10.345173 -30.128714,23.102153s13.496035,23.102125 30.128714,23.102125z" stroke-width="1.5" stroke="#000" fill="#fff"/>
  <path id="svg_3" d="m289.5,170.453125c0,0 -32,-18 -16,-1c16,17 66,32 65.5,31.546875c0.5,0.453125 -49.5,-30.546875 -49.5,-30.546875z" stroke-width="1.5" stroke="#000" fill="#fff"/>
      </svg>
      <p class="w-3/4 mx-2 leading-tight tracking-tight text-sm">
        HTML is the most basic building block of the Web. It defines the
        <a
          class="font-medium text-red-500 hover:text-red-800"
          href="https://developer.mozilla.org/en-US/docs/Web/HTML"
          target="_blank">
          meaning and structure
        </a>
        of web content. You can test your creations by pasting them here:
      </p>
    </div>
    <div class="flex space-x-4 mt-2">
      <a href="https://codepen.io/bernardoferrari/pen/zYKBpdN" target="_blank">
        <button
          class="px-4 py-2 font-semibold text-gray-800 bg-white border
          border-gray-400 rounded shadow hover:bg-gray-50">
          CodePen
        </button>
      </a>
    </div>
  </div>
</div> -->

<div class="px-2 pt-2 bg-gray-50">

  <div class="flex items-center content-center space-x-2">
    <p class="text-lg font-bold">Res Url</p>
    <svg t="1614154263938" class="icon" viewBox="0 0 1208 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1341" width="25" height="25"><path d="M132.51584 120.4736h879.4368c33.26976 0 60.2368 26.96704 60.2368 60.23168v409.6c0 33.26976-26.96704 60.2368-60.2368 60.2368H132.51584c-33.26464 0-60.23168-26.96704-60.23168-60.2368v-409.6c0-33.26464 26.96704-60.2368 60.23168-60.2368z" fill="#F9B552" p-id="1342"></path><path d="M469.8368 0c73.18528 0 132.51584 59.33056 132.51584 132.51584v84.3264h469.8368c73.18528 0 132.51584 59.33568 132.51584 132.52096v542.12096c0 73.18528-59.33056 132.51584-132.51584 132.51584H132.51584A132.51584 132.51584 0 0 1 0 891.48416V349.3632c0-4.03456 0.1792-8.06912 0.54272-12.04736A134.25664 134.25664 0 0 1 0 325.2736V132.51584C0 59.33056 59.33056 0 132.51584 0h337.32096z" fill="#FFCF5C" p-id="1343"></path></svg>
  </div>
  <input class="border border-gray-400 rounded" bind:value={resUrl} placeholder="input res url">

  <div class="h-2" />

  <p class="text-lg font-bold">Exml Name</p>
  <input class="border border-gray-400 rounded" bind:value={exmlName} placeholder="input exml name">

  <div class="h-2" />

  <p class="text-lg font-bold">Img Floder</p>
  <input class="border border-gray-400 rounded" bind:value={floderName} placeholder="input floder name">
</div>

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

      <div
        class="flex items-center content-center justify-start mx-2 mb-2 space-x-8">

        <!-- <Switch bind:checked={layerName} id="layerName" text="LayerName" />

        <Switch bind:checked={jsx} id="jsx" text="JSX" /> -->

        <Switch bind:checked={showCode} id="showCode" text="ShowCode" />

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

    <div class="h-2" />
  {/if}
</div>
