import * as IpSubnetCalculator from 'ip-subnet-calculator'
import {LogMessage, LogType} from './commons'
//import {Agent} from 'https'

class ConfigScanComponent {

    public static configIp_key:string = 'configIp';
    public static configSubnetmask_key:string = 'configSubnetmask';
    //public static configHttpPort_key:string = 'configHttpPort';
    public static configHttpsPort_key:string = 'configHttpsPort';
    public static configTimeout_key:string = 'configTimeout';

    private mainContent: HTMLDivElement;
    private saveButton: HTMLButtonElement;
    private ipInput: HTMLInputElement;
    private subnetInput: HTMLInputElement;
    //private httpPortInput: HTMLInputElement;
    private httpsPortInput: HTMLInputElement;
    private timeoutInput: HTMLInputElement;

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

       /*
       var divHttpPort = document.createElement('div');
       var httpPortLabel = document.createElement('label');
       httpPortLabel.innerHTML = "http port: ";
       this.httpPortInput = document.createElement('input');
       this.httpPortInput.style.width = '80px';
       this.httpPortInput.value = '34193';
       divHttpPort.appendChild(httpPortLabel);
       divHttpPort.appendChild(this.httpPortInput);
       this.mainContent.appendChild(divHttpPort);
       */

       var divHttpsPort = document.createElement('div');
       var httpsPortLabel = document.createElement('label');
       httpsPortLabel.innerHTML = "https port: ";
       this.httpsPortInput = document.createElement('input');
       this.httpsPortInput.style.width = '80px';
       this.httpsPortInput.value = '34194';
       divHttpsPort.appendChild(httpsPortLabel);
       divHttpsPort.appendChild(this.httpsPortInput);
       this.mainContent.appendChild(divHttpsPort);

       var divTimeout = document.createElement('div');
       var timeoutLabel = document.createElement('label');
       timeoutLabel.innerHTML = "timeout: ";
       this.timeoutInput = document.createElement('input');
       this.timeoutInput.style.width = '80px';
       this.timeoutInput.value = '100';
       divTimeout.appendChild(timeoutLabel);
       divTimeout.appendChild(this.timeoutInput);
       this.mainContent.appendChild(divTimeout);

       this.saveButton = document.createElement('button');
       this.mainContent.appendChild(this.saveButton);
       this.saveButton.innerHTML = `Salva ed torna indietro`;
       this.saveButton.onclick = this.onSaveBtClk.bind(this);

       this.loadFromLocalStorage();
    }

    public render(): HTMLDivElement{
        return this.mainContent;
    }

    public static getIpFromLocalStorage():string {
        return window.localStorage.getItem(ConfigScanComponent.configIp_key);
    }

    public static getSubnetmaskFromLocalStorage():string {
        return window.localStorage.getItem(ConfigScanComponent.configSubnetmask_key);
    }

    /*
    public static getHttpPortFromLocalStorage():string {
        return window.localStorage.getItem(ConfigScanComponent.configHttpPort_key);
    }
    */

    public static getHttpsPortFromLocalStorage():string {
        return window.localStorage.getItem(ConfigScanComponent.configHttpsPort_key);
    }

    public static getTimeoutFromLocalStorage():number {
        return parseInt( window.localStorage.getItem(ConfigScanComponent.configTimeout_key) );
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
        /*
        var configHttpPort_value = window.localStorage.getItem(ConfigScanComponent.configHttpPort_key);
        if(configHttpPort_value!=undefined)
            if(configHttpPort_value!=null)
                if(configHttpPort_value!='')
                    this.httpPortInput.value = configHttpPort_value;
        */

        var configHttpsPort_value = window.localStorage.getItem(ConfigScanComponent.configHttpsPort_key);
        if(configHttpsPort_value!=undefined)
            if(configHttpsPort_value!=null)
                if(configHttpsPort_value!='')
                    this.httpsPortInput.value = configHttpsPort_value;

        var configTimeout_value = window.localStorage.getItem(ConfigScanComponent.configTimeout_key);
        if(configTimeout_value!=undefined)
            if(configTimeout_value!=null)
                if(configTimeout_value!='')
                    this.timeoutInput.value = configTimeout_value;
    }

    private saveToLocalStorage(){
        window.localStorage.setItem(ConfigScanComponent.configIp_key,this.ipInput.value);
        window.localStorage.setItem(ConfigScanComponent.configSubnetmask_key,this.subnetInput.value);
        //window.localStorage.setItem(ConfigScanComponent.configHttpPort_key,this.httpPortInput.value);
        window.localStorage.setItem(ConfigScanComponent.configHttpsPort_key,this.httpsPortInput.value);
        window.localStorage.setItem(ConfigScanComponent.configTimeout_key,this.timeoutInput.value);
    }

    private onSaveBtClk():void {
        this.saveToLocalStorage();
        MainComponent.singlInst.show();
    }

}







class ScanComponent {

    private static singl:ScanComponent = new ScanComponent();
    public static get():ScanComponent{return ScanComponent.singl;}

    private mainContent: HTMLDivElement;
    private startScannButton: HTMLButtonElement;
    private scanningInProgress:boolean;

    constructor(){
        this.mainContent = document.createElement('div');

        this.startScannButton = document.createElement('button');
        this.startScannButton.innerHTML = 'Start scan';
        this.mainContent.appendChild(this.startScannButton);
        this.startScannButton.onclick = this.onclkStartScann.bind(this);
    }

    public render():HTMLElement {
        return this.mainContent;
    }

    private async onclkStartScann(clkEvent:Event){

        if(this.scanningInProgress){
            alert("Scanning in progress... Before request another, wait until it end.");
            return;
        }
        this.scanningInProgress = true;

        var subnRes:IpSubnetCalculator.SubnetResult = IpSubnetCalculator.calculateCIDRPrefix(
            ConfigScanComponent.getIpFromLocalStorage(),
            ConfigScanComponent.getSubnetmaskFromLocalStorage()
        );
        
        for(let i = subnRes.ipLow; i<=subnRes.ipHigh-1; i++){
            LogMonitor.get().logMessage({
                type: LogType.INFO,
                message: "Scanning <b>"+IpSubnetCalculator.toString(i)+"</b> "+(subnRes.ipHigh-i)+" ip remain's"
            });
            await this.fetchAddress(IpSubnetCalculator.toString(i));
            //await this.sleep(100);
        }

        this.scanningInProgress = false;

        LogMonitor.get().logMessage({
            type: LogType.INFO,
            message: "Scanning ended"
        });
    }

    private async fetchAddress(ip:string) {

       await fetch("https://"+ip+":"+ConfigScanComponent.getHttpsPortFromLocalStorage()+"/ping",{
        method: "GET",
        headers : {
            "Accept": "application/json",
        },
        signal: AbortSignal.timeout(ConfigScanComponent.getTimeoutFromLocalStorage())
       }).then(async resp=>{

            await resp.json().then(jsonOb=>{

                let resp:PingResponse = jsonOb;
                if(resp.response=="pong"){
                    //Add address to valid ip
                    FindedPc.get().addPc(ip);
                }
            });

        
       }).catch(reason=>{
        //LogMonitor.get().logMessage({type: LogType.INFO, message: "<span style=\"color: red;\">"+reason+"</span>"});
        FindedPc.get().removePc(ip);
       });
    }

    private sleep(millDelay:number):Promise<any> {
        return new Promise((res)=>{
            setTimeout(res, millDelay);
        });
    }
}


class FindedPc {

    private static list_key:string =  "pcList";

    private static singleton:FindedPc = new FindedPc();
    public static get():FindedPc {return FindedPc.singleton;}

    private mainDiv:HTMLDivElement;
    private pcList:Set<string>;

    constructor(){
        this.mainDiv = document.createElement('div');

        this.loadFromLocalStorage();
        this.refreshPcList();
    }


    public getMainDiv():HTMLDivElement {
        return this.mainDiv;
    }

    private loadFromLocalStorage():void {
        let jsOb = window.localStorage.getItem(FindedPc.list_key);
        if(jsOb!=undefined)
            this.pcList = new Set<string>(JSON.parse(jsOb));
        else
            this.pcList = new Set<string>();
    }

    private saveToLocalStorage():void{
        window.localStorage.setItem(FindedPc.list_key, JSON.stringify(Array.from(this.pcList)));
    }

    public addPc(ip:string):void {
        if(!this.pcList.has(ip)){
            this.pcList.add(ip);
            this.saveToLocalStorage();
            this.refreshPcList();
        }
    }

    public removePc(ip:string){
        if(this.pcList.has(ip)){
            this.pcList.delete(ip);
            this.saveToLocalStorage();
            this.refreshPcList();
        }
    }



    private refreshPcList():void {
        

        let list = document.createElement('ul');
        

        this.pcList.forEach(ip=>{
            let li = document.createElement('li');
            list.appendChild(li);
            let a = document.createElement('a');
            li.appendChild(a);

            a.href = "https://"+ip+":"+ConfigScanComponent.getHttpsPortFromLocalStorage();
            a.target = "_blank";
            a.innerHTML = a.href;
        });

        this.mainDiv.replaceChildren(list);
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


    public logMessage(logData:LogMessage):void {
        this.onLogMessage(logData);
    }

    private onLogMessage(logData:LogMessage):void {
        var logSpan = document.createElement('span');
        logSpan.innerHTML = logData.type+': '+logData.message;
        this.mainContent.replaceChildren(logSpan);
    }

    public getMainContent():HTMLDivElement {
        return this.mainContent;
    }
}



class PingResponse {
    response:string;
}

export class MainComponent{

    public static singlInst:MainComponent;

    private mainContent: HTMLDivElement;
    private homepage: HTMLDivElement;
    private configButton: HTMLButtonElement;
    private testButton: HTMLButtonElement;
    private testInput: HTMLInputElement;

    //private unauthAgent:Agent;

    constructor(){
       
        /*
        this.unauthAgent = new Agent({
            rejectUnauthorized: false
        });
        */

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


        var divStartScan = document.createElement('div');
        this.homepage.appendChild(divStartScan);
        divStartScan.appendChild(ScanComponent.get().render());


        this.testButton = document.createElement('button');
        this.testButton.innerHTML = `Invia messaggio al SW`;

        //https://it.javascript.info/bind
        this.testButton.onclick = this.onBtTestClk.bind(this);


        //this.homepage.appendChild(this.testButton);

        this.testInput = document.createElement('input');
        this.testInput.style.width = '200px';
        this.testInput.value = 'Message to broadcast';
        //this.homepage.appendChild(this.testInput);

        this.homepage.appendChild(FindedPc.get().getMainDiv());


        var testDiv = document.createElement('div');
        //this.homepage.appendChild(testDiv);
        var testIpCalcButton = document.createElement('button');
        testIpCalcButton.innerHTML = 'Test ipSubnet';
        testDiv.appendChild(testIpCalcButton);
        testIpCalcButton.onclick = (clkEvt)=>{
            var subnRes:IpSubnetCalculator.SubnetResult = IpSubnetCalculator.calculateCIDRPrefix(
                ConfigScanComponent.getIpFromLocalStorage(),
                ConfigScanComponent.getSubnetmaskFromLocalStorage()
                );
            console.log(subnRes);
        };


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
        /*
        navigator.serviceWorker.controller.postMessage({
            type: 'MESSAGE_IDENTIFIER',
            message: this.testInput.value
          });
        */

        //var abCont = new AbortController
       // var timId = setTimeout(()=>{abCont.abort();}, 5000);

       fetch("https://localhost:"+ ConfigScanComponent.getHttpsPortFromLocalStorage()+ "/ping",{
        method: "GET",
        headers : {
            "Accept": "application/json",
        },
        signal: AbortSignal.timeout(ConfigScanComponent.getTimeoutFromLocalStorage())
       }).then(resp=>{

            resp.json().then(jsonOb=>{

                let resp:PingResponse = jsonOb;

                //LogMonitor.get().logMessage({type: LogType.INFO, message: JSON.stringify(jsonOb)});
                LogMonitor.get().logMessage({type: LogType.INFO, message: resp.response});
            });

        
       }).catch(reason=>{
        LogMonitor.get().logMessage({type: LogType.INFO, message: "<span style=\"color: red;\">"+reason+"</span>"});
       });
        
    }
    

    private onConfigButtonclk(mevt: MouseEvent){
        this.mainContent.replaceChildren(new ConfigScanComponent().render());
    }
}