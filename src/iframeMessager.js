
let childURL = '*'
const iframe = document.querySelector("#childIframe");  // Correct selector (ID selector)

// get and  set the iframe src
if (iframe) {
  const url = new URL(iframe.src);
  childURL = url.origin;

  // Check if the childItemUrl exists and set it as iframe src

  if (window.location.href.includes("?pathValues=")) {
    const pathNAME = extractPathValues(window.location.href)

    const recon = reconstructSrcUrl(pathNAME)
    console.log('new 🥌', childURL + recon)
    iframe.src = childURL + recon

  }
}


window.addEventListener("message", (event) => {
  if (event.data?.type === "OPEN_IN_PARENT") {
    localStorage.setItem("lastIframeUrl", event.data.url); // Extra safeguard
  }
});

iframe.addEventListener("load", () => {
  console.log("Iframe is loaded, sending message...");
  const currentUrl = window.location.href;
  const updatedURL = currentUrl.replace(/\?pathValues=\{.*?\}/, "")

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


function reconstructSrcUrl(queryString) {
  const params = new URLSearchParams(queryString);
  const searchParams = [];

  // Define the parameters you want to replace with '/'
  const keysToReplace = ['siteId', 'groupName', 'sceneId', 'viewId', 'navMode'];

  let output = [];

  // Process each key-value pair in the query string
  for (const [key, value] of params.entries()) {
    if (key.startsWith('customParams:')) {
      // Add searchParams to the searchParams array
      const searchKey = key.split(':')[1];
      searchParams.push(`${searchKey}=${value}`);
    } else if (keysToReplace.includes(key)) {
      // Replace matched keys with '/'
      output.push(value);
    } else {
      // For other parameters, just add them to searchParams
      searchParams.push(`${key}=${value}`);
    }
  }

  // Combine the output for path and searchParams for query string
  const baseUrl = output.length ? `/${output.join('/')}` : '';  // Join path segments with '/'

  // Only append '?' if there are search params
  const searchParamsStr = searchParams.length ? '?' + searchParams.join('&') : '';

  // Return the formatted URL
  return baseUrl + searchParamsStr;
}





function extractPathValues(url) {
  const match = url.match(/\{(.*)\}/); // Extract content inside {}
  return match ? match[1] : ""; // Return extracted part or empty string if not found
}