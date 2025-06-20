// Content.js Example to making content inside this file
// WebElements = Custon user agent stylesheet units 
import { WebElements, ThemeManager } from './AgentUtils.js';
export { WebElements };

export const WebContent = {
    _cachedCSS: null,
    PageTitle: 'MintKit',

    setThemeChangeCallback(callbackFromApp) {
        ThemeManager.setThemeChangeCallback(() => {
            this._cachedCSS = null;
            if (typeof callbackFromApp === 'function') {
                callbackFromApp();
            }
        });
    },

    HTMLContent: {
        Name: 'Todolist program',
        NameContent: 'Edit <code>./src/Content.js</code> to see progress',
        Introduce(Name, NameContent) {
            const Content1 = Name || this.Name;            
            const Content2 = NameContent || this.NameContent;    
            return `
                <div style="
                    padding: ${WebElements.spacing[4]};
                ">
                    <h1 style="
                        font-family: ${WebElements.Typeface[0] || '"Arial", sans-serif'};
                    ">
                    ${Content1}</h1>
                    <p style="
                        margin-top: ${WebElements.spacing[2]};
                    ">${Content2}</p>
                </div>
            `
        },
        MintAssemblySimpleAddition(variableAX = 200, variableBX = 'ax') {
            return `
                <Entry>
                    <mov dst="ax" src="${variableAX}"></mov>
                    <mov dst="bx" src="${variableBX}"></mov>
                    <print var="ax"></print>
                    <print var="bx"></print>
                </Entry>
            `;
        }
    },

    StaticCSSvalues: {
        CenterPositions: {
            CALL: `${WebElements.Units.CSSPosition[3]}`,
            PositionY: `
                top: 50%;
                transform: translateY(-50%);
            `,
            PositionX: `
                left: 50%;
                transform: translateX(-50%);
            `,
            get CALLPosition() {
                return `
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                `;
            },
        },
    },

    Normalize: {
        CALL: `${WebElements.Units.CSSSize.boxSizing};`,
        Unset: `
            margin: 0;
            padding: 0;
        `,
        get CALLReset() {
            return `
                ${WebElements.Units.CSSSize.boxSizing};
                margin: 0;
                padding: 0;
            `;
        }
    },

    TextRendering: {
        ForceGrayStyleRendering: `
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            font-smooth: never;
            text-rendering: geometricPrecision;
            -webkit-text-size-adjust: none;
            -moz-text-size-adjust: none;
            text-size-adjust: none;
            font-feature-settings: "kern" 1;
            font-synthesis: none;
        `,
        SpecificTargetingRendering: `
            html, body, h1, h2, h3, h4, h5, h6, p, span, div, a, button, input, textarea, label {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smooth: never;
                text-rendering: geometricPrecision;
            }

            input, textarea, button, select {
                -webkit-font-smoothing: antialiased;
                -moz-osx-font-smoothing: grayscale;
                font-smooth: never;
            }
        `,
    },

    ElementComponents() {
        return `
            ${this.HTMLContent.Introduce()}
        `;
    },

    ElementComponents2() {
        return `
            ${this.HTMLContent.MintAssemblySimpleAddition()}
        `;
    },

    // เช่นกันกับ CSS ว่าเราต้องการให้ไป style ในส่วนใหน
    StyledElementComponents() {
        if (this._cachedCSS) return this._cachedCSS;

        const {
            DefaultFontFallback,
            Typeface,
            // Units,
            // spacing,
            // borderRadius,
            // easings,
            // breakpoints,
        } = WebElements;

        // Hoist properties
        const normalizeCallReset = this.Normalize.CALLReset;
        const textRenderForce = this.TextRendering.ForceGrayStyleRendering;
        const textRenderSpecific = this.TextRendering.SpecificTargetingRendering;

        const primaryBodyFont = WebElements.Typeface[0] || '"Arial", sans-serif';

        const GlobalCSS = `
            :root {
                color-scheme: light dark;
            }

            * {
                ${normalizeCallReset};
                ${textRenderForce};
            }

            body {
                font-family: ${primaryBodyFont}, ${DefaultFontFallback};
                background-color: ${ThemeManager.colors.ColorPrimary};
                color: ${ThemeManager.colors.TextColorPrimaryText};
            }

            ${textRenderSpecific}; 
        `;
        this._cachedCSS = GlobalCSS;
        return GlobalCSS;
    }

};