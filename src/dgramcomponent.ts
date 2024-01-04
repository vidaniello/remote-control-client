

export class MainComponent{

    private f: String;
    private mainContent: HTMLDivElement;
    private testButton: HTMLButtonElement;

    constructor(){

        this.mainContent = document.createElement('div');

        this.testButton = document.createElement('button');
        this.testButton.innerHTML = `Clicca qui`;
        this.testButton.onclick = (mevt)=>{alert('HI');};

        this.mainContent.appendChild(this.testButton);
    }

    public render(): HTMLElement{
        return this.mainContent;
    }
}