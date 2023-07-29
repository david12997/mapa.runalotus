<script lang="ts">

  import './app.css'
  import { onMount } from 'svelte';
  import { GetDataBearerToken } from './services/GetData';
  import type { FilterTourism } from './types/filterTourism.type';
  import type { DepartmentColombia } from './types/departmentColombia.type';
  import type { FilterLodging } from './types/filterLodging.type';
  import type { FilterFood } from './types/filterFood.type';
  import type { FilterTransport } from './types/filterTransport.type';
  import type { FilterShopping } from './types/filterShopping';
  import type { CitiesColombia } from './types/citiesColombia.type';
  import Filter from './lib/Filter.svelte';
  import type { InitMapGoogleMaps } from './types/googleMaps.type';
  import type { PointTourism } from './types/pointsTourism.type';
  import { MarkerClusterer } from "@googlemaps/markerclusterer";



  let dataFilters:[FilterTourism,DepartmentColombia,FilterLodging,FilterFood,FilterTransport,FilterShopping,CitiesColombia,PointTourism]
  let map:google.maps.Map | null = null;
  let marker:google.maps.Marker | null = null;
  let markers:google.maps.Marker[] = [];
  let cluster:MarkerClusterer;
  let divMap:HTMLElement | null = null;
  const initialOptions = {
    center: {
        lat: 4.648444872577107, 
        lng: -74.11874117495658
    },
    zoom: 6,
    disableDefaultUI: true,
    mapTypeControl: false,
    fullscreenControl: false,
    panControl: false,
    streetViewControl:false,
    zoomControl:false,
    rotateControl:false,
    scaleControl:false,

  } as google.maps.MapOptions;


   // google maps init
   async function initMap(config:InitMapGoogleMaps): Promise<void> {
    
    if(map === null){
      const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;
      map = new Map(divMap as HTMLElement, initialOptions);
    }else{

      //add new marker
      if(config.marker !== undefined && config.marker.add && config.marker.marker !== undefined){
        AddMarker(config.marker.marker.position.lat,config.marker.marker.position.lng, config.marker.marker.icon, config.marker.marker.label);
      }
      
      // remove marker and cluster google maps
      if(config.marker !== undefined && config.marker.delete && markers.length > 0){
        RemoveMarker();
      }

      // set zoom and 
      if(config.zoom !== undefined && config.zoom.set){
        map.setZoom(config.zoom.value);
      }

      // add new cluster google maps
      if(config.cluster !==  undefined && config.cluster.set){
        cluster =  new MarkerClusterer({markers,map,})
        cluster.setMap(map);
      }

      //add geJson google maps
      if(config.geoJson !== undefined && config.geoJson.add){
        AddGeoJSON(config.geoJson.geoJson);
        map.setCenter(config.geoJson.center);
        map.setZoom(config.geoJson.zoom);
      }

      //remove geJson google maps
      if(config.geoJson !== undefined && config.geoJson.delete){
        RemoveGeoJson();
        map?.setZoom(6)
        map?.setCenter(initialOptions.center);
      }

      
    }    

  }

  // once the component is mounted we get the data from the api and we initialize the map
  onMount(async () => {

    dataFilters = await GetDataBearerToken([
      
      'https://cms.aipus.co/api/subcategories?populate=*&filters[category][id][$eq]=4',//filters tourism point
      'https://cms.aipus.co/api/subcategories/45?populate[0]=places.media',// departments cololmbia filter
      'https://cms.aipus.co/api/categories/8?populate[0]=subcategories.media', //filters alojamientos
      'https://cms.aipus.co/api/categories/7?populate[0]=subcategories.media', //filters restaurantes y comida
      'https://cms.aipus.co/api/categories/11?populate[0]=subcategories.media', //filters trasportes y tipos de transporte
      'https://cms.aipus.co/api/categories/12?populate[0]=subcategories.media', //filters compras
      'https://cms.aipus.co/api/subcategories/61?populate[0]=places.media', // cities colombia,
      'https://cms.aipus.co/api/points?populate=*&pagination[pageSize]=50' // all points tourism
      
    ],import.meta.env.VITE_AIPUS_TOKEN)
    .then((res:[

      FilterTourism,
      DepartmentColombia,
      FilterLodging,
      FilterFood,
      FilterTransport,
      FilterShopping,
      CitiesColombia,
      PointTourism
    
    ])=>res);

    initMap({marker:{
      
      add:true,
      marker:{
        position:{
          lat:4.648444872577107,
          lng:-74.11874117495658
        }
      }

    }});

    
  });

  function AddMarker(lat:number,lng:number,icon?:string,label?:string):void {

    marker = new google.maps.Marker({
      position: { lat, lng },
      map,
      icon: {
        url: icon || "https://cms.aipus.co/uploads/place_icon_c0c5c92329.webp",
        scaledSize: new google.maps.Size(45, 45),
      },
      label: {
        text: label || "Punto turistico",
        className: "overflow-hidden shadow-md whitespace-nowrap text-ellipsis w-[120px] rounded-3xl bg-white text-black font-semibold text-[13px] p-2 mt-[69px] ml-[10px]"
      },
    });

    marker?.setMap(map);
    markers =[...markers,marker]

  } 

  function RemoveMarker():void {

    markers.forEach((marker:google.maps.Marker) => {

      cluster !== undefined && cluster.removeMarker(marker);
      marker.setMap(null);
      
    });
    cluster !== undefined && cluster.clearMarkers();
    cluster !== undefined && cluster.setMap(null);

    markers = [];

  }

  function AddGeoJSON(urls:string[]):void{

    GetDataBearerToken(urls,import.meta.env.VITE_AIPUS_TOKEN).then((res:[any])=>{

      map?.data.forEach((feature) => {
        map.data.remove(feature);
      });

      const geoJson = res[0];
      map?.data.addGeoJson(geoJson);
      map?.data.setStyle({
        fillColor: '#099100',
        strokeWeight: 1,
        strokeColor: '#099100',
        fillOpacity: 0.5
      });

    
      
    });

  }

  function RemoveGeoJson():void{

    map?.data.forEach((feature) => {
      map.data.remove(feature);
    });

  }
 

</script>

<svelte:head>

  <script defer async>(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})
      ({key: "AIzaSyDiUVP9g-d3j0k0L6OsqQ-xp4zcC3aFUew", v: "weekly"});
  </script>

</svelte:head>


<header class="w-screen pl-2 h-[35px] text-[17px] flex items-center text-white bg-primaryA font-semibold ">
  <img class="min-w-[33px] min-h-[33px] max-w-[33px] max-h-[33px] p-[3px]" src="https://cms.aipus.co/uploads/logo_runalotus_9037342ad6.png" alt="logo runalotus" />Runalotus Mapa Turistico
</header>


<main class="w-screen h-screen relative">

  <section class="pl-4 ml-[1%] w-[98%] h-[69px] md:w-[98vw] md:ml-[1vw] flex items-center absolute z-40 overflow-x-scroll">
    {#if dataFilters !== undefined }

      <Filter 
        initMap={initMap} 
        typeFilter="Lugares" 
        dataFilter={{departments:dataFilters[1],cities:dataFilters[6]}} 
      />
      <Filter 
        initMap={initMap} 
        typeFilter="Puntos turisticos" 
        dataFilter={dataFilters[0]}
        AllePointsTourism={dataFilters[7]}
      />
      <Filter 
        initMap={initMap} 
        typeFilter="Transporte" 
        dataFilter={dataFilters[4]}
      />
      <Filter 
        initMap={initMap} 
        typeFilter="Alojamiento" 
        dataFilter={dataFilters[2]}
      />
      <Filter 
        initMap={initMap} 
        typeFilter="Restaurantes" 
        dataFilter={dataFilters[3]}
      />
      <Filter 
        initMap={initMap} 
        typeFilter="Compras" 
        dataFilter={dataFilters[5]}
      />

    {/if}

  </section>

  <div bind:this={divMap} id="map" class="w-screen h-[100%]"></div>

</main>

