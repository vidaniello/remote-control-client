
export class MainComponent{

    public static singlInst:MainComponent;

    private mainContent: HTMLDivElement;
    private homepage: HTMLDivElement;
    private configButton: HTMLButtonElement;
    private testButton: HTMLButtonElement;
    private testInput: HTMLInputElement;

    constructor(){
       
        this.mainContent = document.createElement('div');
        this.homepage = document.createElement('div');

        var divConfButt = document.createElement('div');
        this.configButton = document.createElement('button');
        divConfButt.appendChild(this.configButton);
        this.homepage.appendChild(divConfButt);
        this.configButton.innerHTML = `Config`;
        this.configButton.onclick = this.onConfigButtonclk.bind(this);


        var divLogComponent = document.createElement('div');
        this.homepage.appendChild(divLogComponent);
        divLogComponent.appendChild(LogMonitor.get().getMainContent());

        this.testButton = document.createElement('button');
        this.testButton.innerHTML = `Invia messaggio al SW`;

        //https://it.javascript.info/bind
        this.testButton.onclick = this.onBtTestClk.bind(this);


        this.homepage.appendChild(this.testButton);

        this.testInput = document.createElement('input');
        this.testInput.style.width = '200px';
        this.testInput.value = 'Message to broadcast';
        this.homepage.appendChild(this.testInput);

        this.mainContent.appendChild(this.homepage);

        MainComponent.singlInst = this;
    }

    public render(): HTMLElement{
        return this.mainContent;
    }

    public show():void {
        this.mainContent.replaceChildren(this.homepage)
    }

    
    private onBtTestClk(mevt: MouseEvent){
        //alert('HI '+'');

        //https://felixgerschau.com/how-to-communicate-with-service-workers/
        
        navigator.serviceWorker.controller.postMessage({
            type: 'MESSAGE_IDENTIFIER',
            message: this.testInput.value
          });
        
        
    }
    

    private onConfigButtonclk(mevt: MouseEvent){
        this.mainContent.replaceChildren(new ConfigScanComponent().render());
    }
}






class ConfigScanComponent {

    public static configIp_key:string = 'configIp';
    public static configSubnetmask_key:string = 'configSubnetmask';

    private mainContent: HTMLDivElement;
    private saveButton: HTMLButtonElement;
    private ipInput: HTMLInputElement;
    private subnetInput: HTMLInputElement;

    constructor(){
       this.mainContent = document.createElement('div');

       this.ipInput = document.createElement('input');
       this.ipInput.style.width = '200px';
       this.ipInput.value = '192.168.1.1';
       this.mainContent.appendChild(this.ipInput);

       this.subnetInput = document.createElement('input');
       this.subnetInput.style.width = '200px';
       this.subnetInput.value = '255.255.255.0';
       this.mainContent.appendChild(this.subnetInput);


       this.saveButton = document.createElement('button');
       this.mainContent.appendChild(this.saveButton);
       this.saveButton.innerHTML = `Salva`;
       this.saveButton.onclick = this.onSaveBtClk.bind(this);

       this.loadFromLocalStorage();
    }

    public render(): HTMLDivElement{
        return this.mainContent;
    }

    private loadFromLocalStorage(): void{
        var configIp_value = window.localStorage.getItem(ConfigScanComponent.configIp_key);
        if(configIp_value!=undefined)
            if(configIp_value!=null)
                if(configIp_value!='')
                    this.ipInput.value = configIp_value;

        var configSubnetmask_value = window.localStorage.getItem(ConfigScanComponent.configSubnetmask_key);
        if(configSubnetmask_value!=undefined)
            if(configSubnetmask_value!=null)
                if(configSubnetmask_value!='')
                    this.subnetInput.value = configSubnetmask_value;
    }

    private saveToLocalStorage(){
        window.localStorage.setItem(ConfigScanComponent.configIp_key,this.ipInput.value);
        window.localStorage.setItem(ConfigScanComponent.configSubnetmask_key,this.subnetInput.value);
    }

    private onSaveBtClk():void {
        this.saveToLocalStorage();
        MainComponent.singlInst.show();
    }

}


class LogMonitor {

    private static singl:LogMonitor = new LogMonitor();
    public static get():LogMonitor{return LogMonitor.singl;}

    private broadcChann:BroadcastChannel;
    private mainContent: HTMLDivElement;

    constructor(){
        this.broadcChann = new BroadcastChannel('log-channel');

        this.broadcChann.onmessage = (evt)=>{
            if(evt.data)
                this.onLogMessage(evt.data);
        };
        this.broadcChann.onmessage.bind(this);

        this.mainContent = document.createElement('div');
    }

    private onLogMessage(logData:any):void {
        var logSpan = document.createElement('span');
        logSpan.innerHTML = logData.type+': '+logData.message;
        this.mainContent.replaceChildren(logSpan);
    }

    public getMainContent():HTMLDivElement {
        return this.mainContent;
    }
}