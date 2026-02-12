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
        // Create drives as root folders
        console.log('📁 Creating drives (root folders)...')
        const [driveC] = await db.insert(folders).values({ name: 'Local Disk (C:)', parentId: null }).returning()
        const [driveD] = await db.insert(folders).values({ name: 'Local Disk (D:)', parentId: null }).returning()

        // C: structure
        console.log('🖥️  Creating C: structure...')
        const [windows] = await db.insert(folders).values({ name: 'Windows', parentId: driveC.id }).returning()
        const [programFiles] = await db.insert(folders).values({ name: 'Program Files', parentId: driveC.id }).returning()
        const [users] = await db.insert(folders).values({ name: 'Users', parentId: driveC.id }).returning()

        // Create a default user folder under Users
        const [yourUser] = await db.insert(folders).values({ name: 'YourName', parentId: users.id }).returning()

        // Quick Access folders under the user
        const [desktop] = await db.insert(folders).values({ name: 'Desktop', parentId: yourUser.id }).returning()
        const [documents] = await db.insert(folders).values({ name: 'Documents', parentId: yourUser.id }).returning()
        const [downloads] = await db.insert(folders).values({ name: 'Downloads', parentId: yourUser.id }).returning()
        const [pictures] = await db.insert(folders).values({ name: 'Pictures', parentId: yourUser.id }).returning()
        const [music] = await db.insert(folders).values({ name: 'Music', parentId: yourUser.id }).returning()
        const [videos] = await db.insert(folders).values({ name: 'Videos', parentId: yourUser.id }).returning()

        // Sample subfolders and files (mirror previous content under new parents)
        console.log('📄 Creating Documents structure under user...')
        const [workFolder] = await db.insert(folders).values({ name: 'Work', parentId: documents.id }).returning()
        const [personalFolder] = await db.insert(folders).values({ name: 'Personal', parentId: documents.id }).returning()

        const [projectsFolder] = await db.insert(folders).values({ name: 'Projects', parentId: workFolder.id }).returning()
        await db.insert(files).values([
            { name: 'project-a', extension: 'pdf', mimeType: 'application/pdf', folderId: projectsFolder.id },
            { name: 'presentation', extension: 'pptx', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', folderId: workFolder.id }
        ])

        const [resumesFolder] = await db.insert(folders).values({ name: 'Resumes', parentId: personalFolder.id }).returning()
        await db.insert(files).values([
            { name: 'my-resume', extension: 'pdf', mimeType: 'application/pdf', folderId: resumesFolder.id },
            { name: 'tax-return-2025', extension: 'pdf', mimeType: 'application/pdf', folderId: personalFolder.id },
            { name: 'readme', extension: 'txt', mimeType: 'text/plain', folderId: documents.id }
        ])

        console.log('⬇️  Creating Downloads structure under user...')
        const [softwareFolder] = await db.insert(folders).values({ name: 'Software', parentId: downloads.id }).returning()
        await db.insert(files).values([
            { name: 'installer-v2', extension: 'exe', mimeType: 'application/x-msdownload', folderId: softwareFolder.id },
            { name: 'vscode-setup', extension: 'dmg', mimeType: 'application/x-apple-diskimage', folderId: softwareFolder.id },
            { name: 'archive', extension: 'zip', mimeType: 'application/zip', folderId: downloads.id },
            { name: 'setup-guide', extension: 'pdf', mimeType: 'application/pdf', folderId: downloads.id }
        ])

        console.log('🖼️  Creating Pictures structure under user...')
        const [vacationsFolder] = await db.insert(folders).values({ name: 'Vacations', parentId: pictures.id }).returning()
        const [screenshotsFolder] = await db.insert(folders).values({ name: 'Screenshots', parentId: pictures.id }).returning()
        await db.insert(files).values([
            { name: 'beach-sunset', extension: 'jpg', mimeType: 'image/jpeg', folderId: vacationsFolder.id },
            { name: 'mountain-view', extension: 'png', mimeType: 'image/png', folderId: vacationsFolder.id },
            { name: 'screenshot-01', extension: 'png', mimeType: 'image/png', folderId: screenshotsFolder.id },
            { name: 'profile-photo', extension: 'jpg', mimeType: 'image/jpeg', folderId: pictures.id }
        ])

        console.log('🎵 Creating Music structure under user...')
        const [playlistsFolder] = await db.insert(folders).values({ name: 'Playlists', parentId: music.id }).returning()
        await db.insert(files).values([
            { name: 'favorites', extension: 'm3u', mimeType: 'audio/x-mpegurl', folderId: playlistsFolder.id },
            { name: 'song-1', extension: 'mp3', mimeType: 'audio/mpeg', folderId: music.id },
            { name: 'song-2', extension: 'mp3', mimeType: 'audio/mpeg', folderId: music.id }
        ])

        console.log('🎬 Creating Videos structure under user...')
        const [tutorialsFolder] = await db.insert(folders).values({ name: 'Tutorials', parentId: videos.id }).returning()
        await db.insert(files).values([
            { name: 'vue-3-intro', extension: 'mp4', mimeType: 'video/mp4', folderId: tutorialsFolder.id },
            { name: 'birthday-party', extension: 'mov', mimeType: 'video/quicktime', folderId: videos.id }
        ])

        console.log('🖥️  Creating Desktop files under user...')
        await db.insert(files).values([
            { name: 'project-notes', extension: 'txt', mimeType: 'text/plain', folderId: desktop.id },
            { name: 'todo-list', extension: 'md', mimeType: 'text/markdown', folderId: desktop.id }
        ])

        // D: sample content
        console.log('📁 Creating D: sample folders...')
        const [projects] = await db.insert(folders).values({ name: 'Projects', parentId: driveD.id }).returning()
        const [media] = await db.insert(folders).values({ name: 'Media', parentId: driveD.id }).returning()
        await db.insert(files).values([
            { name: 'project-alpha', extension: 'pdf', mimeType: 'application/pdf', folderId: projects.id },
            { name: 'sample-photo', extension: 'jpg', mimeType: 'image/jpeg', folderId: media.id }
        ])

        console.log('✅ Database seeded successfully!')
        console.log('📊 Summary:')
        console.log('   - Drives: Local Disk (C:), Local Disk (D:)')
        console.log('   - Quick Access folders created under C:/Users/YourName')
        console.log('   - Sample folders and files inserted')

    } catch (error) {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    } finally {
        await client.end()
    }
}

seed()
