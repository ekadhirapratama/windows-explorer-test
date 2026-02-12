import { ref, reactive, computed } from 'vue'
import type { Folder, File, FolderTree } from '@shared/types/folder'
import { api } from '../services/api'

/**
 * Composable for managing folder tree state and operations
 * Handles lazy loading, selection, and folder expansion
 */
export function useFolderTree() {
    // State
    const rootFolders = ref<FolderTree[]>([])
    const selectedFolderId = ref<string | null>(null)
    const expandedFolderIds = reactive(new Set<string>())
    const loadingFolderIds = reactive(new Set<string>())
    const isLoadingRoots = ref(false)
    const error = ref<string | null>(null)

    // Computed
    const selectedFolder = computed(() => {
        if (!selectedFolderId.value) return null
        return findFolderById(rootFolders.value, selectedFolderId.value)
    })

    /**
     * Find folder by ID in the tree (recursive)
     */
    function findFolderById(folders: FolderTree[], id: string): FolderTree | null {
        for (const folder of folders) {
            if (folder.id === id) return folder
            if (folder.children) {
                const found = findFolderById(folder.children, id)
                if (found) return found
            }
        }
        return null
    }

    /**
     * Load root folders from API
     */
    async function loadRootFolders() {
        isLoadingRoots.value = true
        error.value = null

        try {
            const folders = await api.getRootFolders()
            rootFolders.value = folders.map(folder => ({
                ...folder,
                children: folder.hasChildren ? [] : undefined
            }))
        } catch (err: any) {
            error.value = err.message || 'Failed to load folders'
            console.error('Error loading root folders:', err)
        } finally {
            isLoadingRoots.value = false
        }
    }

    /**
     * Load children for a specific folder (lazy loading)
     */
    async function loadFolderChildren(folderId: string) {
        if (loadingFolderIds.has(folderId)) return

        loadingFolderIds.add(folderId)
        error.value = null

        try {
            const { folders } = await api.getFolderChildren(folderId)

            const parentFolder = findFolderById(rootFolders.value, folderId)
            if (parentFolder) {
                parentFolder.children = folders.map(folder => ({
                    ...folder,
                    children: folder.hasChildren ? [] : undefined
                }))

                // Update hasChildren if no children were loaded
                if (folders.length === 0) {
                    parentFolder.hasChildren = false
                }
            }
        } catch (err: any) {
            error.value = err.message || 'Failed to load folder children'
            console.error('Error loading folder children:', err)
        } finally {
            loadingFolderIds.delete(folderId)
        }
    }

    /**
     * Toggle folder expansion
     * @param folderId - ID of folder to toggle
     * @param forceExpand - If true, force expand even if already expanded
     */
    async function toggleFolder(folderId: string, forceExpand = false) {
        const isExpanded = expandedFolderIds.has(folderId)

        if (isExpanded && !forceExpand) {
            // Collapse folder
            expandedFolderIds.delete(folderId)
        } else if (!isExpanded || forceExpand) {
            // Expand folder
            expandedFolderIds.add(folderId)

            // Load children if not already loaded
            const folder = findFolderById(rootFolders.value, folderId)
            if (folder && (!folder.children || folder.children.length === 0)) {
                await loadFolderChildren(folderId)
            }
        }
    }

    /**
     * Select a folder
     */
    function selectFolder(folderId: string) {
        selectedFolderId.value = folderId
    }

    /**
     * Check if folder is expanded
     */
    function isFolderExpanded(folderId: string): boolean {
        return expandedFolderIds.has(folderId)
    }

    /**
     * Check if folder is loading
     */
    function isFolderLoading(folderId: string): boolean {
        return loadingFolderIds.has(folderId)
    }

    /**
     * Check if folder is selected
     */
    function isFolderSelected(folderId: string): boolean {
        return selectedFolderId.value === folderId
    }

    /**
     * Find folder by ID in the tree (wrapper for public use)
     */
    function findFolder(folderId: string) {
        return findFolderById(rootFolders.value, folderId)
    }

    return {
        // State
        rootFolders,
        selectedFolderId,
        selectedFolder,
        isLoadingRoots,
        error,

        // Methods
        loadRootFolders,
        loadFolderChildren,
        toggleFolder,
        selectFolder,
        isFolderExpanded,
        isFolderLoading,
        isFolderSelected,
        findFolderById: findFolder
    }
}
