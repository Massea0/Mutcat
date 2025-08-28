'use client'

import React, { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Upload,
  Image,
  FileText,
  Film,
  Music,
  FolderOpen,
  Search,
  Filter,
  Grid,
  List,
  Download,
  Trash2,
  Edit,
  Copy,
  MoreVertical,
  X,
  Check,
  Eye,
  FolderPlus,
  RefreshCw
} from 'lucide-react'
import { toast } from 'sonner'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'

interface MediaFile {
  id: string
  name: string
  type: string
  size: number
  url: string
  thumbnail?: string
  folder?: string
  tags?: string[]
  uploadedAt: Date
  uploadedBy: string
}

export default function MediaAdminPage() {
  const [selectedFiles, setSelectedFiles] = useState<string[]>([])
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedFile, setSelectedFile] = useState<MediaFile | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const supabase = createClient()

  // Mock data - replace with real Supabase queries
  const mediaFiles: MediaFile[] = [
    {
      id: '1',
      name: 'pont-emergence.jpg',
      type: 'image/jpeg',
      size: 2457600,
      url: '/images/placeholder.svg',
      thumbnail: '/images/placeholder.svg',
      folder: 'Projets',
      tags: ['infrastructure', 'pont'],
      uploadedAt: new Date(),
      uploadedBy: 'Admin'
    },
    {
      id: '2',
      name: 'rapport-annuel-2024.pdf',
      type: 'application/pdf',
      size: 5242880,
      url: '/documents/rapport.pdf',
      folder: 'Documents',
      tags: ['rapport', '2024'],
      uploadedAt: new Date(Date.now() - 86400000),
      uploadedBy: 'Editeur'
    },
    {
      id: '3',
      name: 'conference-urbanisme.mp4',
      type: 'video/mp4',
      size: 52428800,
      url: '/videos/conference.mp4',
      thumbnail: '/images/placeholder.svg',
      folder: 'Vidéos',
      tags: ['conférence', 'urbanisme'],
      uploadedAt: new Date(Date.now() - 172800000),
      uploadedBy: 'Admin'
    }
  ]

  const folders = [
    { name: 'Projets', count: 45, color: 'bg-blue-100 text-blue-700' },
    { name: 'Documents', count: 123, color: 'bg-green-100 text-green-700' },
    { name: 'Images', count: 256, color: 'bg-purple-100 text-purple-700' },
    { name: 'Vidéos', count: 18, color: 'bg-yellow-100 text-yellow-700' },
    { name: 'Audio', count: 7, color: 'bg-pink-100 text-pink-700' }
  ]

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files)
      await handleUpload(files)
    }
  }, [])

  const handleFileInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files)
      await handleUpload(files)
    }
  }

  const handleUpload = async (files: File[]) => {
    setIsUploading(true)
    
    try {
      for (const file of files) {
        // Upload to Supabase Storage
        const fileName = `${Date.now()}-${file.name}`
        const { data, error } = await supabase.storage
          .from('media')
          .upload(fileName, file)

        if (error) throw error

        // Save metadata to database
        const { error: dbError } = await supabase
          .from('media')
          .insert({
            filename: file.name,
            original_name: file.name,
            mime_type: file.type,
            size: file.size,
            url: data.path,
            folder_id: selectedFolder,
            created_by: 'current-user-id' // Replace with actual user ID
          } as any)

        if (dbError) throw dbError
      }

      toast.success(`${files.length} fichier(s) téléchargé(s) avec succès`)
    } catch (error) {
      console.error('Upload error:', error)
      toast.error('Erreur lors du téléchargement')
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (fileId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce fichier ?')) {
      try {
        // Delete from Supabase Storage and database
        const { error } = await supabase
          .from('media')
          .delete()
          .eq('id', fileId)

        if (error) throw error

        toast.success('Fichier supprimé avec succès')
      } catch (error) {
        toast.error('Erreur lors de la suppression')
      }
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.startsWith('video/')) return Film
    if (type.startsWith('audio/')) return Music
    return FileText
  }

  const filteredFiles = mediaFiles.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFolder = !selectedFolder || file.folder === selectedFolder
    return matchesSearch && matchesFolder
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Médiathèque</h1>
          <p className="mt-2 text-sm text-gray-600">
            Gérez vos images, documents et fichiers multimédias
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm">
            <FolderPlus className="h-4 w-4 mr-2" />
            Nouveau dossier
          </Button>
          
          <label htmlFor="file-upload">
            <Button asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                Télécharger
              </span>
            </Button>
            <input
              id="file-upload"
              type="file"
              multiple
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total fichiers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">449</div>
            <p className="text-xs text-muted-foreground">+12% ce mois</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Stockage utilisé</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">45.2 GB</div>
            <p className="text-xs text-muted-foreground">Sur 100 GB</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">256</div>
            <p className="text-xs text-muted-foreground">57% du total</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">123</div>
            <p className="text-xs text-muted-foreground">27% du total</p>
          </CardContent>
        </Card>
      </div>

      {/* Folders */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2">
        <Button
          variant={!selectedFolder ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedFolder(null)}
        >
          <FolderOpen className="h-4 w-4 mr-2" />
          Tous
        </Button>
        {folders.map((folder) => (
          <Button
            key={folder.name}
            variant={selectedFolder === folder.name ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedFolder(folder.name)}
            className="whitespace-nowrap"
          >
            <FolderOpen className="h-4 w-4 mr-2" />
            {folder.name}
            <Badge variant="secondary" className="ml-2">
              {folder.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher des fichiers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-64"
            />
          </div>
          
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filtrer
          </Button>
        </div>
        
        <div className="flex items-center space-x-2">
          {selectedFiles.length > 0 && (
            <div className="flex items-center space-x-2 mr-4">
              <span className="text-sm text-gray-600">
                {selectedFiles.length} sélectionné(s)
              </span>
              <Button variant="outline" size="sm" onClick={() => setSelectedFiles([])}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('grid')}
          >
            <Grid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setViewMode('list')}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Upload Zone */}
      <div
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-gray-300",
          isUploading && "opacity-50 pointer-events-none"
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-lg font-medium text-gray-700">
          Glissez-déposez vos fichiers ici
        </p>
        <p className="text-sm text-gray-500 mt-2">
          ou{' '}
          <label htmlFor="file-upload-zone" className="text-primary cursor-pointer hover:underline">
            parcourez vos fichiers
          </label>
          <input
            id="file-upload-zone"
            type="file"
            multiple
            className="hidden"
            onChange={handleFileInput}
          />
        </p>
        {isUploading && (
          <div className="mt-4">
            <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
            <p className="text-sm text-gray-600 mt-2">Téléchargement en cours...</p>
          </div>
        )}
      </div>

      {/* Files Grid/List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isSelected = selectedFiles.includes(file.id)
            
            return (
              <div
                key={file.id}
                className={cn(
                  "relative group cursor-pointer rounded-lg border p-2 transition-all hover:shadow-md",
                  isSelected && "ring-2 ring-primary"
                )}
                onClick={() => {
                  if (selectedFiles.includes(file.id)) {
                    setSelectedFiles(selectedFiles.filter(id => id !== file.id))
                  } else {
                    setSelectedFiles([...selectedFiles, file.id])
                  }
                }}
              >
                {/* Selection checkbox */}
                <div className={cn(
                  "absolute top-2 left-2 z-10",
                  !isSelected && "opacity-0 group-hover:opacity-100"
                )}>
                  <div className={cn(
                    "w-5 h-5 rounded border-2 flex items-center justify-center",
                    isSelected ? "bg-primary border-primary" : "bg-white border-gray-300"
                  )}>
                    {isSelected && <Check className="h-3 w-3 text-white" />}
                  </div>
                </div>
                
                {/* File preview */}
                <div className="aspect-square rounded overflow-hidden bg-gray-100 mb-2">
                  {file.type.startsWith('image/') && file.thumbnail ? (
                    <img
                      src={file.thumbnail}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon className="h-12 w-12 text-gray-400" />
                    </div>
                  )}
                </div>
                
                {/* File info */}
                <p className="text-xs font-medium truncate">{file.name}</p>
                <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                
                {/* Actions */}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={(e) => {
                        e.stopPropagation()
                        setSelectedFile(file)
                        setIsDetailsOpen(true)
                      }}>
                        <Eye className="h-4 w-4 mr-2" />
                        Détails
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Download className="h-4 w-4 mr-2" />
                        Télécharger
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="h-4 w-4 mr-2" />
                        Copier le lien
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Renommer
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        className="text-red-600"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(file.id)
                        }}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Supprimer
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => {
            const FileIcon = getFileIcon(file.type)
            const isSelected = selectedFiles.includes(file.id)
            
            return (
              <div
                key={file.id}
                className={cn(
                  "flex items-center space-x-4 p-4 rounded-lg border hover:bg-gray-50 transition-colors",
                  isSelected && "bg-primary/5 border-primary"
                )}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setSelectedFiles([...selectedFiles, file.id])
                    } else {
                      setSelectedFiles(selectedFiles.filter(id => id !== file.id))
                    }
                  }}
                  className="rounded"
                />
                
                <FileIcon className="h-8 w-8 text-gray-400" />
                
                <div className="flex-1">
                  <p className="font-medium">{file.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.folder}</span>
                    <span>{format(file.uploadedAt, 'dd MMM yyyy', { locale: fr })}</span>
                    <span>{file.uploadedBy}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(file.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* File Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Détails du fichier</DialogTitle>
          </DialogHeader>
          
          {selectedFile && (
            <div className="space-y-4">
              <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                {selectedFile.type.startsWith('image/') && selectedFile.thumbnail ? (
                  <img
                    src={selectedFile.thumbnail}
                    alt={selectedFile.name}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    {React.createElement(getFileIcon(selectedFile.type), {
                      className: "h-24 w-24 text-gray-400"
                    })}
                  </div>
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Nom du fichier</p>
                  <p className="mt-1">{selectedFile.name}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Type</p>
                  <p className="mt-1">{selectedFile.type}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Taille</p>
                  <p className="mt-1">{formatFileSize(selectedFile.size)}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Dossier</p>
                  <p className="mt-1">{selectedFile.folder || 'Racine'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléchargé le</p>
                  <p className="mt-1">
                    {format(selectedFile.uploadedAt, 'dd MMMM yyyy à HH:mm', { locale: fr })}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Téléchargé par</p>
                  <p className="mt-1">{selectedFile.uploadedBy}</p>
                </div>
              </div>
              
              {selectedFile.tags && selectedFile.tags.length > 0 && (
                <div>
                  <p className="text-sm font-medium text-gray-500 mb-2">Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedFile.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="flex items-center justify-end space-x-2 pt-4">
                <Button variant="outline">
                  <Copy className="h-4 w-4 mr-2" />
                  Copier le lien
                </Button>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

function cn(...classes: (string | boolean | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}