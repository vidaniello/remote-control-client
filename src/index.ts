//import * as pack from '../package.json';


const element = document.createElement('div');
element.innerHTML = 'Hi';


document.addEventListener('DOMContentLoaded', (f)=>{
    document.body.appendChild(element);
});

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then(registration => {
        console.log('SW registered: ', registration);
      }).catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
    });
  }