export interface InitMapGoogleMaps{
   
    marker?:{
     
        add?:boolean,
        delete?:boolean
        markers?:RunalotusMarker[],
        marker?:RunalotusMarker
        
    },
    zoom?:{
        set:boolean,
        value?:number
    },
    cluster?:{
        set:boolean
    },
    geoJson?:{
        add?:boolean,
        delete?:boolean,
        geoJson?:string[],
        center?:RunalotusLatitudeLongitude,
        zoom?:number
    },
    center?:{
        set:boolean,
        value?:RunalotusLatitudeLongitude
    }
 
}

export interface RunalotusMarker{
    position:RunalotusLatitudeLongitude,
    title?:string,
    icon?:string,
    label?:string

}

export interface RunalotusMarkers{
    markers:RunalotusMarker[]
}

export interface RunalotusLatitudeLongitude{
    lat:number,
    lng:number
}