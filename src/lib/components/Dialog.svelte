<script lang="ts">
    export let isOpen: boolean = false;
    export let title = "Dialog";
    export let contentCenter = false;
    export let hideCancelButton = false;
    export let hideCancelTimes = false;
    export let overlayClick = true;
    export let actions: { label: string; callback: () => void }[] = [];

    const closeDialog = () => {
        isOpen = false;
    };

    const handleOverlayClick = (event: MouseEvent) => {
        if (overlayClick === false) return;
        if (event.target === event.currentTarget) {
            closeDialog();
        }
    };
</script>

{#if isOpen}
    <div
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]"
        on:click={handleOverlayClick}
        role="presentation"
        aria-hidden={!isOpen}
    >
        <div
            class="bg-white dark:bg-gray-900 rounded-lg shadow-lg max-w-md w-full p-6 {contentCenter ? 'flex flex-col justify-center items-center' : ''}"
            role="dialog"
            aria-labelledby="dialog-title"
            aria-describedby="dialog-content"
        >
            <div class="flex justify-between items-center mb-4">
                <h3 id="dialog-title" class="text-xl font-semibold">{title}</h3>
                {#if !hideCancelTimes}
                    <button
                        class="text-gray-500 hover:text-gray-700 text-2xl"
                        on:click={closeDialog}
                        type="button"
                        aria-label="Close dialog"
                    >
                        &times;
                    </button>
                {/if}
            </div>

            <div id="dialog-content" class="prose">
                <slot></slot>
            </div>

            <div class="mt-10 flex justify-end space-x-2">
                {#if !hideCancelButton}
                    <button class="px-4 py-2 button" on:click={closeDialog}>
                        Cancel
                    </button>
                {/if}

                {#each actions as action}
                    <button
                        class="px-4 py-2 button action"
                        on:click={action.callback}
                    >
                        {action.label}
                    </button>
                {/each}
            </div>
        </div>
    </div>
{/if}
