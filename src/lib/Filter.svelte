<script lang="ts">
    import type { FilterFood } from "../types/filterFood.type";
    import type { FilterLodging } from "../types/filterLodging.type";
    import type { FilterShopping } from "../types/filterShopping";
    import type { FilterTourism } from "../types/filterTourism.type";
    import type { FilterTransport } from "../types/filterTransport.type";
    import type { FilterZones } from "../types/filterZone.type";
    import type { InitMapGoogleMaps } from "../types/googleMaps.type";
    import {filterStore} from "../store/index";
    import type { PointTourism } from "../types/pointsTourism.type";
    import { GetDataBearerToken } from "../services/GetData";
   


    //props
    export let dataFilter: FilterTourism | FilterLodging | FilterFood |FilterTransport | FilterShopping | FilterZones
    export let typeFilter: string
    export let initMap:(config: InitMapGoogleMaps)=>Promise<void>
    export let AllePointsTourism:PointTourism | undefined = undefined;; 
    
    //context
    let config: InitMapGoogleMaps;
    let filters:any;
    let filterImg:string = "";
    const selectsFilter:string[] = ["Puntos turisticos","Transporte","Alojamiento","Restaurantes","Compras","Lugares"];

    function tourismFilter():void {
        let tourismFilter = dataFilter as FilterTourism;
        filters = tourismFilter.data;
    }

    function lodgingFilter():void {
        let lodgingFilter:FilterLodging = dataFilter as FilterLodging;
        filters = lodgingFilter.data.attributes.subcategories.data;
    
    }

    function foodFilter():void {
        let foodFilter:FilterFood = dataFilter as FilterFood;
        filters = foodFilter.data.attributes.subcategories.data;
    }

    function transportFilter():void {
        let transportFilter = dataFilter as FilterTransport;
        filters = transportFilter.data.attributes.subcategories.data; 
    }

    function shoppingFilter():void {
        let shoppingFilter:FilterShopping = dataFilter as FilterShopping;
        filters = shoppingFilter.data.attributes.subcategories.data;
    }

    function zonesFilter():void {
        let zonefilter = dataFilter as FilterZones;
        filters = [...zonefilter.cities.data.attributes.places.data, ...zonefilter.departments.data.attributes.places.data]

    }

    function handleChangeSelect(e: Event & {currentTarget: EventTarget & HTMLSelectElement}){

        filterStore.update((state)=>{
            typeFilter === "Lugares" && (state.zones.current = e.currentTarget.value);
            typeFilter === "Puntos turisticos" && (state.tourism.current = e.currentTarget.value);
            typeFilter === "Transporte" && (state.transport.current = e.currentTarget.value);
            typeFilter === "Alojamiento" && (state.lodging.current = e.currentTarget.value);
            typeFilter === "Restaurantes" && (state.food.current = e.currentTarget.value);
            typeFilter === "Compras" && (state.shopping.current = e.currentTarget.value);


            return {
                ...state
            }
        });

        typeFilter === "Puntos turisticos" && AddPointsFilterPuntosTuristicos(e);
        typeFilter === "Lugares" && AddPointsFilterLugares(e);

       

    }

    function AddPointsFilterPuntosTuristicos(e:Event & {currentTarget: EventTarget & HTMLSelectElement}):void{

        let currentFilter = filters.find((filter:any)=>filter.attributes.name === e.currentTarget.value &&  filter.attributes);
        if(currentFilter !== undefined){

            filterImg = 'https://cms.aipus.co'+currentFilter.attributes.media.data[0].attributes.url;

            initMap({marker:{
                delete:true,
            }});

            let Points = currentFilter.attributes.points.data;
            Points !== undefined && currentFilter.attributes.points.data.forEach((point:any)=>{
                config = {
                    marker:{
                        add:true,
                        marker:{
                            position:{
                                lat:point.attributes.location.latitud,
                                lng:point.attributes.location.longitud
                            },
                            icon:`https://cms.aipus.co${point.attributes.location.icon}`,
                            label:point.attributes.name
                        },
                        
                    },
                    cluster:{
                        set:false
                    }
                }
                initMap(config); 
            });


            initMap({zoom:{set:true,value:5},cluster:{set:true}})
        }else{

            initMap({marker:{
                delete:true,
            }});

            // ver todo current filter selected
            if(e.currentTarget.value === "Ver todo" && AllePointsTourism !== undefined){

                filterImg = "https://cms.aipus.co/uploads/ver_todo_dbd9bbcc6d.webp";
                AllePointsTourism.data.forEach((point:any)=>{
                    config = {
                        marker:{
                            add:true,
                            marker:{
                                position:{
                                    lat:point.attributes.location.latitud,
                                    lng:point.attributes.location.longitud
                                },
                                icon:`https://cms.aipus.co${point.attributes.location.icon}`,
                                label:point.attributes.name
                            }
                        },
                        cluster:{
                            set:false
                        }
                    }
                    initMap(config);
                
                });

                initMap({zoom:{set:true,value:5},cluster:{set:true }})
            }

            // ocultar todo current filter selected
            if(e.currentTarget.value === "Ocultar todo" && AllePointsTourism !== undefined){
                filterImg = "https://cms.aipus.co/uploads/ocultar_todo_d136c1eff6.webp";
                initMap({
                    marker:{
                        delete:true,
                    },
                    cluster:{
                        set:false
                    }
                });
            }

            // Puntos turisticos current filter selected
            if(e.currentTarget.value === "Puntos turisticos" && AllePointsTourism !== undefined){
                filterImg = "https://cms.aipus.co/uploads/islas_786f93617c.webp";
                
            }





        }

    }

    function AddPointsFilterLugares(e:Event & {currentTarget: EventTarget & HTMLSelectElement}):void{

        let currentFilter = filters.find((filter:any)=>filter.attributes.name === e.currentTarget.value &&  filter.attributes);
        if(currentFilter !== undefined){

            filterImg = 'https://cms.aipus.co/uploads/place_icon_c0c5c92329.webp';

            console.log(currentFilter);
            initMap({geoJson:{
                add:true,
                geoJson:[`https://cms.aipus.co${currentFilter.attributes.data.geoJSON}`],
                center:{
                    lat:parseFloat(currentFilter.attributes.location.latitud),
                    lng:parseFloat(currentFilter.attributes.location.longitud)
                },
                zoom: currentFilter.attributes.type.includes('departamento') ? 8 : currentFilter.attributes.type.includes('ciudad') ? 10  : 6
                
            }})
        
        }else{
            
            if(e.currentTarget.value === "Lugares" || e.currentTarget.value === "Ocultar todo"){
                initMap({geoJson:{
                    delete:true,
                }})
            }
        }
    }

    function AddIconFilterCategories():void{

        if(typeFilter === "Puntos turisticos"){
            filterImg = "https://cms.aipus.co/uploads/islas_786f93617c.webp";
        }
        if(typeFilter === "Lugares"){
            filterImg = "https://cms.aipus.co/uploads/place_icon_c0c5c92329.webp";
        }
        if(typeFilter === "Transporte"){
            filterImg = "https://cms.aipus.co/uploads/aeropuertos_2118088c1f.png";
        }

        if(typeFilter === "Alojamiento"){
            filterImg = "https://cms.aipus.co/uploads/casas_urbanas_8628ae0efa.jpg";
        }

        if(typeFilter === "Restaurantes"){
            filterImg = "https://cms.aipus.co/uploads/restaurantes_oficiales_9012d1128d.png";
        }

        if(typeFilter === "Compras"){
            filterImg = "https://cms.aipus.co/uploads/tienda_de_ropa_ed121d537b.png";
        }

    }

    typeFilter === "Puntos turisticos" && tourismFilter();
    typeFilter === "Transporte" && transportFilter();
    typeFilter === "Alojamiento" && lodgingFilter();
    typeFilter === "Restaurantes" && foodFilter();
    typeFilter === "Compras" && shoppingFilter();
    typeFilter === "Lugares" && zonesFilter();
    AddIconFilterCategories();


</script>

<span class="bg-white min-w-[40px] min-h-[45px] flex items-center justify-center">
    <img class="bg-white min-w-[20px] min-h-[20px]" src={filterImg} alt="icon filter subcategory"/>
</span>
    


<select placeholder={typeFilter} on:change={(e)=>handleChangeSelect(e)} class="pl-2 relative min-w-[170px] w-[190px] h-[45px]  mr-2" >
    

    {#each selectsFilter as select }
        {#if typeFilter === select}

            <option>{select}</option>
            <option>{select === "Lugares" ? "Cerca a mi" : "Ver todo" }</option>
            <option>Ocultar todo</option>
            {#each filters as  filter}
                <option>{filter.attributes.name}</option>
            {/each}
        {/if}

    {/each}
    
</select>

<style>
    select{
        border:none;
        outline-color:none;
        background-color: #FFFFFF;
        font-size:17px;
        font-weight:800;
        color:#000000;
        border-start-end-radius: 10px;
        border-end-end-radius: 10px;
        cursor: pointer;
        box-shadow:3px 0px 3px 0px rgba(0,0,0,0.45);

        
        
    }
    option{

        padding:5px;
        font-size:17px;
        font-weight: 700;
 
        
    }

    span{
        border-start-start-radius: 10px;
        border-end-start-radius: 10px;
        box-shadow:-3px 0px 3px 0px rgba(0,0,0,0.45);
    }
    span > img{
        width:36px !important;
        height:36px !important;
        border-start-start-radius: 10px;
        border-end-start-radius: 10px;
       
    }

</style>

