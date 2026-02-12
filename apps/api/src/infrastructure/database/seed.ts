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

        // Create drives (root folders)
        console.log('📁 Creating root drives...')
        const [driveC] = await db.insert(folders).values({ name: 'Local Disk (C:)', parentId: null }).returning()
        const [driveD] = await db.insert(folders).values({ name: 'Local Disk (D:)', parentId: null }).returning()

        // Create C: structure
        console.log('🖥️ Creating C: structure...')
        const [windowsFolder] = await db.insert(folders).values({ name: 'Windows', parentId: driveC.id }).returning()
        const [programFiles] = await db.insert(folders).values({ name: 'Program Files', parentId: driveC.id }).returning()
        const [usersFolder] = await db.insert(folders).values({ name: 'Users', parentId: driveC.id }).returning()
        const [yourUser] = await db.insert(folders).values({ name: 'YourName', parentId: usersFolder.id }).returning()

        // Move Quick Access folders under C:\Users\YourName
        console.log('📂 Creating Quick Access folders under C:\\Users\\YourName...')
        const [desktop] = await db.insert(folders).values({ name: 'Desktop', parentId: yourUser.id }).returning()
        const [documents] = await db.insert(folders).values({ name: 'Documents', parentId: yourUser.id }).returning()
        const [downloads] = await db.insert(folders).values({ name: 'Downloads', parentId: yourUser.id }).returning()
        const [pictures] = await db.insert(folders).values({ name: 'Pictures', parentId: yourUser.id }).returning()
        const [tempFolder] = await db.insert(folders).values({ name: 'Temp', parentId: driveC.id }).returning()

        // Create some sample files/folders under Documents
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

        // Create D: structure
        console.log('📁 Creating D: structure...')
        const [projectsD] = await db.insert(folders).values({ name: 'Projects', parentId: driveD.id }).returning()
        const [mediaD] = await db.insert(folders).values({ name: 'Media', parentId: driveD.id }).returning()
        const [backupD] = await db.insert(folders).values({ name: 'Backup', parentId: driveD.id }).returning()

        // Desktop files
        console.log('🖥️  Creating Desktop files...')
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
