
export class MainComponent{

    private mainContent: HTMLDivElement;
    private testButton: HTMLButtonElement;
    private testInput: HTMLInputElement;

    constructor(){
       
        this.mainContent = document.createElement('div');

        this.testButton = document.createElement('button');
        this.testButton.innerHTML = `Invia messaggio al SW`;

        //https://it.javascript.info/bind
        this.testButton.onclick = this.onBtTestClk.bind(this);


        this.mainContent.appendChild(this.testButton);

        this.testInput = document.createElement('input');
        this.testInput.style.width = '200px';
        this.testInput.value = 'Message to broadcast';
        this.mainContent.appendChild(this.testInput);

    }

    public render(): HTMLElement{
        return this.mainContent;
    }

    private onBtTestClk(mevt: MouseEvent){
        //alert('HI '+'');

        //https://felixgerschau.com/how-to-communicate-with-service-workers/
        
        navigator.serviceWorker.controller.postMessage({
            type: 'MESSAGE_IDENTIFIER',
            message: this.testInput.value
          });
        
        
    }
}