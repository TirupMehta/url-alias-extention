chrome.omnibox.onInputEntered.addListener((text) => {
  chrome.storage.sync.get('aliases', ({ aliases = {} }) => {
    const url = aliases[text];
    const targetUrl = url ? ensureProtocol(url) : 'https://www.google.com/search?q=' + encodeURIComponent(text);
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, { url: targetUrl });
      }
    });
  });
});

function ensureProtocol(url) {
  if (!/^https?:\/\//i.test(url)) {
    return 'https://' + url;
  }
  return url;
}