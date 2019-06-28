export interface BeabaDevice {
    id?: number,
    name?: string,
    serialNumber: string,
    purchaseDate: string,
    model: number,
    imageBase64?: string,
    owner?: string,
    firmwareVersion?: string,
}
