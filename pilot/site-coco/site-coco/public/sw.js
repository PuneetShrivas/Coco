if(!self.define){let e,a={};const i=(i,s)=>(i=new URL(i+".js",s).href,a[i]||new Promise((a=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=a,document.head.appendChild(e)}else e=i,importScripts(i),a()})).then((()=>{let e=a[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(s,n)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(a[c])return;let r={};const o=e=>i(e,c),d={module:{uri:c},exports:r,require:o};a[c]=Promise.all(s.map((e=>d[e]||o(e)))).then((e=>(n(...e),r)))}}define(["./workbox-2e6be583"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/Coco.html",revision:"1dd20cd3e4dcecd9f53a711d20cae9f6"},{url:"/_next/app-build-manifest.json",revision:"8dac142a32d39fcdf2642c06f1692460"},{url:"/_next/static/8kAkqBIF_IWQFGHxYlsmQ/_buildManifest.js",revision:"1746b61bc7dc1e3bfda9e7d87bdf7f83"},{url:"/_next/static/8kAkqBIF_IWQFGHxYlsmQ/_ssgManifest.js",revision:"b6652df95db52feb4daf4eca35380933"},{url:"/_next/static/chunks/162-6d8cf5a8eb9237ac.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/45-020858eba8e115f5.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/520-6c8ac7663aff589b.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/71-8df8c7ebd9e78ddb.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/796-bf258c06f8492265.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/872-6fc143b2cd5bfdd8.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/91e4732f-1a774dd0ea338821.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/app/_not-found/page-b8ca119ee5a56708.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/app/assistant/page-7f729148a994be24.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/app/auth-callback/page-ef8ef37e129dbaa8.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/app/dashboard/page-3482043dca755743.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/app/layout-e14f08b3dd3c6dc2.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/app/page-37c09158fbd6ddf1.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/c4e3e400-4687661e3e2016ae.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/framework-6e06c675866dc992.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/main-app-2238bfd3873154b1.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/main-f0c78137a6167487.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/pages/_app-66e4d10fa998823f.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/pages/_error-9bb754751675fab7.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/chunks/polyfills-78c92fac7aa8fdd8.js",revision:"79330112775102f91e1010318bae2bd3"},{url:"/_next/static/chunks/webpack-e3f0b4a86f713b6f.js",revision:"8kAkqBIF_IWQFGHxYlsmQ"},{url:"/_next/static/css/2532a1207fc35ce6.css",revision:"2532a1207fc35ce6"},{url:"/_next/static/css/2f71e0d51b6954c9.css",revision:"2f71e0d51b6954c9"},{url:"/_next/static/css/5509b8e8864b60c1.css",revision:"5509b8e8864b60c1"},{url:"/_next/static/css/871b6a8d5298964c.css",revision:"871b6a8d5298964c"},{url:"/_next/static/css/de983587ba8bd19d.css",revision:"de983587ba8bd19d"},{url:"/_next/static/css/f197de57dc22252c.css",revision:"f197de57dc22252c"},{url:"/_next/static/media/05a31a2ca4975f99-s.woff2",revision:"f1b44860c66554b91f3b1c81556f73ca"},{url:"/_next/static/media/1ab789535f7dc6ba-s.woff2",revision:"8a365ee700a44e1369b762a3d0950614"},{url:"/_next/static/media/513657b02c5c193f-s.woff2",revision:"c4eb7f37bc4206c901ab08601f21f0f2"},{url:"/_next/static/media/51ed15f9841b9f9d-s.woff2",revision:"bb9d99fb9bbc695be80777ca2c1c2bee"},{url:"/_next/static/media/561b5dc1dcd79b2c-s.woff2",revision:"bf46a5f9f4acae1242fb2e122356dd0e"},{url:"/_next/static/media/59df03d642d74c2d-s.p.woff2",revision:"2e465c2f5f892f89601c563927185092"},{url:"/_next/static/media/5e1fa1a4c800f7f9-s.woff2",revision:"ab2014b787edac52e6a5d80e27b04de8"},{url:"/_next/static/media/7c45a89e6c7617a8-s.p.woff2",revision:"f5ab529ce356b5f89ab0dac6eed9a4d4"},{url:"/_next/static/media/94a97f3a85bceae4-s.p.woff2",revision:"04e8d26e352ccbb250f396af421c2cff"},{url:"/_next/static/media/a4a5a7b7487c7f8f-s.p.otf",revision:"2674b2a912c2b773bff0b8ae5dfc4a68"},{url:"/_next/static/media/c9a5bc6a7c948fb0-s.p.woff2",revision:"74c3556b9dad12fb76f84af53ba69410"},{url:"/_next/static/media/d6b16ce4a6175f26-s.woff2",revision:"dd930bafc6297347be3213f22cc53d3e"},{url:"/_next/static/media/dd436f0e181c17cd-s.woff2",revision:"0a6bd5b4464bbba3f9623fdab0a31fc3"},{url:"/_next/static/media/ec159349637c90ad-s.woff2",revision:"0e89df9522084290e01e4127495fae99"},{url:"/_next/static/media/ececc1349422a984-s.woff2",revision:"e21eefe6e79428e62f60318f7bbb69fc"},{url:"/_next/static/media/ee24c974f6d04ae7-s.p.woff2",revision:"b44c6bb7e5986927f2000726dc5dcd3d"},{url:"/_next/static/media/f4302afab97e0b4f-s.woff2",revision:"cd2fda1cac9abb4ab3d89b0943837e59"},{url:"/_next/static/media/fd4db3eb5472fc27-s.woff2",revision:"71f3fcaf22131c3368d9ec28ef839831"},{url:"/android/android-launchericon-144-144.png",revision:"b1fc8f17fe1ece6428985a1b7e1c7fd3"},{url:"/android/android-launchericon-192-192.png",revision:"da5d8cb885e21d94fc3385337faacea7"},{url:"/android/android-launchericon-48-48.png",revision:"802f6061b2ae8ac6d74f5f39f9d1b979"},{url:"/android/android-launchericon-512-512.png",revision:"6b6d569dc6814e1fd0c46461d86c8466"},{url:"/android/android-launchericon-72-72.png",revision:"8f70cacccf057bcad9fa37fe820c9d87"},{url:"/android/android-launchericon-96-96.png",revision:"76ba51e42f381f53dbad83a01b4d849d"},{url:"/favicon.ico",revision:"f3b0542cdce39153d7c1133d9a8ed408"},{url:"/icons/android-chrome-192x192.png",revision:"0faec4e59f29164c9d71a152cbd8df72"},{url:"/icons/android-chrome-512x512.png",revision:"e03beb8d55efdb6d7e1145d3e78be4b2"},{url:"/icons/apple-touch-icon.png",revision:"76abd9113ec28ba7d106d97b6255da37"},{url:"/icons/favicon-16x16.png",revision:"b1055aab547aedb4412418468fd3d3b0"},{url:"/icons/favicon-32x32.png",revision:"04b1136591a578b214f924eb4e4df40b"},{url:"/icons/favicon.ico",revision:"f3b0542cdce39153d7c1133d9a8ed408"},{url:"/illustration.svg",revision:"908ea66b3e05d74a8356763aad21609b"},{url:"/image1.jpg",revision:"d903c75aa133dc358d8b4f7676b4cf10"},{url:"/image2.jpg",revision:"572d3d684caba8b42d675c3bfdfaabd1"},{url:"/image3.jpg",revision:"9b1e1641b5b579d8376b0ce876854280"},{url:"/image4.jpg",revision:"d8a8cc3a387e9a0658d51930a60e0939"},{url:"/image5.jpg",revision:"6e0084e4ed9bae7fa6ec18f332cc4e7f"},{url:"/ios/100.png",revision:"03df7c3bdb856fabe19af33dd66745e6"},{url:"/ios/1024.png",revision:"4bae7e06cd9ae99b1f9bdb07e0b2308e"},{url:"/ios/114.png",revision:"739aa44c9e25e0263146cbc53b54b093"},{url:"/ios/120.png",revision:"5f8d4e77c3e33ce72f80f22b14100c76"},{url:"/ios/128.png",revision:"555fc90676c6c74cdc3e730fe75ef4d4"},{url:"/ios/144.png",revision:"b1fc8f17fe1ece6428985a1b7e1c7fd3"},{url:"/ios/152.png",revision:"85def0227861466ec54bc39bce407134"},{url:"/ios/16.png",revision:"f107559fd696edd9b7b02a0cbf8ffe3c"},{url:"/ios/167.png",revision:"762b2ca16064786367369a2f8284dd47"},{url:"/ios/180.png",revision:"899553a6652974af1f7fc40989cbe6ca"},{url:"/ios/192.png",revision:"da5d8cb885e21d94fc3385337faacea7"},{url:"/ios/20.png",revision:"9424194f4c4a8e7a45ed767c7872c5d8"},{url:"/ios/256.png",revision:"19cead1445f05e3715e070265187c74f"},{url:"/ios/29.png",revision:"4b9fbad12a1bc469fb843eaad12256e5"},{url:"/ios/32.png",revision:"e022b154084fc5fc78c60e033369a0fd"},{url:"/ios/40.png",revision:"54709cda0af73eddf87810ec445f459c"},{url:"/ios/50.png",revision:"efaa0247eb7873de372a44ca494d3115"},{url:"/ios/512.png",revision:"6b6d569dc6814e1fd0c46461d86c8466"},{url:"/ios/57.png",revision:"88cc9e81f44e953ec45d8f1b9f8179ce"},{url:"/ios/58.png",revision:"41b0b79997cc9db129b97e06821cb17d"},{url:"/ios/60.png",revision:"d44fb249e968d2f3a2ed78dd7882beb6"},{url:"/ios/64.png",revision:"6348f04d325ac1d8a7c0e3460b271968"},{url:"/ios/72.png",revision:"8f70cacccf057bcad9fa37fe820c9d87"},{url:"/ios/76.png",revision:"7dcb93a5ef30a47e1d595ed3748b0bb4"},{url:"/ios/80.png",revision:"82b53c321f911d4f40e4c7423e245ba8"},{url:"/ios/87.png",revision:"f114ba81a480069560404cc485d50ab4"},{url:"/logo_head.webp",revision:"e4a5a12ac3f83486344b57a6e3e0ecff"},{url:"/manifest.json",revision:"ccc03776e20ec300ea9c6e3671635ae3"},{url:"/placeholder.jpg",revision:"ebe1d1d3ae4506fbb9177ec83d461c93"},{url:"/placeholder.svg",revision:"35707bd9960ba5281c72af927b79291f"},{url:"/shoppingassistant.png",revision:"fbe96c79eb0e137fe41c4524f840887c"},{url:"/site.webmanifest",revision:"053100cb84a50d2ae7f5492f7dd7f25e"},{url:"/tryon.png",revision:"4228edc98bff222d59b45cbb1c860a00"},{url:"/wardrobe.png",revision:"359c4367e922236f674b65a7a0435b16"},{url:"/windows11/LargeTile.scale-100.png",revision:"63fc872a18f15fe0397c3ce2c9f61982"},{url:"/windows11/LargeTile.scale-125.png",revision:"99d628e3a7e4a5f448128e6eabad1d4c"},{url:"/windows11/LargeTile.scale-150.png",revision:"db782d94f966589c9be1f8b6356f8ba8"},{url:"/windows11/LargeTile.scale-200.png",revision:"f1ad294bd12851d14ccc7c10bf978230"},{url:"/windows11/LargeTile.scale-400.png",revision:"de9acf70176be0fd063fae35eb6958ef"},{url:"/windows11/SmallTile.scale-100.png",revision:"418dd98545a52fb9354eec7fa0df308b"},{url:"/windows11/SmallTile.scale-125.png",revision:"b19bf8f04ca30ea5ac66648e003e03ff"},{url:"/windows11/SmallTile.scale-150.png",revision:"8f8df7c5311f5518031ee2b08c7cbdb5"},{url:"/windows11/SmallTile.scale-200.png",revision:"ea50561fe716cb0f2d93d328b204a280"},{url:"/windows11/SmallTile.scale-400.png",revision:"0c7d6a06ee081d7e3f4197e3a208a5bf"},{url:"/windows11/SplashScreen.scale-100.png",revision:"772eed03ba2c9f47a6e9153cb0222b39"},{url:"/windows11/SplashScreen.scale-125.png",revision:"bbebcdfe6cbff4dcb35dcaac01acd186"},{url:"/windows11/SplashScreen.scale-150.png",revision:"7c95b885896e0208640bae07a30efe89"},{url:"/windows11/SplashScreen.scale-200.png",revision:"3cef67ff37f1b3560b6f49eb7f8d2cd6"},{url:"/windows11/SplashScreen.scale-400.png",revision:"cbcc04c274ff179338116a8c54465d8f"},{url:"/windows11/Square150x150Logo.scale-100.png",revision:"190aee30f9f61de586633bd8673d7122"},{url:"/windows11/Square150x150Logo.scale-125.png",revision:"6f7e93e0205aad56a9c72e4bc1c48dc6"},{url:"/windows11/Square150x150Logo.scale-150.png",revision:"29e6da375576f20f5b050ed2fc860a38"},{url:"/windows11/Square150x150Logo.scale-200.png",revision:"c6f04579c5b29a91efd2e4ab8fdec42c"},{url:"/windows11/Square150x150Logo.scale-400.png",revision:"da0698177bc078d1fe42fc6ef3eda5fd"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-16.png",revision:"46cdb0a0adf63e6d5fe68856b1db40a8"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-20.png",revision:"d5ebd4f5c9c7225db685a5bad9a6adce"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-24.png",revision:"f10e04dd31f1809c77590be35a2479a6"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-256.png",revision:"d7100396c6cbab8772e877adccdef05c"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-30.png",revision:"1888eb387c3c86ea188e0fa6264f0c0f"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-32.png",revision:"0f2c7d9752c2a309f1d115f085a3c495"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-36.png",revision:"27f6b0879f7ca2e6c9e9995ea82042fe"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-40.png",revision:"bea799618f32e8e9a24baec7ac5944a5"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-44.png",revision:"c192668efb7ab4821cf3f32c9874af7a"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-48.png",revision:"8c781adc7565e2d5c7a26ea3dfde39a0"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-60.png",revision:"7ae99933e52cc09f9cecdac939209ffd"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-64.png",revision:"eff0b78ca75df76648abc538ff9f34c5"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-72.png",revision:"39060f825c2ea6be23e00dd3ba236842"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-80.png",revision:"88da757798fbcad10a90230b1cfc8960"},{url:"/windows11/Square44x44Logo.altform-lightunplated_targetsize-96.png",revision:"818eb66f10e50e9812650a413df07427"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-16.png",revision:"46cdb0a0adf63e6d5fe68856b1db40a8"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-20.png",revision:"d5ebd4f5c9c7225db685a5bad9a6adce"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-24.png",revision:"f10e04dd31f1809c77590be35a2479a6"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-256.png",revision:"d7100396c6cbab8772e877adccdef05c"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-30.png",revision:"1888eb387c3c86ea188e0fa6264f0c0f"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-32.png",revision:"0f2c7d9752c2a309f1d115f085a3c495"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-36.png",revision:"27f6b0879f7ca2e6c9e9995ea82042fe"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-40.png",revision:"bea799618f32e8e9a24baec7ac5944a5"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-44.png",revision:"c192668efb7ab4821cf3f32c9874af7a"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-48.png",revision:"8c781adc7565e2d5c7a26ea3dfde39a0"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-60.png",revision:"7ae99933e52cc09f9cecdac939209ffd"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-64.png",revision:"eff0b78ca75df76648abc538ff9f34c5"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-72.png",revision:"39060f825c2ea6be23e00dd3ba236842"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-80.png",revision:"88da757798fbcad10a90230b1cfc8960"},{url:"/windows11/Square44x44Logo.altform-unplated_targetsize-96.png",revision:"818eb66f10e50e9812650a413df07427"},{url:"/windows11/Square44x44Logo.scale-100.png",revision:"c192668efb7ab4821cf3f32c9874af7a"},{url:"/windows11/Square44x44Logo.scale-125.png",revision:"c28a270c11c68105f35c472821d670df"},{url:"/windows11/Square44x44Logo.scale-150.png",revision:"dfaa16452530dbd88ae9efdd11878b57"},{url:"/windows11/Square44x44Logo.scale-200.png",revision:"8c54bbee1fd1d7f5ba1473a557b56922"},{url:"/windows11/Square44x44Logo.scale-400.png",revision:"99d132951e9b189b8647e2a85238bbb5"},{url:"/windows11/Square44x44Logo.targetsize-16.png",revision:"46cdb0a0adf63e6d5fe68856b1db40a8"},{url:"/windows11/Square44x44Logo.targetsize-20.png",revision:"d5ebd4f5c9c7225db685a5bad9a6adce"},{url:"/windows11/Square44x44Logo.targetsize-24.png",revision:"f10e04dd31f1809c77590be35a2479a6"},{url:"/windows11/Square44x44Logo.targetsize-256.png",revision:"d7100396c6cbab8772e877adccdef05c"},{url:"/windows11/Square44x44Logo.targetsize-30.png",revision:"1888eb387c3c86ea188e0fa6264f0c0f"},{url:"/windows11/Square44x44Logo.targetsize-32.png",revision:"0f2c7d9752c2a309f1d115f085a3c495"},{url:"/windows11/Square44x44Logo.targetsize-36.png",revision:"27f6b0879f7ca2e6c9e9995ea82042fe"},{url:"/windows11/Square44x44Logo.targetsize-40.png",revision:"bea799618f32e8e9a24baec7ac5944a5"},{url:"/windows11/Square44x44Logo.targetsize-44.png",revision:"c192668efb7ab4821cf3f32c9874af7a"},{url:"/windows11/Square44x44Logo.targetsize-48.png",revision:"8c781adc7565e2d5c7a26ea3dfde39a0"},{url:"/windows11/Square44x44Logo.targetsize-60.png",revision:"7ae99933e52cc09f9cecdac939209ffd"},{url:"/windows11/Square44x44Logo.targetsize-64.png",revision:"eff0b78ca75df76648abc538ff9f34c5"},{url:"/windows11/Square44x44Logo.targetsize-72.png",revision:"39060f825c2ea6be23e00dd3ba236842"},{url:"/windows11/Square44x44Logo.targetsize-80.png",revision:"88da757798fbcad10a90230b1cfc8960"},{url:"/windows11/Square44x44Logo.targetsize-96.png",revision:"818eb66f10e50e9812650a413df07427"},{url:"/windows11/StoreLogo.scale-100.png",revision:"efaa0247eb7873de372a44ca494d3115"},{url:"/windows11/StoreLogo.scale-125.png",revision:"3c06de42a985752a2245064adb8fcfcc"},{url:"/windows11/StoreLogo.scale-150.png",revision:"5faa56756c71081a4200a328375d991e"},{url:"/windows11/StoreLogo.scale-200.png",revision:"03df7c3bdb856fabe19af33dd66745e6"},{url:"/windows11/StoreLogo.scale-400.png",revision:"28e5f0ae3fdff9fe9d76f4b37090f3cb"},{url:"/windows11/Wide310x150Logo.scale-100.png",revision:"b599d3fc5cd2e4f2badc251a6a62e71e"},{url:"/windows11/Wide310x150Logo.scale-125.png",revision:"6cfb3a31ac9c2e75154bcf3dbed6bfb6"},{url:"/windows11/Wide310x150Logo.scale-150.png",revision:"8bbc8d268517d48da9698d050444b415"},{url:"/windows11/Wide310x150Logo.scale-200.png",revision:"772eed03ba2c9f47a6e9153cb0222b39"},{url:"/windows11/Wide310x150Logo.scale-400.png",revision:"3cef67ff37f1b3560b6f49eb7f8d2cd6"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:a,event:i,state:s})=>a&&"opaqueredirect"===a.type?new Response(a.body,{status:200,statusText:"OK",headers:a.headers}):a}]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:gstatic)\.com\/.*/i,new e.CacheFirst({cacheName:"google-fonts-webfonts",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:31536e3})]}),"GET"),e.registerRoute(/^https:\/\/fonts\.(?:googleapis)\.com\/.*/i,new e.StaleWhileRevalidate({cacheName:"google-fonts-stylesheets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:eot|otf|ttc|ttf|woff|woff2|font.css)$/i,new e.StaleWhileRevalidate({cacheName:"static-font-assets",plugins:[new e.ExpirationPlugin({maxEntries:4,maxAgeSeconds:604800})]}),"GET"),e.registerRoute(/\.(?:jpg|jpeg|gif|png|svg|ico|webp)$/i,new e.StaleWhileRevalidate({cacheName:"static-image-assets",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+$/i,new e.StaleWhileRevalidate({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:64,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp3|wav|ogg)$/i,new e.CacheFirst({cacheName:"static-audio-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:mp4)$/i,new e.CacheFirst({cacheName:"static-video-assets",plugins:[new e.RangeRequestsPlugin,new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:js)$/i,new e.StaleWhileRevalidate({cacheName:"static-js-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:css|less)$/i,new e.StaleWhileRevalidate({cacheName:"static-style-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\/_next\/data\/.+\/.+\.json$/i,new e.StaleWhileRevalidate({cacheName:"next-data",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute(/\.(?:json|xml|csv)$/i,new e.NetworkFirst({cacheName:"static-data-assets",plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;const a=e.pathname;return!a.startsWith("/api/auth/")&&!!a.startsWith("/api/")}),new e.NetworkFirst({cacheName:"apis",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:16,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>{if(!(self.origin===e.origin))return!1;return!e.pathname.startsWith("/api/")}),new e.NetworkFirst({cacheName:"others",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:86400})]}),"GET"),e.registerRoute((({url:e})=>!(self.origin===e.origin)),new e.NetworkFirst({cacheName:"cross-origin",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:32,maxAgeSeconds:3600})]}),"GET")}));
