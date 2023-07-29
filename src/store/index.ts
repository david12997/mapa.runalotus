import { writable } from 'svelte/store';
//stores
export const filterStore = writable({
    zones:{
        current:"Lugares",
    },
    tourism:{
        current:"Puntos turisticos",
    },
    transport:{
        current:"Transporte",
    },
    lodging:{
        current:"Alojamiento",
    },
    food:{
        current:"Restaurantes",
    },
    shopping:{
        current:"Compras",
    }

});