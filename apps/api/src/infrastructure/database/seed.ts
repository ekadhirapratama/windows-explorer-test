import { db, client } from './connection'
import { folders, files } from './schema'

/**
 * Seed script - creates the complete folder/file structure
 * Structure from .spec/plan.md Section 3
 */
async function seed() {
    console.log('🌱 Seeding database...')

    try {
        // Clear existing data
        console.log('🧹 Clearing existing data...')
        await db.delete(files)
        await db.delete(folders)

        // Root folders
        console.log('📁 Creating root folders...')
        const [home] = await db.insert(folders).values({ name: 'Home', parentId: null }).returning()
        const [documents] = await db.insert(folders).values({ name: 'Documents', parentId: null }).returning()
        const [downloads] = await db.insert(folders).values({ name: 'Downloads', parentId: null }).returning()
        const [pictures] = await db.insert(folders).values({ name: 'Pictures', parentId: null }).returning()
        const [music] = await db.insert(folders).values({ name: 'Music', parentId: null }).returning()
        const [videos] = await db.insert(folders).values({ name: 'Videos', parentId: null }).returning()
        const [desktop] = await db.insert(folders).values({ name: 'Desktop', parentId: null }).returning()

        // Documents structure
        console.log('📄 Creating Documents structure...')
        const [workFolder] = await db.insert(folders).values({ name: 'Work', parentId: documents.id }).returning()
        const [personalFolder] = await db.insert(folders).values({ name: 'Personal', parentId: documents.id }).returning()

        // Work subfolders and files
        const [projectsFolder] = await db.insert(folders).values({ name: 'Projects', parentId: workFolder.id }).returning()
        await db.insert(files).values([
            { name: 'project-a', extension: 'pdf', mimeType: 'application/pdf', folderId: projectsFolder.id },
            { name: 'presentation', extension: 'pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', folderId: workFolder.id }
        ])

        // Personal subfolders and files
        const [resumesFolder] = await db.insert(folders).values({ name: 'Resumes', parentId: personalFolder.id }).returning()
        await db.insert(files).values([
            { name: 'my-resume', extension: 'pdf', mimeType: 'application/pdf', folderId: resumesFolder.id },
            { name: 'tax-return-2025', extension: 'pdf', mimeType: 'application/pdf', folderId: personalFolder.id },
            { name: 'readme', extension: 'txt', mimeType: 'text/plain', folderId: documents.id }
        ])

        // Downloads structure
        console.log('⬇️  Creating Downloads structure...')
        const [softwareFolder] = await db.insert(folders).values({ name: 'Software', parentId: downloads.id }).returning()
        await db.insert(files).values([
            { name: 'installer-v2', extension: 'exe', mimeType: 'application/x-msdownload', folderId: softwareFolder.id },
            { name: 'vscode-setup', extension: 'dmg', mimeType: 'application/x-apple-diskimage', folderId: softwareFolder.id },
            { name: 'archive', extension: 'zip', mimeType: 'application/zip', folderId: downloads.id },
            { name: 'setup-guide', extension: 'pdf', mimeType: 'application/pdf', folderId: downloads.id }
        ])

        // Pictures structure
        console.log('🖼️  Creating Pictures structure...')
        const [vacationsFolder] = await db.insert(folders).values({ name: 'Vacations', parentId: pictures.id }).returning()
        const [screenshotsFolder] = await db.insert(folders).values({ name: 'Screenshots', parentId: pictures.id }).returning()
        await db.insert(files).values([
            { name: 'beach-sunset', extension: 'jpg', mimeType: 'image/jpeg', folderId: vacationsFolder.id },
            { name: 'mountain-view', extension: 'png', mimeType: 'image/png', folderId: vacationsFolder.id },
            { name: 'screenshot-01', extension: 'png', mimeType: 'image/png', folderId: screenshotsFolder.id },
            { name: 'profile-photo', extension: 'jpg', mimeType: 'image/jpeg', folderId: pictures.id }
        ])

        // Music structure
        console.log('🎵 Creating Music structure...')
        const [playlistsFolder] = await db.insert(folders).values({ name: 'Playlists', parentId: music.id }).returning()
        await db.insert(files).values([
            { name: 'favorites', extension: 'm3u', mimeType: 'audio/x-mpegurl', folderId: playlistsFolder.id },
            { name: 'song-1', extension: 'mp3', mimeType: 'audio/mpeg', folderId: music.id },
            { name: 'song-2', extension: 'mp3', mimeType: 'audio/mpeg', folderId: music.id }
        ])

        // Videos structure
        console.log('🎬 Creating Videos structure...')
        const [tutorialsFolder] = await db.insert(folders).values({ name: 'Tutorials', parentId: videos.id }).returning()
        await db.insert(files).values([
            { name: 'vue-3-intro', extension: 'mp4', mimeType: 'video/mp4', folderId: tutorialsFolder.id },
            { name: 'birthday-party', extension: 'mov', mimeType: 'video/quicktime', folderId: videos.id }
        ])

        // Desktop structure
        console.log('🖥️  Creating Desktop structure...')
        await db.insert(files).values([
            { name: 'project-notes', extension: 'txt', mimeType: 'text/plain', folderId: desktop.id },
            { name: 'todo-list', extension: 'md', mimeType: 'text/markdown', folderId: desktop.id }
        ])

        console.log('✅ Database seeded successfully!')
        console.log('📊 Summary:')
        console.log('   - 7 root folders (Home, Documents, Downloads, Pictures, Music, Videos, Desktop)')
        console.log('   - 15 folders total')
        console.log('   - 20 files total')
        console.log('   - 4 levels of depth')

    } catch (error) {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    } finally {
        await client.end()
    }
}

seed()
