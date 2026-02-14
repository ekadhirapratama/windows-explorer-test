# Testing Scenarios

## Backend (API/Infrastructure)

### Integration Tests

#### 1. Folders API (`tests/integration/api/folders-api.test.ts`)
- `GET /api/v1/folders/root` returns root folders
- `GET /api/v1/folders/:id/children` returns children
- `GET /api/v1/folders/invalid-id/children` returns 404/500

#### 2. Search API (`tests/integration/api/search-api.test.ts`)
- `GET /api/v1/search?q=test` returns results
- `GET /api/v1/search` without query returns 400
- `GET /api/v1/search?q=` returns 400

### Unit Tests

#### 3. FolderRepository (`tests/unit/repositories/folder-repository.test.ts`)
- should be defined (Dependency Injection verification)

#### 4. FolderService (`tests/unit/services/folder-service.test.ts`)
- `getRootFolders`: should return folders from repository
- `getChildren`: should return children when folder exists
- `getChildren`: should throw error when folder does not exist
- `getById`: should return folder when it exists
- `getById`: should throw error when folder does not exist

#### 5. SearchService (`tests/unit/services/search-service.test.ts`)
- `globalSearch`: should return search results
- `globalSearch`: should throw error when query is empty
- `globalSearch`: should throw error when query is only whitespace
- `globalSearch`: should trim query before searching

#### Results
```bash
$ cd apps/api
$ bun test

16 pass
 0 fail
 27 expect() calls
Ran 16 tests across 5 files. [186.00ms]
```

---

## Frontend (Web)

### Component Unit Tests

#### 1. ContentItem (`tests/unit/components/ContentItem.test.ts`)
- renders folder icon (SVG) for folder item
- renders FileIcon component for file item
- emits click event with item
- emits doubleClick event with item
- applies selected class when selected

#### 2. ContentPanel (`tests/unit/components/ContentPanel.test.ts`)
- renders empty state when no folder selected and no search
- renders loading state

#### 3. FileIcon (`tests/unit/components/FileIcon.test.ts`)
- renders correct icon (SVG text) for known extension (e.g., PDF)
- renders default icon for unknown extension
- extension check is case insensitive

#### 4. FolderTreeNode (`tests/unit/components/FolderTreeNode.test.ts`)
- renders folder name
- shows expand toggle when folder has children
- emits toggle event on toggle click
- emits select event on item click
- renders children when expanded

#### 5. GlobalSearch (`tests/unit/components/GlobalSearch.test.ts`)
- renders input field
- calls handleSearchInput on input
- shows clear button when query exists
- hides clear button when query is empty
- calls clearSearch on clear button click

### Composable Unit Tests

#### 6. useFolderTree (`tests/unit/composables/useFolderTree.test.ts`)
- loads root folders
- toggles folder expansion and loads children
- selects folder

#### 7. useSearch (`tests/unit/composables/useSearch.test.ts`)
- updates searchQuery and debounces search (500ms)
- clears search state
- updates state on successful search

### Visual Tests (Snapshots)

#### 8. ContentItem (`tests/unit/visual/ContentItem.snapshot.test.ts`)
- renders folder item correctly
- renders file item correctly

#### 9. FolderTreeNode (`tests/unit/visual/FolderTreeNode.snapshot.test.ts`)
- renders collapsed folder node
- renders selected expanded node

#### 10. ExplorerLayout (`tests/unit/visual/ExplorerLayout.snapshot.test.ts`)
- renders basic layout structure

#### Results
```bash
$ cd apps/web
$ bun run test

...

 Test Files  10 passed (10)
      Tests  31 passed (31)
   Start at  18:15:02
   Duration  1.38s (transform 463ms, setup 0ms, collect 1.47s, tests 162ms, environment 1.77s, prepare 518ms)
```
