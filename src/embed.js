const iframe = document.getElementById('bimcontentframe')
let iframeActive = false
if (iframe != null) {
  iframeActive = true
  if (iframe.allow != "fullscreen") iframe.setAttribute('allowFullScreen', '');
  const params = getUrlVars()
  const store = params['store']
  const item = params['item']
  const preview = params['preview']
  let previewVar = ''
  if (typeof preview != 'undefined') {
    previewVar = '?preview=' + previewVar
    if (typeof item == "undefined") {
      iframe.src = iframe.src + previewVar
    }
  }
  if (typeof item != "undefined") {
    if (item.substring(0, 5) == 'list-') {
      iframe.src = "https://bimcontent.com/list/" + item.replace('list-', '') + "/?store=" + store + previewVar.replace("?", "&");
    } else {
      iframe.src = "https://bimcontent.com/download/" + item + "/store/" + store + "/" + previewVar;
    }
  }
  // sessionStorage.setItem("store", store);
}

//Add BIMcontentGTM tracker
//window.document.body.insertAdjacentHTML( 'afterbegin', '<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-PCL22TM" height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>' );
//(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-PCL22TM');

function iFrameResize() { }

window.addEventListener('message', function (e) {
  const eventName = e.data[0];
  const data = e.data[1];
  // var dataLayer = window.dataLayer = window.dataLayer || [];
  switch (eventName) {
    case 'refresh':
      location.reload();
      break;
    case 'setHeight':
      if (iframeActive) iframe.style.height = data + 'px';
      if (window.vueApp && window.vueApp.$nextTick) {
        window.vueApp.$nextTick(function () {
          document.getElementById('bimcontentframe').style.height = data + 'px';
        });
      }
      break;
    case 'scrollUp':
      if (iframeActive) {
        // var y = iframe.getBoundingClientRect().top + window.scrollY;
        window.scrollTo({ top: iframe.getBoundingClientRect().top, behavior: 'smooth' });
      }
      if (window.vueApp && window.vueApp.$nextTick) {
        window.vueApp.$nextTick(function () {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        })
      }
      break;
    // case 'eventClick':
    // var clickData = JSON.parse(data);
    // dataLayer.push({
    // 	'event': clickData.event,
    // 	'downloadType': clickData.downloadType,
    // 	'downloadFormat': clickData.downloadFormat,
    // 	'downloadFile': clickData.downloadFile,
    // 	'downloadSize': clickData.downloadSize,
    // 	'downloadQuantity': clickData.downloadQuantity 
    // });
    // break;
    // case 'pageView':
    // var viewData = JSON.parse(data);
    // dataLayer.push({
    // 	'event': 'Page_View',
    // 	'title' : viewData.title,
    // 	'currentSite' : viewData.currentSite,
    // 	'page_path' : viewData.page_path,
    // 	'statsID' : viewData.statsID
    // });
    // dataLayer.push({
    // 	'event': 'Page_View_Manufacturers',
    // 	'title' : viewData.title,
    // 	'currentSite' : viewData.currentSite,
    // 	'page_path' : viewData.page_path,
    // 	'statsID' : viewData.statsID
    // });
    // break;
    // case 'userData':
    // var viewData = JSON.parse(data);
    // dataLayer.push({
    // 	'userId' : viewData.userId,
    // 	'userCompany' : viewData.userCompany,
    // 	'primaryRole' : viewData.primaryRole,
    // 	'companyType' : viewData.companyType,
    // 	'companySize' : viewData.companySize,
    // 	'currentSite' : viewData.currentSite,
    // });
    // break;
    case 'copyLink':
      // const link = data;
      var copyLink = window.location.href;
      if (!data.includes('&item=')) {
        let id = data.split('download/')[1]
        id = id.split('/')[0]
        const store = data.split('?store=')[1]
        if (copyLink.includes('?')) {
          copyLink = copyLink + '&store=' + store + '&item=' + id
        } else {
          copyLink = copyLink + '?store=' + store + '&item=' + id
        }
      }
      navigator.clipboard.writeText(copyLink);
      break;
  }
}, false);

function getUrlVars() {
  const vars = {};
  window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}