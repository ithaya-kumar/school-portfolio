const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('index.html', 'utf8');
const script = fs.readFileSync('script.js', 'utf8');

const dom = new JSDOM(html, { runScripts: 'dangerously' });

// inject script
const scriptEl = dom.window.document.createElement('script');
scriptEl.textContent = script;
dom.window.document.body.appendChild(scriptEl);

setTimeout(() => {
    try {
        const achBtn = dom.window.document.getElementById('ach-filter-academic');
        console.log('Before click Academic visible?', dom.window.document.querySelector('.ach-card[data-category="academic"]').style.display);
        console.log('Before click Sports visible?', dom.window.document.querySelector('.ach-card[data-category="sports"]').style.display);
        
        achBtn.click();
        
        console.log('After click Academic visible?', dom.window.document.querySelector('.ach-card[data-category="academic"]').style.display);
        console.log('After click Sports visible?', dom.window.document.querySelector('.ach-card[data-category="sports"]').style.display);
    } catch(e) {
        console.error(e);
    }
}, 1000);
