import { Mint } from './core/mint.js';

export const Webfunctions = async (Main) => {
    const zoomPreventionState = Mint.createState({ preventedCount: 0 });
    const keyboardState = Mint.createState({ isVisible: false });
    const taskModalState = Mint.createState({ isOpen: false });

    const EventZoomHook = (state) => {
        document.addEventListener('keydown', async (event) => {
            if ((event.ctrlKey || event.metaKey) && (event.key === '+' || event.key === '=' || event.key === '-')) {
                event.preventDefault();
                await new Promise(resolve => setTimeout(resolve, 1));
                state.set(currentState => ({ preventedCount: currentState.preventedCount + 1 }));
            }
        });
        
        document.addEventListener('wheel', async (event) => {
            if (event.ctrlKey || event.metaKey) {
                event.preventDefault();
                await new Promise(resolve => setTimeout(resolve, 1));
                state.set(currentState => ({ preventedCount: currentState.preventedCount + 1 }));
            }
        }, { passive: false });
    };

    const handleKeyboardShift = (state) => {
        const isMobileTouch = () =>
            ('ontouchstart' in window || navigator.maxTouchPoints > 0) &&
            window.matchMedia("(max-width: 768px)").matches;

        document.addEventListener('focusin', (event) => {
            if (isMobileTouch() && event.target.matches('.TodolistInput')) {
                state.set({ isVisible: true });
            }
        });

        document.addEventListener('focusout', (event) => {
            if (isMobileTouch() && event.target.matches('.TodolistInput')) {
                setTimeout(() => {
                    if (!document.querySelector('.TodolistInput:focus')) {
                        state.set({ isVisible: false });
                    }
                }, 100);
            }
        });
    };

    const handleAllAppActions = (mainState, modalState) => {
        const generatedId = () => Date.now();

        // Validate task data
        const isValidTask = (task) => {
            return task && 
                   typeof task === 'object' && 
                   task.id && 
                   typeof task.taskMessage === 'string' && 
                   task.taskMessage.trim().length > 0;
        };

        document.addEventListener('click', (event) => {
            const target = event.target;
            const currentTasks = mainState.get().tasks || [];

            if (target.closest('.add-btn')) {
                event.preventDefault();
                modalState.set({ isOpen: true });
                console.info('[Modal] Task creation modal opened');

                setTimeout(() => {
                    const input = document.querySelector('#todo-input');
                    if (input) {
                        input.focus();
                    }
                }, 100);
                return;
            }

            // Handle confirm add task
            if (target.closest('.confirm-add-task-btn')) {
                event.preventDefault();
                const input = document.querySelector('#todo-input');
                
                if (!input) {
                    console.error('[Actions] Todo input not found');
                    return;
                }

                const taskMessage = input.value.trim();

                if (taskMessage && taskMessage.length <= 500) { // Add length validation
                    const newTask = { 
                        taskMessage, 
                        id: generatedId(), 
                        status: 'NOT-COMPLETE',
                        createdAt: new Date().toISOString()
                    };
                    
                    if (isValidTask(newTask)) {
                        mainState.set({ tasks: [...currentTasks, newTask] });
                        input.value = '';
                        modalState.set({ isOpen: false });
                    } else {
                        console.error('[Actions] Invalid task data:', newTask);
                    }
                } else if (taskMessage.length > 500) {
                    alert('Task message is too long. Please keep it under 500 characters.');
                } else {
                    console.warn('[Actions] Empty task message ignored');
                    if (input) {
                        input.style.animation = 'shake 0.5s';
                        setTimeout(() => {
                            input.style.animation = '';
                        }, 500);
                    }
                }
                return;
            }

            const deleteBtn = target.closest('.delete-task-btn');
            if (deleteBtn) {
                const taskElement = deleteBtn.closest('.task');
                if (!taskElement) {
                    console.error('[Actions] Task element not found for delete action');
                    return;
                }

                const taskId = Number(taskElement.dataset.taskId);
                if (isNaN(taskId)) {
                    console.error('[Actions] Invalid task ID for deletion:', taskElement.dataset.taskId);
                    return;
                }

                const taskToDelete = currentTasks.find(task => task.id === taskId);
                if (taskToDelete) {
                    const newTasks = currentTasks.filter(task => task.id !== taskId);
                    mainState.set({ tasks: newTasks });
                } else {
                    console.error('[Actions] Task not found for deletion with ID:', taskId);
                }
                return;
            }

            // Handle checkbox toggle
            const checkbox = target.closest('.task-checkbox');
            if (checkbox) {
                const taskElement = checkbox.closest('.task');
                if (!taskElement) {
                    console.error('[Actions] Task element not found for checkbox action');
                    return;
                }

                const taskId = Number(taskElement.dataset.taskId);
                if (isNaN(taskId)) {
                    console.error('[Actions] Invalid task ID for toggle:', taskElement.dataset.taskId);
                    return;
                }

                const taskToUpdate = currentTasks.find(task => task.id === taskId);
                if (taskToUpdate) {
                    const newStatus = taskToUpdate.status === 'COMPLETED' ? 'NOT-COMPLETE' : 'COMPLETED';
                    const newTasks = currentTasks.map(task =>
                        task.id === taskId 
                            ? { ...task, status: newStatus, updatedAt: new Date().toISOString() }
                            : task,
                    );
                    
                    mainState.set({ tasks: newTasks });
                    console.info(`[Actions] Task ${newStatus === 'COMPLETED' ? 'completed' : 'uncompleted'}: "${taskToUpdate.taskMessage}"`);
                } else {
                    console.error('[Actions] Task not found for toggle with ID:', taskId);
                }
                return;
            }

            // Handle modal close actions
            const tasksModal = document.querySelector('.tasks');
            if (tasksModal && tasksModal.classList.contains('is-visible')) {
                const closeBtn = target.closest('.close-modal-btn');
                const cancelBtn = target.closest('.TasksChoice a:not(#ChoiceHighlight)');
                const isBackdrop = target === tasksModal;
                const isTasksContent = target.closest('.TasksContent');

                if ((closeBtn || cancelBtn || (isBackdrop && !isTasksContent))) {
                    event.preventDefault();
                    modalState.set({ isOpen: false });
                    console.info('[Modal] Task creation modal closed');
                    
                    const input = document.querySelector('#todo-input');
                    if (input) {
                        input.value = '';
                    }
                }
            }
        });

        // Handle Enter key in input
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                const input = document.querySelector('#todo-input');
                if (input && input === event.target) {
                    event.preventDefault();
                    const confirmBtn = document.querySelector('.confirm-add-task-btn');
                    if (confirmBtn) {
                        confirmBtn.click();
                    }
                    return;
                }
            }

            if (event.key === 'Escape' && modalState.get().isOpen) {
                modalState.set({ isOpen: false });
                console.info('[Modal] Task creation modal closed via Escape key');
                
                const input = document.querySelector('#todo-input');
                if (input) {
                    input.value = '';
                }
            }
        });
    };

    // Subscribe to keyboard state changes
    keyboardState.subscribe(currentState => {
        const tasksModal = document.querySelector('.tasks');
        if (tasksModal) {
            tasksModal.classList.toggle('keyboard-visible', currentState.isVisible);
            console.info(`[UI] Keyboard visibility state: ${currentState.isVisible}`);
        }
    });

    taskModalState.subscribe(currentState => {
        const tasksModal = document.querySelector('.tasks');
        if (tasksModal) {
            tasksModal.classList.toggle('is-visible', currentState.isOpen);
            console.info(`[UI] Modal visibility state: ${currentState.isOpen}`);
            
            if (currentState.isOpen) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        }
    });

    const handleSwipeToDelete = (mainState) => {
        let touchStartX = 0;
        let touchCurrentX = 0;
        let swipedElement = null;
        let isSwiping = false;

        document.addEventListener('touchstart', (e) => {
            const taskElement = e.target.closest('.task');
            if (taskElement) {
                touchStartX = e.touches[0].clientX;
                swipedElement = taskElement;
                isSwiping = true;
                swipedElement.style.transition = 'transform 0s';
            }
        }, { passive: true });

        document.addEventListener('touchmove', (e) => {
            if (!isSwiping || !swipedElement) return;

            touchCurrentX = e.touches[0].clientX;
            const diffX = touchCurrentX - touchStartX;

            if (diffX > 0) {
                swipedElement.style.transform = `translateX(${diffX}px)`;
            }
        }, { passive: true });

        document.addEventListener('touchend', (e) => {
            if (!isSwiping || !swipedElement) return;

            isSwiping = false;
            const diffX = touchCurrentX - touchStartX;
            const elementWidth = swipedElement.offsetWidth;
            const swipeThreshold = elementWidth * 0.40

            swipedElement.style.transition = 'transform 0.3s ease';

            if (diffX > swipeThreshold) {
                const taskId = Number(swipedElement.dataset.taskId);
                if (!isNaN(taskId)) {
                    const currentTasks = mainState.get().tasks || [];
                    const taskToDelete = currentTasks.find(task => task.id === taskId);
                    if (taskToDelete) {
                        const newTasks = currentTasks.filter(task => task.id !== taskId);
                        mainState.set({ tasks: newTasks });
                        console.info(`[Actions] Task swiped and deleted: "${taskToDelete.taskMessage}"`);
                    }
                }
            } else {
                swipedElement.style.transform = 'translateX(0)';
            }

            touchStartX = 0;
            touchCurrentX = 0;
            swipedElement = null;
        });
    };

    EventZoomHook(zoomPreventionState);
    handleKeyboardShift(keyboardState);
    handleAllAppActions(Main, taskModalState);
    handleSwipeToDelete(Main);

    if (!document.querySelector('#shake-animation-style')) {
        const shakeStyle = document.createElement('style');
        shakeStyle.id = 'shake-animation-style';
        shakeStyle.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(1%); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(calc(1% - 5px)); }
                20%, 40%, 60%, 80% { transform: translateX(calc(1% + 5px)); }
            }
        `;
        document.head.appendChild(shakeStyle);
    }
};