import { Mint } from './core/mint.js';

export const Webfunctions = async (Main) => {
    const zoomPreventionState = Mint.createState({ preventedCount: 0 });

    const EventZoomHook = (state) => {
        document.addEventListener('keydown', async (event) => {
            if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=' || event.key === '-')) {
                event.preventDefault();
                await new Promise(resolve => setTimeout(resolve, 1));
                state.set(currentState => ({ preventedCount: currentState.preventedCount + 1 }));
                console.info(`[Mintkit States] Browser zoom prevented via keyboard: ${state.get().preventedCount}`);
            }
        });
        document.addEventListener('wheel', async (event) => {
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                await new Promise(resolve => setTimeout(resolve, 1));
                state.set(currentState => ({ preventedCount: currentState.preventedCount + 1 }));
                console.info(`[Mintkit States] Browser zoom prevented via mouse wheel: ${state.get().preventedCount}`);
            }
        }, { passive: false });
    };

    EventZoomHook(zoomPreventionState);
};