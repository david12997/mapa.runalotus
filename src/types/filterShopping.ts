// Generated by https://quicktype.io

export interface FilterShopping {
    data: DAT;
    meta: Meta;
}

export interface Subcategories {
    data: DAT[];
}

export interface DataAttributes {
    id_category?:    string;
    name:            string;
    description:     null | string;
    deleted:         boolean;
    created:         string;
    updated:         string;
    createdAt:       string;
    updatedAt:       string;
    publishedAt:     string;
    locale:          string;
    data:            null;
    subcategories?:  Subcategories;
    id_subcategory?: string;
    uuid?:           string;
    media?:          Media;
}

export interface DAT {
    id:         number;
    attributes: DataAttributes;
}

export interface Media {
    data: Datum[];
}

export interface Datum {
    id:         number;
    attributes: PurpleAttributes;
}

export interface PurpleAttributes {
    name:              string;
    alternativeText:   null;
    caption:           null;
    width:             number;
    height:            number;
    formats:           Formats;
    hash:              string;
    ext:               string;
    mime:              string;
    size:              number;
    url:               string;
    previewUrl:        null;
    provider:          string;
    provider_metadata: null;
    createdAt:         string;
    updatedAt:         string;
}

export interface Formats {
    thumbnail: Small;
    small:     Small;
}

export interface Small {
    name:   string;
    hash:   string;
    ext:    string;
    mime:   string;
    path:   null;
    width:  number;
    height: number;
    size:   number;
    url:    string;
}

export interface Meta {
}