'use client'

import { useState, useCallback, useMemo } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import type { FieldConfig, ModelConfig } from '@/lib/admin/types'

interface SafeDynamicFormProps {
  model: ModelConfig
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
}

export function SafeDynamicForm({
  model,
  initialData = {},
  onSubmit,
  onCancel
}: SafeDynamicFormProps) {
  const [loading, setLoading] = useState(false)
  
  // Generate Zod schema from model fields
  const schema = useMemo(() => {
    const schemaObject: any = {}
    
    model.fields.forEach(field => {
      let fieldSchema: any = z.any()
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'url':
        case 'slug':
          fieldSchema = z.string()
          if (field.type === 'email') {
            fieldSchema = fieldSchema.email('Email invalide')
          }
          if (field.type === 'url') {
            fieldSchema = fieldSchema.url('URL invalide').optional()
          }
          break
        case 'number':
          fieldSchema = z.coerce.number()
          break
        case 'date':
        case 'datetime':
          fieldSchema = z.any() // Dates handled separately
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'select':
          fieldSchema = z.string()
          break
        case 'textarea':
        case 'richtext':
          fieldSchema = z.string()
          break
        default:
          fieldSchema = z.any()
      }
      
      // Apply validation rules
      if (field.required && field.type !== 'checkbox') {
        // Pour les strings, utiliser min(1), pour les autres types, juste required
        if (field.type === 'text' || field.type === 'email' || field.type === 'url' || 
            field.type === 'slug' || field.type === 'textarea' || field.type === 'richtext' || 
            field.type === 'select') {
          fieldSchema = fieldSchema.min(1, 'Ce champ est requis')
        }
      } else if (!field.required) {
        fieldSchema = fieldSchema.optional().nullable()
      }
      
      schemaObject[field.name] = fieldSchema
    })
    
    return z.object(schemaObject)
  }, [model.fields])
  
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData
  })
  
  const onFormSubmit = useCallback(async (data: any) => {
    setLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }, [onSubmit])
  
  const renderField = useCallback((field: FieldConfig) => {
    const error = errors[field.name]
    
    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'number':
      case 'slug':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Input
              id={field.name}
              type={field.type === 'number' ? 'number' : 'text'}
              placeholder={field.placeholder}
              className="w-full"
              {...register(field.name)}
            />
            {field.helper && (
              <p className="text-xs text-gray-500">{field.helper}</p>
            )}
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )
        
      case 'textarea':
        return (
          <div key={field.name} className="space-y-2 col-span-2">
            <Label htmlFor={field.name} className="text-sm font-medium text-gray-700">
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder}
              rows={field.rows || 4}
              className="w-full"
              {...register(field.name)}
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )
        
      case 'richtext':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Textarea
              id={field.name}
              placeholder={field.placeholder || 'Contenu riche (HTML)'}
              rows={8}
              {...register(field.name)}
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )
        
      case 'select':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder={field.placeholder || 'Sélectionner...'} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options?.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )
        
      case 'checkbox':
        return (
          <div key={field.name} className="flex items-center space-x-2">
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Checkbox
                  id={field.name}
                  checked={value}
                  onCheckedChange={onChange}
                />
              )}
            />
            <Label htmlFor={field.name} className="cursor-pointer">
              {field.label}
            </Label>
          </div>
        )
        
      case 'date':
      case 'datetime':
        return (
          <div key={field.name} className="space-y-2">
            <Label htmlFor={field.name}>
              {field.label}
              {field.required && <span className="text-red-500 ml-1">*</span>}
            </Label>
            <Controller
              name={field.name}
              control={control}
              render={({ field: { onChange, value } }) => (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !value && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {value ? format(new Date(value), "PPP", { locale: fr }) : <span>Choisir une date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={value ? new Date(value) : undefined}
                      onSelect={(date) => onChange(date?.toISOString())}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              )}
            />
            {error && (
              <p className="text-sm text-red-500">{error.message as string}</p>
            )}
          </div>
        )
        
      default:
        return null
    }
  }, [register, control, errors])
  
  // Organiser les champs par colonnes pour une meilleure mise en page
  const leftColumnFields = model.fields.filter((_, index) => index % 2 === 0)
  const rightColumnFields = model.fields.filter((_, index) => index % 2 === 1)
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="max-h-[60vh] overflow-y-auto px-1">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
          <div className="space-y-4">
            {leftColumnFields.map(renderField)}
          </div>
          <div className="space-y-4">
            {rightColumnFields.map(renderField)}
          </div>
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t sticky bottom-0 bg-white">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={loading}
          >
            Annuler
          </Button>
        )}
        
        <Button type="submit" disabled={loading}>
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {initialData?.id ? 'Mettre à jour' : 'Créer'}
        </Button>
      </div>
    </form>
  )
}