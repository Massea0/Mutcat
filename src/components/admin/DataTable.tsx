'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Badge } from '@/components/ui/badge'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Search,
  Filter,
  Download,
  Upload,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Copy,
  Archive,
  RefreshCw,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { ModelConfig, ListOptions, ListResponse } from '@/lib/admin/types'
import { CrudService } from '@/lib/admin/crud-service'

interface DataTableProps {
  model: ModelConfig
  onEdit?: (item: any) => void
  onDelete?: (item: any) => void
  onView?: (item: any) => void
  onBulkAction?: (action: string, items: any[]) => void
}

export function DataTable({
  model,
  onEdit,
  onDelete,
  onView,
  onBulkAction
}: DataTableProps) {
  const [data, setData] = useState<ListResponse<any>>({
    data: [],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [loading, setLoading] = useState(true)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState(model.defaultSort?.field || 'created_at')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>(model.defaultSort?.order || 'desc')
  const [filters, setFilters] = useState<Record<string, any>>({})
  const [showFilters, setShowFilters] = useState(false)

  const service = new CrudService(model)

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const options: ListOptions = {
        page: data.page,
        limit: data.limit,
        sortBy,
        sortOrder,
        search: searchQuery,
        filters
      }
      const result = await service.list(options)
      setData(result)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }, [data.page, data.limit, sortBy, sortOrder, searchQuery, filters])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleSort = (field: string) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(data.data.map(item => item.id))
    } else {
      setSelectedItems([])
    }
  }

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id])
    } else {
      setSelectedItems(selectedItems.filter(item => item !== id))
    }
  }

  const handleExport = async () => {
    try {
      const csv = await service.export({ ...filters, search: searchQuery })
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${model.name}-export-${Date.now()}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error exporting data:', error)
    }
  }

  const formatCellValue = (value: any, field: string) => {
    if (value === null || value === undefined) return '-'
    
    const fieldConfig = model.fields.find(f => f.name === field)
    
    if (fieldConfig?.type === 'select') {
      const option = fieldConfig.options?.find(o => o.value === value)
      return (
        <Badge variant={value === 'active' || value === 'published' ? 'default' : 'secondary'}>
          {option?.label || value}
        </Badge>
      )
    }
    
    if (fieldConfig?.type === 'checkbox') {
      return value ? (
        <Badge variant="default">Oui</Badge>
      ) : (
        <Badge variant="secondary">Non</Badge>
      )
    }
    
    if (fieldConfig?.type === 'date' || fieldConfig?.type === 'datetime') {
      return new Date(value).toLocaleDateString('fr-FR')
    }
    
    if (fieldConfig?.type === 'number' && field.includes('budget')) {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: 'XOF'
      }).format(value)
    }
    
    if (Array.isArray(value)) {
      return value.length > 0 ? `${value.length} éléments` : '-'
    }
    
    if (typeof value === 'object') {
      return JSON.stringify(value)
    }
    
    return String(value)
  }

  const displayFields = model.listFields || model.fields.slice(0, 5).map(f => f.name)

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          {model.features?.search && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          )}
          
          {model.features?.filters && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filtres
            </Button>
          )}
          
          {selectedItems.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                {selectedItems.length} sélectionné(s)
              </span>
              {model.actions?.filter(a => a.type === 'bulk').map(action => (
                <Button
                  key={action.name}
                  variant={action.variant as any}
                  size="sm"
                  onClick={() => onBulkAction?.(action.name, selectedItems)}
                >
                  {action.label}
                </Button>
              ))}
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchData()}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
          
          {model.features?.export && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
            >
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          )}
          
          {model.features?.import && (
            <Button
              variant="outline"
              size="sm"
            >
              <Upload className="h-4 w-4 mr-2" />
              Importer
            </Button>
          )}
          
          <Button
            variant="default"
            size="sm"
            onClick={() => onEdit?.({})}
          >
            <Plus className="h-4 w-4 mr-2" />
            Nouveau {model.label}
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              {model.features?.bulkActions && (
                <TableHead className="w-12">
                  <Checkbox
                    checked={selectedItems.length === data.data.length && data.data.length > 0}
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
              )}
              
              {displayFields.map(field => {
                const fieldConfig = model.fields.find(f => f.name === field)
                const isSortable = model.sortFields?.includes(field)
                
                return (
                  <TableHead
                    key={field}
                    className={cn(isSortable && 'cursor-pointer select-none')}
                    onClick={() => isSortable && handleSort(field)}
                  >
                    <div className="flex items-center space-x-1">
                      <span>{fieldConfig?.label || field}</span>
                      {isSortable && (
                        <div className="flex flex-col">
                          {sortBy === field ? (
                            sortOrder === 'asc' ? (
                              <ArrowUp className="h-3 w-3" />
                            ) : (
                              <ArrowDown className="h-3 w-3" />
                            )
                          ) : (
                            <ArrowUpDown className="h-3 w-3 text-gray-400" />
                          )}
                        </div>
                      )}
                    </div>
                  </TableHead>
                )
              })}
              
              <TableHead className="w-12">Actions</TableHead>
            </TableRow>
          </TableHeader>
          
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={displayFields.length + 2} className="text-center py-8">
                  <div className="flex items-center justify-center space-x-2">
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Chargement...</span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.data.length === 0 ? (
              <TableRow>
                <TableCell colSpan={displayFields.length + 2} className="text-center py-8 text-gray-500">
                  Aucune donnée trouvée
                </TableCell>
              </TableRow>
            ) : (
              data.data.map(item => (
                <TableRow key={item.id}>
                  {model.features?.bulkActions && (
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={(checked) => handleSelectItem(item.id, checked as boolean)}
                      />
                    </TableCell>
                  )}
                  
                  {displayFields.map(field => (
                    <TableCell key={field}>
                      {formatCellValue(item[field], field)}
                    </TableCell>
                  ))}
                  
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        
                        {model.features?.preview && (
                          <DropdownMenuItem onClick={() => onView?.(item)}>
                            <Eye className="h-4 w-4 mr-2" />
                            Voir
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuItem onClick={() => onEdit?.(item)}>
                          <Edit className="h-4 w-4 mr-2" />
                          Modifier
                        </DropdownMenuItem>
                        
                        {model.features?.duplicate && (
                          <DropdownMenuItem>
                            <Copy className="h-4 w-4 mr-2" />
                            Dupliquer
                          </DropdownMenuItem>
                        )}
                        
                        <DropdownMenuSeparator />
                        
                        <DropdownMenuItem
                          className="text-red-600"
                          onClick={() => onDelete?.(item)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {model.features?.pagination && data.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Affichage de {(data.page - 1) * data.limit + 1} à{' '}
            {Math.min(data.page * data.limit, data.total)} sur {data.total} résultats
          </div>
          
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData({ ...data, page: 1 })}
              disabled={!data.hasPrev}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData({ ...data, page: data.page - 1 })}
              disabled={!data.hasPrev}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div className="flex items-center space-x-1">
              <span className="text-sm">Page</span>
              <Input
                type="number"
                min={1}
                max={data.totalPages}
                value={data.page}
                onChange={(e) => setData({ ...data, page: parseInt(e.target.value) || 1 })}
                className="w-16 h-8"
              />
              <span className="text-sm">sur {data.totalPages}</span>
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData({ ...data, page: data.page + 1 })}
              disabled={!data.hasNext}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setData({ ...data, page: data.totalPages })}
              disabled={!data.hasNext}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}