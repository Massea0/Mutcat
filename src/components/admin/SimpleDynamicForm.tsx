'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { CalendarIcon, Loader2 } from 'lucide-react'
import type { ModelConfig } from '@/lib/admin/types'

interface SimpleDynamicFormProps {
  model: ModelConfig
  initialData?: any
  onSubmit: (data: any) => Promise<void>
  onCancel?: () => void
}

export function SimpleDynamicForm({
  model,
  initialData = {},
  onSubmit,
  onCancel
}: SimpleDynamicFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (name: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [name]: value }))
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    model.fields.forEach(field => {
      if (field.required && !formData[field.name]) {
        newErrors[field.name] = 'Ce champ est requis'
      }
    })
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }
    
    setLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="max-h-[60vh] overflow-y-auto pr-2">
        <div className="space-y-4">
          {model.fields.map((field) => {
            const value = formData[field.name] || ''
            const error = errors[field.name]
            
            return (
              <div key={field.name} className="space-y-2">
                <Label htmlFor={field.name} className="text-sm font-medium">
                  {field.label}
                  {field.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                
                {/* Text inputs */}
                {['text', 'email', 'url', 'slug'].includes(field.type) && (
                  <Input
                    id={field.name}
                    type={field.type === 'email' ? 'email' : 'text'}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    className={cn(error && "border-red-500")}
                  />
                )}
                
                {/* Number input */}
                {field.type === 'number' && (
                  <Input
                    id={field.name}
                    type="number"
                    value={value}
                    onChange={(e) => handleChange(field.name, parseFloat(e.target.value) || 0)}
                    placeholder={field.placeholder}
                    className={cn(error && "border-red-500")}
                  />
                )}
                
                {/* Textarea */}
                {field.type === 'textarea' && (
                  <Textarea
                    id={field.name}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    className={cn(error && "border-red-500")}
                  />
                )}
                
                {/* Rich text (using textarea for now) */}
                {field.type === 'richtext' && (
                  <Textarea
                    id={field.name}
                    value={value}
                    onChange={(e) => handleChange(field.name, e.target.value)}
                    placeholder={field.placeholder || 'Contenu HTML'}
                    rows={6}
                    className={cn(error && "border-red-500")}
                  />
                )}
                
                {/* Select */}
                {field.type === 'select' && (
                  <Select 
                    value={value} 
                    onValueChange={(val) => handleChange(field.name, val)}
                  >
                    <SelectTrigger className={cn(error && "border-red-500")}>
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
                
                {/* Date picker */}
                {['date', 'datetime'].includes(field.type) && (
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !value && "text-muted-foreground",
                          error && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? format(new Date(value), "PPP", { locale: fr }) : <span>Choisir une date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={value ? new Date(value) : undefined}
                        onSelect={(date) => handleChange(field.name, date?.toISOString())}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                )}
                
                {/* Error message */}
                {error && (
                  <p className="text-sm text-red-500">{error}</p>
                )}
                
                {/* Helper text */}
                {field.helper && (
                  <p className="text-xs text-gray-500">{field.helper}</p>
                )}
              </div>
            )
          })}
        </div>
      </div>
      
      <div className="flex justify-end space-x-4 pt-4 border-t">
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