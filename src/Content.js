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
        Name: 'Your To Do',
        Navbar: 'nav',
        LinksSession: 'javascript:void(0)',

        Config() {
            const formatDateTime = (isoString) => {
                if (!isoString) return '';
                const date = new Date(isoString);
                if (isNaN(date.getTime())) return '';

                const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                const day = date.toLocaleDateString([], { day: 'numeric', month: 'short', year: 'numeric' });

                return `${time} - ${day}`;
            };

            this.formatDateTime = formatDateTime;

            return `
                <head>
                    <link
                        rel="stylesheet"
                        href="https://fonts.googleapis.com/css2?family=Material+Symbols:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200"
                    />
                </head>
            `
        },

        TodolistInput(
            DefineID = 'todo-input',
            DefineType = 'text',
            DefinePlaceholder = 'Add new task'
        ) {
            return `
                <input
                    id="${DefineID || this.DefineID}"
                    type="${DefineType || this.DefineType}"
                    class="TodolistInput"
                    placeholder="${DefinePlaceholder || this.DefinePlaceholder}"
                />
            `;
        },

        TaskItem(task) {
            if (!task || !task.id) return '';

            // Sanitize task message to prevent XSS
            const sanitizedMessage = typeof task.taskMessage === 'string'
                ? task.taskMessage.replace(/[<>&"']/g, (char) => {
                    const entities = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
                    return entities[char];
                })
                : '';

            const isCompleted = task.status === 'COMPLETED';
            const taskId = String(task.id).replace(/[^a-zA-Z0-9-_]/g, '');
            const createdAtFormatted = this.formatDateTime(task.createdAt);
            const updatedAtFormatted = this.formatDateTime(task.updatedAt);

            return `
                <div class="task" data-task-id="${taskId}">
                    <span class="check">
                        <input type="checkbox" class="task-checkbox" ${isCompleted ? 'checked' : ''}/>
                    </span>
                    <div class="task-content">
                        <p class="task-message ${isCompleted ? 'complete' : ''}">${sanitizedMessage}</p>
                        <p class="task-time">${isCompleted ? `Completed: ${updatedAtFormatted}` : `Created: ${createdAtFormatted}`}</p>
                    </div>
                    <span class="material-symbols delete-task-btn" type="submit">close</span>
                </div>  
            `;
        },

        Todolist(LinksSession, Links1 = "Cancel", Links2 = "Confirm") {
            const Void0 = LinksSession || this.LinksSession;
            return `
                <div class="tasks">
                    <div class="TasksContent">
                        <div class="TasksControls">
                            <h3>Named your tasks</h3>
                            <a class="material-symbols close-modal-btn"
                                type="submit"
                                href="${Void0}">close</a>
                        </div>
                        ${this.TodolistInput()}
                        <div class="TasksChoice">
                            <a href="${Void0}">${Links1}</a>
                            <a href="${Void0}" id="ChoiceHighlight" class="confirm-add-task-btn">${Links2}</a>
                        </div>
                    </div>          
                </div>  
            `;
        },

        TaskList(tasks = []) {
            if (!Array.isArray(tasks)) {
                console.warn('TaskList: tasks parameter should be an array, received:', typeof tasks);
                tasks = [];
            }

            const validTasks = tasks.filter(task =>
                task && typeof task === 'object' && task.id && task.taskMessage
            );

            const taskItems = validTasks.length > 0
                ? validTasks.map(task => this.TaskItem(task)).filter(item => item).join('')
                : '';

            const footerMessage = (() => {
                if (validTasks.length === 0) {
                    return 'Initial by going to add new task!';
                }

                const remainingCount = validTasks.filter(task =>
                    task.status !== 'COMPLETED'
                ).length;

                if (remainingCount === 0) {
                    return 'Great! Your work are all done.';
                }

                return `Your remaining To do: ${remainingCount}`;
            })();

            let mainContent;
            if (validTasks.length > 0) {
                mainContent = `<div class="task-list">${taskItems}</div>`;
            } else {
                mainContent = `
                    <div class="empty-state">
                        <p class="empty-message">There is no to-do list yet.<br>click '+' Top to add your first item!</p>
                    </div>
                `;
            }

            return `
                <main class="task-list-container">
                    ${mainContent}
                </main>
                <footer class="footer">
                    <h3>${footerMessage}</h3>
                </footer>
            `;
        },

        Introduce(Name, LinksSession) {
            const Content1 = Name || this.Name;
            const Void0 = LinksSession || this.LinksSession;
            return `
                <nav>
                    <div class="NavContent">
                        <h1>${Content1}</h1>
                        <div class="AddTask">
                            <a class="material-symbols add-btn"
                                type="submit"
                                href="${Void0}">add</a>
                        </div>
                    </div>
                </nav>
            `
        },

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

    ElementComponents(state = {}) {
        const tasks = state.tasks || [];
        return `
            ${this.HTMLContent.Introduce()}
            ${this.HTMLContent.Config()}
            ${this.HTMLContent.Todolist()}
            ${this.HTMLContent.TaskList(tasks)}
        `;
    },

    StyledElementComponents() {
        if (this._cachedCSS) return this._cachedCSS;

        const {
            DefaultFontFallback,
            Typeface,
            spacing,
            breakpoints,
        } = WebElements;

        // Hoist properties
        const normalizeCallReset = this.Normalize.CALLReset;
        const textRenderForce = this.TextRendering.ForceGrayStyleRendering;
        const textRenderSpecific = this.TextRendering.SpecificTargetingRendering;
        const Navbar = this.HTMLContent.Navbar;

        const primaryBodyFont = WebElements.Typeface[0] || '"Arial", sans-serif';
        const GlobalCSS = `
            :root {
                color-scheme: light dark;
            }

            * {
                box-sizing: border-box;
                -webkit-tap-highlight-color: transparent;
                ${normalizeCallReset};
                ${textRenderForce};
            }

            body {
                font-family: ${primaryBodyFont}, ${DefaultFontFallback};
                background-color: ${ThemeManager.colors.ColorPrimary};
                color: ${ThemeManager.colors.TextColorPrimaryText};
            }

            ${Navbar} {
                position: fixed;
                width: 100%;
                height: 68px;
                top: 0;
                max-width: 100%;
                min-width: 100%;
                z-index: 500;
                background-color: ${ThemeManager.colors.NavColorPrimary};
                backdrop-filter: blur(6px);
            }

            .NavContent {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 100%;
                padding: 0 18.5px;
            }

            .AddTask {
                display: flex;
                align-items: center;
            }

            .NavContent h1 {
                font-size: 20px;
                font-weight: 600;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                font-family: ${Typeface[0] || '"Arial", sans-serif'};
            }

            .AddTask a {
                display: flex;
                align-items: center;
                justify-content: center;
                width: fit-content;
                height: 40px;
                cursor: pointer;
                text-decoration: none;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                transition: filter 0.2s ${WebElements.easings.out};
                font-size: 28px;
            }
            
            .AddTask a:hover {
                filter: brightness(0.6);
            }

            .TodolistInput {
                height: 42.5px;
                padding: 0 ${spacing[0]};
                margin-top: ${spacing[5]};
                border: none;
                border-bottom: 1px solid ${ThemeManager.colors.BorderColor.ImageBorderCrop};
                background-color: transparent;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                font-family: inherit;
                font-size: 1rem;
                width: 99%;
                transform: translateX(1%);
                transition: all 300ms ${WebElements.easings.smooth};
                font-family: ${Typeface[6] || '"Arial", sans-serif'};
            }

            .TodolistInput:hover {
                filter: brightness(1.25);
            }

            .TodolistInput:focus {
                outline: none;
                border-bottom: solid 1px ${ThemeManager.colors.HighlightTagsColors.BG};
                filter: brightness(1.5);
            }

            .tasks {
                width: 100%;
                max-width: 100%;
                height: 100vh;
                overflow-y: auto;
                background-color: ${ThemeManager.colors.ColorPrimaryBlur};
                position: fixed;
                z-index: 1000;
                backdrop-filter: blur(30px);
                visibility: hidden;
                opacity: 0;
                pointer-events: none;
                transition: opacity 125ms cubic-bezier(0.4, 0, 0.2, 1), visibility 0s linear 125ms;
            }

            .tasks.is-visible {
                visibility: visible;
                opacity: 1;
                transition-delay: 0s;
                pointer-events: auto; 
            }

            .tasks.keyboard-visible .TasksContent {
                top: 10%;
                transform: translate(-50%, 0);
                transition: top 250ms ${WebElements.easings['in-out']}, transform 250ms ${WebElements.easings['in-out']};
            }

            .TasksContent {
                width: 325px;
                height: 200px;
                margin: 0 auto;
                ${this.StaticCSSvalues.CenterPositions.CALLPosition};
                position: ${WebElements.Units.CSSPosition[3]};
                background-color: ${ThemeManager.colors.ColorModelPrimary};
                border: 1px solid ${ThemeManager.colors.BorderColor.ImageBorderCrop};
                border-radius: ${WebElements.borderRadius.xl};
                padding: ${spacing[5]};
                transition: top 250ms ${WebElements.easings['in-out']}, transform 250ms ${WebElements.easings['in-out']};
            }

            .TasksControls {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .TasksControls h3 {
                font-size: 1.325rem;
                font-weight: 450;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                font-family: ${Typeface[0] || '"Arial", sans-serif'};
            }

            .TasksControls a {
                text-decoration: none;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                transition: filter 0.2s ${WebElements.easings.out};
            }

            .TasksControls a:hover {
                filter: brightness(0.6);
            }

            .TasksChoice {
                right: 0.75rem;
                bottom: 22.5px;
                position: absolute;
                display: flex;
                text-align: center;
            }

            .TasksChoice a {
                display: inline-block;
                margin-right: ${spacing[3]};
                padding: ${spacing[2.5]} ${spacing[5]};
                border-radius: ${WebElements.borderRadius.full};
                color: ${ThemeManager.colors.TextColorPrimaryText};
                text-decoration: none;
                transition: all 150ms ${WebElements.easings['in-out']};
                border: 1px solid ${ThemeManager.colors.BorderColor.ImageBorderCrop};
            }

            .TasksChoice a:hover {
                background-color: ${ThemeManager.colors.HighlightTags.TEXT};
                color: ${ThemeManager.colors.HighlightTags.BG};
            }

            #ChoiceHighlight {
                background-color: ${ThemeManager.colors.HighlightTagsColors.BG};
                color: ${ThemeManager.colors.HighlightTagsColors.TEXT};
            }

            #ChoiceHighlight:focus {
                background-color: ${ThemeManager.colors.HighlightTags.BG};
                color: ${ThemeManager.colors.HighlightTags.TEXT};
            }

            .task-list-container {
                padding: 90px ${spacing[5]} ${spacing[20]};
                max-width: 700px;
                margin: 0 auto;
                overflow-x: hidden;
            }

            .task-list {
                display: flex;
                flex-direction: column;
                gap: ${spacing[3]};
            }

            .empty-state {
                min-width: max-content;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 300px;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%,-50%);
            }

            .empty-message {
                text-align: center;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                opacity: 0.7;
                font-size: 1.1rem;
                line-height: 1.6;
            }

            .task {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: ${spacing[4]};
                padding: ${spacing[3.5]} ${spacing[4]};
                background-color: ${ThemeManager.colors.ColorModelPrimary};
                border: 1px solid ${ThemeManager.colors.BorderColor.ImageBorderCrop};
                border-radius: ${WebElements.borderRadius.lg};
                transition: all 200ms ${WebElements.easings['in-out']};
            }

            .task:hover {
                transform: translateY(-2px);
                box-shadow: ${WebElements.shadows.md};
            }

            .task:focus {
                transform: translateY(-2px);
                box-shadow: ${WebElements.shadows.sm};
            }

            .task .check {
                display: flex;
                align-items: center;
                flex-shrink: 0;
            }

            .task-checkbox {
                width: 20px;
                height: 20px;
                cursor: pointer;
            }

            .task-message {
                flex-grow: 1;
                font-size: clamp(0.925rem, 1.75vw, 1rem);
                margin: 0;
                transition: color 200ms, text-decoration 200ms;
                word-wrap: break-word;
                overflow-wrap: break-word;
                font-family: ${Typeface[8] || '"Arial", sans-serif'};
            }

            .task-time {
                opacity: 0.7;
                margin-top: 0.25rem;
                font-size: 0.8rem;
            }

            .task-message.complete {
                text-decoration: line-through;
                opacity: 0.5;
            }

            .delete-task-btn {
                cursor: pointer;
                opacity: 0.6;
                transition: opacity 200ms, color 200ms;
                flex-shrink: 0;
            }

            .delete-task-btn:hover {
                opacity: 1;
                color: #ff5252;
            }

            .footer {
                position: fixed;
                bottom: 45px;
                left: 50%;
                transform: translateX(-50%);    
                width: max-content;
                background-color: ${ThemeManager.colors.ColorModelPrimary};
                padding: ${spacing[3]} ${spacing[5]};
                text-align: center;
                box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
                border: 1px solid ${ThemeManager.colors.BorderColor.ImageBorderCrop};
                border-radius: ${WebElements.borderRadius.full};
            }

            .footer h3 {
                margin: 0;
                font-size: 1rem;
                font-weight: 400;
                color: ${ThemeManager.colors.TextColorPrimaryText};
                font-family: ${Typeface[6] || '"Arial", sans-serif'};
            }

            @media ${WebElements.DirectThemes[1]} {
                .TodolistInput:hover {
                    filter: brightness(0.65);
                }
                .TodolistInput:focus {
                    filter: brightness(0.2);
                }
                .footer {
                    box-shadow: ${WebElements.shadows.sm};
                }
            }

            @media (min-width: ${breakpoints.md}) {
                .NavContent {
                    max-width: 700px;
                    margin: 0 auto;
                }
            }

            ${textRenderSpecific}
        `;
        this._cachedCSS = GlobalCSS;
        return GlobalCSS;
    }
};