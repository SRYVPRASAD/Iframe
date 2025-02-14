
let childURL = '*'
const iframe = document.querySelector("#childIframe");  // Correct selector (ID selector)

if (iframe) {
  const url = new URL(iframe.src);
  childURL = url.origin;



  // Check if the childItemUrl exists and set it as iframe src
  const urlParams = new URLSearchParams(window.location.search);
  const childItemUrl = urlParams.get('childItem');

  if (childItemUrl) {
    iframe.src = childItemUrl;  // Update iframe src with the childItemUrl
    console.log("Updated iframe src:", iframe.src);
  }
}


window.addEventListener("message", (event) => {


  if (event.data?.type === "OPEN_IN_PARENT") {
    const currentUrl = window.location.href;
    localStorage.setItem("lastIframeUrl", event.data.url); // Extra safeguard
    const separator = event.data.url.includes('?') ? '&' : '?';
    const currentCLeanUrl = removeUnnecessaryParams(currentUrl)
    window.location.href = event.data.url + separator + 'redirect=' + encodeURIComponent(currentCLeanUrl);// Navigate parent
  }
});

iframe.addEventListener("load", () => {
  console.log("Iframe is loaded, sending message...");
  const currentUrl = window.location.href;
  const updatedURL = removeUnnecessaryParams(currentUrl)
  const urlParams = new URLSearchParams(window.location.search);
  const childItemUrl = urlParams.get('childItem');


  setTimeout(() => {
    if (iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage({ type: 'NAVIGATION_DATA', url: updatedURL }, childURL);
        console.log('✅ Sent NAVIGATION_DATA:');
      } catch (error) {
        console.error('❌ Error sending postMessage:', error);
      }
    } else {
      console.error("❌ iframe.contentWindow is not accessible.");
    }
  }, 1000); // Short delay to ensure iframe is ready
});



function removeUnnecessaryParams(url) {
  const urlObj = new URL(url);
  const paramsToRemove = ['FromIframe', 'redirect', 'childItem'];

  paramsToRemove.forEach(param => urlObj.searchParams.delete(param));

  return urlObj.toString();
}