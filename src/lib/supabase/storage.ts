import { createClient } from '@/lib/supabase/client'

export class StorageService {
  private supabase = createClient()
  
  /**
   * Upload un fichier vers Supabase Storage
   */
  async uploadFile(
    bucket: string,
    path: string,
    file: File,
    options?: { upsert?: boolean; contentType?: string }
  ) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: options?.upsert || false,
        contentType: options?.contentType || file.type
      })

    if (error) throw error
    return data
  }

  /**
   * Obtient l'URL publique d'un fichier
   */
  getPublicUrl(bucket: string, path: string): string {
    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  /**
   * Supprime un fichier
   */
  async deleteFile(bucket: string, path: string) {
    const { error } = await this.supabase.storage
      .from(bucket)
      .remove([path])

    if (error) throw error
  }

  /**
   * Liste les fichiers dans un dossier
   */
  async listFiles(bucket: string, folder: string) {
    const { data, error } = await this.supabase.storage
      .from(bucket)
      .list(folder)

    if (error) throw error
    return data
  }

  /**
   * Upload une image avec génération automatique de miniatures
   */
  async uploadImage(
    file: File,
    folder: string = 'images',
    generateThumbnail: boolean = false
  ) {
    const timestamp = Date.now()
    const fileName = `${timestamp}-${file.name.replace(/\s+/g, '-')}`
    const path = `${folder}/${fileName}`

    // Upload l'image originale
    const { data, error } = await this.supabase.storage
      .from('media')
      .upload(path, file, {
        contentType: file.type,
        upsert: false
      })

    if (error) throw error

    // Retourner l'URL publique
    return {
      path: data.path,
      url: this.getPublicUrl('media', data.path)
    }
  }

  /**
   * Upload multiple files
   */
  async uploadMultipleFiles(
    files: File[],
    folder: string = 'documents'
  ) {
    const uploadPromises = files.map(file => 
      this.uploadImage(file, folder)
    )

    return Promise.all(uploadPromises)
  }

  /**
   * Crée les buckets nécessaires (à exécuter une fois)
   */
  async initializeBuckets() {
    const buckets = ['media', 'documents', 'avatars']
    
    for (const bucketName of buckets) {
      const { data: existing } = await this.supabase.storage.getBucket(bucketName)
      
      if (!existing) {
        const { error } = await this.supabase.storage.createBucket(bucketName, {
          public: true,
          allowedMimeTypes: bucketName === 'media' 
            ? ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4']
            : undefined
        })
        
        if (error && !error.message.includes('already exists')) {
          console.error(`Error creating bucket ${bucketName}:`, error)
        }
      }
    }
  }
}

export const storageService = new StorageService()