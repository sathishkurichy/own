import { List } from "immutable";

export type Texture = {
    name: string,
    dishTypeId: MixingTexture
}

export enum MixingTexture {
    SMOOTH = 1,
    STRANDED, // mouliné
    CHOPPED
}

export const textures: List<Texture> = List<Texture>([{
    name: "TEXTURE.SMOOTH",
    dishTypeId: MixingTexture.SMOOTH
},{
    name: "TEXTURE.STRANDED",
    dishTypeId: MixingTexture.STRANDED
},{
    name: "TEXTURE.CHOPPED",
    dishTypeId: MixingTexture.CHOPPED
}])
