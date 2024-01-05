
console.log('im here');

self.addEventListener('fetch', event => {
    console.log('fetch request '+event);
});