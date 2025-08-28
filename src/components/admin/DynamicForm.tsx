'use client'

import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, Upload, X, Plus, Loader2 } from 'lucide-react'
import type { FieldConfig, ModelConfig } from '@/lib/admin/types'
import dynamic from 'next/dynamic'

// Dynamic import for rich text editor
const RichTextEditor = dynamic(() => import('./RichTextEditor'), {
  ssr: false,
  loading: () => <div className="h-64 bg-gray-50 rounded-md animate-pulse" />
})

interface DynamicFormProps {
  model: ModelConfig
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
}

export function DynamicForm({
  model,
  initialData = {},
  onSubmit,
  onCancel
}: DynamicFormProps) {
  const [loading, setLoading] = useState(false)
  const [fieldVisibility, setFieldVisibility] = useState<Record<string, boolean>>({})
  
  // Generate Zod schema from model fields
  const generateSchema = () => {
    const schemaObject: any = {}
    
    model.fields.forEach(field => {
      let fieldSchema: any = z.any()
      
      switch (field.type) {
        case 'text':
        case 'email':
        case 'password':
        case 'url':
        case 'slug':
          fieldSchema = z.string()
          if (field.type === 'email') {
            fieldSchema = fieldSchema.email('Email invalide')
          }
          if (field.type === 'url') {
            fieldSchema = fieldSchema.url('URL invalide')
          }
          break
        case 'number':
          fieldSchema = z.number()
          break
        case 'date':
        case 'datetime':
        case 'time':
          fieldSchema = z.date()
          break
        case 'checkbox':
          fieldSchema = z.boolean()
          break
        case 'select':
        case 'radio':
          fieldSchema = z.string()
          break
        case 'multiselect':
        case 'tags':
          fieldSchema = z.array(z.string())
          break
        case 'file':
        case 'image':
        case 'gallery':
          fieldSchema = z.any()
          break
        case 'json':
          fieldSchema = z.object({})
          break
        case 'richtext':
        case 'textarea':
          fieldSchema = z.string()
          break
      }
      
      // Apply validation rules
      if (field.validation) {
        field.validation.forEach(rule => {
          switch (rule.type) {
            case 'required':
              if (field.type === 'checkbox') {
                fieldSchema = fieldSchema.refine((val: boolean) => val === true, {
                  message: rule.message
                })
              } else {
                fieldSchema = fieldSchema.min(1, rule.message)
              }
              break
            case 'min':
              if (field.type === 'number') {
                fieldSchema = fieldSchema.min(rule.value, rule.message)
              } else {
                fieldSchema = fieldSchema.min(rule.value, rule.message)
              }
              break
            case 'max':
              if (field.type === 'number') {
                fieldSchema = fieldSchema.max(rule.value, rule.message)
              } else {
                fieldSchema = fieldSchema.max(rule.value, rule.message)
              }
              break
            case 'pattern':
              fieldSchema = fieldSchema.regex(new RegExp(rule.value), rule.message)
              break
            case 'custom':
              if (rule.validator) {
                fieldSchema = fieldSchema.refine(rule.validator, rule.message)
              }
              break
          }
        })
      }
      
      // Make optional if not required
      if (!field.required) {
        fieldSchema = fieldSchema.optional()
      }
      
      schemaObject[field.name] = fieldSchema
    })
    
    return z.object(schemaObject)
  }
  
  const schema = generateSchema()
  
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: initialData
  })
  
  // Watch for field dependencies
  const watchedFields = watch()
  
  useEffect(() => {
    const newVisibility: Record<string, boolean> = {}
    
    model.fields.forEach(field => {
      if (field.dependsOn) {
        const dependentValue = watchedFields[field.dependsOn.field]
        let shouldShow = false
        
        switch (field.dependsOn.condition) {
          case 'equals':
            shouldShow = dependentValue === field.dependsOn.value
            break
          case 'not_equals':
            shouldShow = dependentValue !== field.dependsOn.value
            break
          case 'contains':
            shouldShow = String(dependentValue).includes(field.dependsOn.value)
            break
          case 'not_contains':
            shouldShow = !String(dependentValue).includes(field.dependsOn.value)
            break
          case 'empty':
            shouldShow = !dependentValue || dependentValue === ''
            break
          case 'not_empty':
            shouldShow = !!dependentValue && dependentValue !== ''
            break
        }
        
        newVisibility[field.name] = shouldShow
      } else {
        newVisibility[field.name] = true
      }
    })
    
    setFieldVisibility(newVisibility)
  }, [watchedFields, model.fields])
  
  const onFormSubmit = async (data: any) => {
    setLoading(true)
    try {
      await onSubmit(data)
    } finally {
      setLoading(false)
    }
  }
  
  const renderField = (field: FieldConfig) => {
    if (field.hidden || fieldVisibility[field.name] === false) {
      return null
    }
    
    const error = errors[field.name]
    
    return (
      <div
        key={field.name}
        className={cn(
          'space-y-2',
          field.grid && `col-span-${field.grid.span || 12}`,
          field.grid?.offset && `col-start-${field.grid.offset + 1}`
        )}
      >
        <Label htmlFor={field.name}>
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </Label>
        
        <Controller
          name={field.name}
          control={control}
          render={({ field: formField }) => {
            switch (field.type) {
              case 'text':
              case 'email':
              case 'password':
              case 'url':
              case 'slug':
                return (
                  <Input
                    {...formField}
                    type={field.type === 'slug' ? 'text' : field.type}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    className={error ? 'border-red-500' : ''}
                  />
                )
              
              case 'number':
                return (
                  <Input
                    {...formField}
                    type="number"
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    onChange={(e) => formField.onChange(parseFloat(e.target.value))}
                    className={error ? 'border-red-500' : ''}
                  />
                )
              
              case 'textarea':
                return (
                  <Textarea
                    {...formField}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    rows={4}
                    className={error ? 'border-red-500' : ''}
                  />
                )
              
              case 'richtext':
                return (
                  <RichTextEditor
                    value={formField.value}
                    onChange={formField.onChange}
                    placeholder={field.placeholder}
                  />
                )
              
              case 'select':
                return (
                  <Select
                    value={formField.value}
                    onValueChange={formField.onChange}
                    disabled={field.disabled}
                  >
                    <SelectTrigger className={error ? 'border-red-500' : ''}>
                      <SelectValue placeholder={field.placeholder || 'Sélectionner...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {field.options?.map(option => (
                        <SelectItem
                          key={option.value}
                          value={String(option.value)}
                          disabled={option.disabled}
                        >
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )
              
              case 'multiselect':
                return (
                  <div className="space-y-2">
                    {field.options?.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <Checkbox
                          checked={formField.value?.includes(option.value)}
                          onCheckedChange={(checked) => {
                            const current = formField.value || []
                            if (checked) {
                              formField.onChange([...current, option.value])
                            } else {
                              formField.onChange(current.filter((v: any) => v !== option.value))
                            }
                          }}
                          disabled={field.disabled || option.disabled}
                        />
                        <Label>{option.label}</Label>
                      </div>
                    ))}
                  </div>
                )
              
              case 'checkbox':
                return (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                      disabled={field.disabled}
                    />
                    {field.helpText && (
                      <Label className="text-sm text-gray-600">{field.helpText}</Label>
                    )}
                  </div>
                )
              
              case 'radio':
                return (
                  <RadioGroup
                    value={formField.value}
                    onValueChange={formField.onChange}
                    disabled={field.disabled}
                  >
                    {field.options?.map(option => (
                      <div key={option.value} className="flex items-center space-x-2">
                        <RadioGroupItem
                          value={String(option.value)}
                          disabled={option.disabled}
                        />
                        <Label>{option.label}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )
              
              case 'date':
              case 'datetime':
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          'w-full justify-start text-left font-normal',
                          !formField.value && 'text-muted-foreground',
                          error && 'border-red-500'
                        )}
                        disabled={field.disabled}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formField.value ? (
                          format(new Date(formField.value), 'PPP', { locale: fr })
                        ) : (
                          <span>{field.placeholder || 'Sélectionner une date'}</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formField.value ? new Date(formField.value) : undefined}
                        onSelect={formField.onChange}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )
              
              case 'tags':
                return (
                  <TagsInput
                    value={formField.value || []}
                    onChange={formField.onChange}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                  />
                )
              
              case 'file':
              case 'image':
              case 'gallery':
                return (
                  <FileUpload
                    value={formField.value}
                    onChange={formField.onChange}
                    accept={field.accept}
                    multiple={field.multiple || field.type === 'gallery'}
                    maxSize={field.maxSize}
                    disabled={field.disabled}
                  />
                )
              
              default:
                return (
                  <Input
                    {...formField}
                    placeholder={field.placeholder}
                    disabled={field.disabled}
                    className={error ? 'border-red-500' : ''}
                  />
                )
            }
          }}
        />
        
        {field.helpText && !field.type.includes('checkbox') && (
          <p className="text-sm text-gray-600">{field.helpText}</p>
        )}
        
        {error && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}
      </div>
    )
  }
  
  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-12 gap-6">
        {model.fields.map(renderField)}
      </div>
      
      <div className="flex justify-end space-x-4 pt-6 border-t">
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

// Tags Input Component
function TagsInput({ value, onChange, placeholder, disabled }: any) {
  const [inputValue, setInputValue] = useState('')
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault()
      onChange([...value, inputValue.trim()])
      setInputValue('')
    }
  }
  
  const removeTag = (index: number) => {
    onChange(value.filter((_: any, i: number) => i !== index))
  }
  
  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {value.map((tag: string, index: number) => (
          <span
            key={index}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-senegal-green-100 text-senegal-green-800"
          >
            {tag}
            {!disabled && (
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-2 hover:text-senegal-green-600"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </span>
        ))}
      </div>
      {!disabled && (
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    </div>
  )
}

// File Upload Component
function FileUpload({ value, onChange, accept, multiple, maxSize, disabled }: any) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    
    if (maxSize) {
      const validFiles = files.filter(file => file.size <= maxSize)
      if (validFiles.length < files.length) {
        alert(`Certains fichiers dépassent la taille maximale de ${maxSize / 1024 / 1024}MB`)
      }
      onChange(multiple ? validFiles : validFiles[0])
    } else {
      onChange(multiple ? files : files[0])
    }
  }
  
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-center w-full">
        <label className={cn(
          "flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50",
          disabled && "opacity-50 cursor-not-allowed"
        )}>
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-400" />
            <p className="mb-2 text-sm text-gray-500">
              <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
            </p>
            <p className="text-xs text-gray-500">
              {accept ? `Formats acceptés: ${accept}` : 'Tous les formats'}
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            multiple={multiple}
            onChange={handleFileChange}
            disabled={disabled}
          />
        </label>
      </div>
      
      {value && (
        <div className="space-y-2">
          {Array.isArray(value) ? (
            value.map((file: File, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                <span className="text-sm">{file.name}</span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => {
                      onChange(value.filter((_: any, i: number) => i !== index))
                    }}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))
          ) : (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">{value.name}</span>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => onChange(null)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}