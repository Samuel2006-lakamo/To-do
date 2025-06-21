import { Mint } from './core/mint.js';
import { Webfunctions } from './EventHandle.js';
import { WebContent, WebElements } from './Content.js';

const ROOT = '#app';
const MAIN_CONTAINER_ID = 'ROOT';
const MAIN_STYLESHEET_ID = 'main-dynamic-stylesheet';
const FONT_STYLESHEET_ID = 'fonts-stylesheet';

const SetHTMLtitle = `<title>${WebContent.PageTitle}</title>`;
const CONTAINER_ROOT = `<div id="${MAIN_CONTAINER_ID}">`;
const CONTAINER_CLOSE = '</div>';

const cache = {
    head: document.head,
    target: null,
    mainStyle: null,
    fontStyle: null,
    css: null,
    cssValid: false,
    html: null,
    htmlValid: false,
    components: {
        comp1: null,
        comp2: null,
    }
};

cache.target = document.querySelector(ROOT);

const generateMainStylesheet = () => {
    if (!cache.cssValid) {
        cache.css = WebContent.StyledElementComponents();
        cache.cssValid = true;
    }
    return cache.css;
};

// Page import
const getCachedComponents = (state) => {
    const comp1 = WebContent.ElementComponents(state);
    return comp1;
};

const Main = Mint.createState({ tasks: [] });

const Logger = {
    error: console.error.bind(console, '[Mintkit Error]'),
    info: console.info.bind(console, '[Mintkit]'),
    warn: console.warn.bind(console, '[Mintkit Warn]')
};

let renderQueued = false;
let lastHTML = '';

const queueRender = (currentState) => {
    if (renderQueued) return;
    renderQueued = true;
    requestAnimationFrame(() => {
        const html = CONTAINER_ROOT + getCachedComponents(currentState) + CONTAINER_CLOSE;

        if (html !== lastHTML) {
            lastHTML = html;
            Mint.injectHTML(ROOT, html);
        } else {
            console.warn('%c[Render] HTML is identical', 'color: #F97316', {
                tasksInState: currentState.tasks.length,
                newHTMLLength: html.length,
                lastHTMLLength: lastHTML.length
            });
        }
        renderQueued = false;
    });
};

let webFunctionsInitialized = false; // Add flag if Webfunctions call once
Main.subscribe((currentState) => {
    queueRender(currentState);
    if (currentState.tasks) {
        localStorage.setItem('tasks', JSON.stringify(currentState.tasks));
    }
    if (!webFunctionsInitialized && Webfunctions) {
        Webfunctions(Main);
        webFunctionsInitialized = true;
    }
});

const InitialMintkit = () => {
    // Font injection
    if (WebElements.StoredFontFamily && !cache.fontStyle) {
        cache.fontStyle = document.createElement('style');
        cache.fontStyle.id = FONT_STYLESHEET_ID;
        cache.fontStyle.textContent = WebElements.StoredFontFamily;
        cache.head.appendChild(cache.fontStyle);
    }

    // Main stylesheet creation
    if (!cache.mainStyle) {
        cache.mainStyle = document.createElement('style');
        cache.mainStyle.id = MAIN_STYLESHEET_ID;
        cache.head.appendChild(cache.mainStyle);
    }

    // Stylesheet content
    cache.mainStyle.textContent = generateMainStylesheet();

    Mint.injectTitle(SetHTMLtitle);

    WebContent.setThemeChangeCallback(() => {
        cache.cssValid = false;
        cache.mainStyle.textContent = generateMainStylesheet();
        Main.set(s => ({ ...s, _t: Date.now() }));
    });

    const initialTasks = JSON.parse(localStorage.getItem('tasks')) || [];
    Main.set({ tasks: initialTasks });
};

const startMintkit = () => {
    Mint.AdjustHook?.();
    InitialMintkit();
};

if (document.readyState === 'complete') {
    startMintkit();
} else if (document.readyState === 'interactive') {
    setTimeout(startMintkit, 0);
} else {
    document.addEventListener('DOMContentLoaded', startMintkit, { once: true });
}