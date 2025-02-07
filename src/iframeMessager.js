
let childURL = '*'
const iframe = document.querySelector("#childIframe");  // Correct selector (ID selector)

if (iframe) {
  const url = new URL(iframe.src);
  childURL = url.origin;
}


window.addEventListener("message", (event) => {
  // Reject messages from untrusted origins
  // if (event.origin !== window.location.origin) {
  //   console.error("Untrusted origin:", event.origin);
  //   return;
  // }

  if (event.data?.type === "SAVE_IFRAME_URL") {
    localStorage.setItem("lastIframeUrl", event.data.url); // Store before navigation
  }

  if (event.data?.type === "OPEN_IN_PARENT") {
    localStorage.setItem("lastIframeUrl", event.data.url); // Extra safeguard
    window.location.href = event.data.url; // Navigate parent
  }


});

iframe.addEventListener("load", () => {
  console.log('🚀🚀🚀 Hostname:', childURL);
  console.log("Iframe is loaded, sending message...");

  setTimeout(() => {
    if (iframe.contentWindow) {
      try {
        iframe.contentWindow.postMessage({ type: 'NAVIGATION_DATA', url: window.location.href }, childURL);
        console.log('✅ Sent NAVIGATION_DATA:');
      } catch (error) {
        console.error('❌ Error sending postMessage:', error);
      }
    } else {
      console.error("❌ iframe.contentWindow is not accessible.");
    }
  }, 1000); // Short delay to ensure iframe is ready
});