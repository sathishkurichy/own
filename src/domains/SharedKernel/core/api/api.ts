import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { FileTransfer, FileTransferObject, FileUploadOptions, FileUploadResult } from '@ionic-native/file-transfer';

import { ApiCore } from './apicore';

/**
 * Api is a generic REST Api handler. Set your API url first..
 */
@Injectable()
export class Api extends ApiCore {

    constructor(http: Http) {
        super(http);
    }

    /* transferFile(base64: string, endpoint: string, options: FileUploadOptions): Promise<FileUploadResult> {
        const fileTransfer: FileTransferObject = this.transfer.create();
        return fileTransfer.upload(base64, this.url + endpoint, options)
    }*/
}