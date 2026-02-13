import { db, client } from './connection'
import { folders, files } from './schema'

/**
 * Seed script - creates the complete folder/file structure
 * Structure from refactoring_execution_plan.md - Task B.2.1
 * Creates Quick Access categories and Drive categories per stakeholder requirements
 */
async function seed() {
    console.log('🌱 Seeding database...')

    try {
        // Clear existing data
        console.log('🧹 Clearing existing data...')
        await db.delete(files)
        await db.delete(folders)

        // ============================================
        // QUICK ACCESS FOLDERS (Root level, category: 'quick-access')
        // ============================================
        console.log('📂 Creating Quick Access folders...')
        
        // Desktop - Quick Access folder
        const [desktop] = await db.insert(folders).values({ 
            name: 'Desktop', 
            parentId: null, 
            category: 'quick-access', 
            icon: 'desktop_windows' 
        }).returning()
        
        // Desktop file
        await db.insert(files).values({
            name: 'screenshot',
            extension: 'png',
            mimeType: 'image/png',
            folderId: desktop.id
        })
        
        // Downloads - Quick Access folder
        const [downloads] = await db.insert(folders).values({ 
            name: 'Downloads', 
            parentId: null, 
            category: 'quick-access', 
            icon: 'download' 
        }).returning()
        
        // Downloads files
        await db.insert(files).values([
            {
                name: 'tutorials',
                extension: 'pdf',
                mimeType: 'application/pdf',
                folderId: downloads.id
            },
            {
                name: 'readme',
                extension: 'txt',
                mimeType: 'text/plain',
                folderId: downloads.id
            }
        ])
        
        // Documents - Quick Access folder
        const [documents] = await db.insert(folders).values({ 
            name: 'Documents', 
            parentId: null, 
            category: 'quick-access', 
            icon: 'description' 
        }).returning()
        
        // Documents subfolders (no category - user folders)
        await db.insert(folders).values([
            { name: 'Pictures', parentId: documents.id },
            { name: 'Music', parentId: documents.id },
            { name: 'Videos', parentId: documents.id }
        ])

        // ============================================
        // DRIVE FOLDERS (Root level, category: 'drive')
        // ============================================
        console.log('💾 Creating Drive folders...')
        
        // Local Disk (C:) - Drive
        const [driveC] = await db.insert(folders).values({ 
            name: 'Local Disk (C:)', 
            parentId: null, 
            category: 'drive', 
            icon: 'storage' 
        }).returning()
        
        // C: subfolders (no category - system folders)
        await db.insert(folders).values([
            { name: 'Windows', parentId: driveC.id },
            { name: 'Program Files', parentId: driveC.id }
        ])
        
        // Data (D:) - Drive
        const [driveD] = await db.insert(folders).values({ 
            name: 'Data (D:)', 
            parentId: null, 
            category: 'drive', 
            icon: 'storage' 
        }).returning()
        
        // D: subfolders (no category - user folders)
        await db.insert(folders).values([
            { name: 'Work', parentId: driveD.id },
            { name: 'Personal', parentId: driveD.id }
        ])

        console.log('✅ Database seeded successfully!')
        console.log('📊 Summary:')
        console.log('   - Quick Access: 3 folders (Desktop, Downloads, Documents)')
        console.log('   - Drives: 2 folders (Local Disk C:, Data D:)')
        console.log('   - Total root folders: 5')
        console.log('   - Total subfolders: 7')
        console.log('   - Total files: 3')
        console.log('')
        console.log('🎯 Note: User-created folders will have category=null and icon=null')

    } catch (error) {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    } finally {
        await client.end()
    }
}

seed()
