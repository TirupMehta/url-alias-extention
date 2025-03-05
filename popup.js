document.addEventListener('DOMContentLoaded', () => {
  const aliasInput = document.getElementById('alias');
  const urlInput = document.getElementById('url');
  const addBtn = document.getElementById('add-btn');
  const aliasList = document.getElementById('alias-list');

  loadAliases();

  addBtn.addEventListener('click', () => {
    const alias = aliasInput.value.trim();
    const url = urlInput.value.trim();
    if (alias && url) {
      chrome.storage.sync.get('aliases', ({ aliases = {} }) => {
        aliases[alias] = url;
        chrome.storage.sync.set({ aliases }, () => {
          aliasInput.value = '';
          urlInput.value = '';
          loadAliases();
        });
      });
    } else {
      alert('Please enter both an alias and a URL.');
    }
  });
});

function loadAliases() {
  const aliasList = document.getElementById('alias-list');
  aliasList.innerHTML = '';
  chrome.storage.sync.get('aliases', ({ aliases = {} }) => {
    for (const [alias, url] of Object.entries(aliases)) {
      const li = document.createElement('li');
      li.innerHTML = `<span>${alias}: ${url}</span><button data-alias="${alias}">Delete</button>`;
      li.querySelector('button').addEventListener('click', (e) => {
        const aliasToDelete = e.target.dataset.alias;
        if (confirm(`Are you sure you want to delete the alias "${aliasToDelete}"?`)) {
          chrome.storage.sync.get('aliases', ({ aliases }) => {
            delete aliases[aliasToDelete];
            chrome.storage.sync.set({ aliases }, loadAliases);
          });
        }
      });
      aliasList.appendChild(li);
    }
  });
}