export class LocalIndexDbComponent {

    private dbName: string = "remoteControlDb";
    private dbVersion: number = 1;
    private dbStoreName: String = "store1";

    private db:IDBDatabase;

    constructor() {
        var openReq = indexedDB.open(this.dbName, this.dbVersion);
        openReq.onsuccess = this.onSuccessOpen.bind(this);
        openReq.onerror = this.onError;
    }

    private onSuccessOpen(evt: IDBRequest<IDBDatabase>, ev: Event){
        this.db = evt.result;
    }

    private onError(evt: Event){
        console.error(evt);
    }
}