
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
      event.
    }
  });