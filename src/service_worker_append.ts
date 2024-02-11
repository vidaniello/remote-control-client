
/*
console.log('im here');

self.addEventListener('fetch', event => {
    console.log('fetch request '+event);
});
*/

//https://felixgerschau.com/how-to-communicate-with-service-workers/
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'MESSAGE_IDENTIFIER') {
      // do something
      console.log('From tab: '+event.data.type+', message: '+event.data.message);
      MainClazz.get().postMessage("INFO", event.data.message);
    }
  });


class MainClazz {

    private static singl:MainClazz = new MainClazz();
    public static get():MainClazz {return MainClazz.singl;}

    private bc:BroadcastChannel;

    constructor(){
      this.bc = new BroadcastChannel('log-channel');
      this.postMessage("INFO", "MainClazz from serviceWorker initialized");
    }

    public postMessage(type:string, message:string){
      this.bc.postMessage({
        type: type,
        message: message
      });
    }
}

MainClazz.get();