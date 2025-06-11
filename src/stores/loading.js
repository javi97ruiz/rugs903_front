// src/stores/loading.js
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useLoadingStore = defineStore('loading', () => {
    const isLoading = ref(false);

    function setLoading(value) {
        isLoading.value = value;
    }

    return { isLoading, setLoading };
});
