//import * as pack from '../package.json';
/*
import favicon_16x316 from '../assets/favicon-16x16.png';
import favicon_32x32 from '../assets/favicon-32x32.png';
import apple_touch_icon from '../assets/apple-touch-icon.png';
import android_chrome_192x192 from '../assets/android-chrome-192x192.png';
import android_chrome_512x512 from '../assets/android-chrome-512x512.png';
*/
import {MainComponent} from './component'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js').then(registration => {
      console.log('SW registered: ', registration);
    }).catch(registrationError => {
      console.log('SW registration failed: ', registrationError);
    });
  });
}

try{
  const element = document.createElement('div');
  element.innerHTML = 'Remote control client';

  const main : MainComponent = new MainComponent();

  document.addEventListener('DOMContentLoaded', (f)=>{
    try{
      document.body.appendChild(element);
      document.body.appendChild(main.render());
    } catch(e){
      console.error(e);
    }
  });
} catch(e){
  console.error(e);
}
