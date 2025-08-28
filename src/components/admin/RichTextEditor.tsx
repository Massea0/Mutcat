'use client'

import { useEffect, useRef } from 'react'
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link,
  Image,
  Code,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Undo,
  Redo
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RichTextEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export default function RichTextEditor({
  value,
  onChange,
  placeholder,
  disabled
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const isInternalChange = useRef(false)

  useEffect(() => {
    if (editorRef.current && !isInternalChange.current) {
      if (editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = value || ''
      }
    }
    isInternalChange.current = false
  }, [value])

  const handleCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value)
    handleContentChange()
  }

  const handleContentChange = () => {
    if (editorRef.current) {
      isInternalChange.current = true
      const newValue = editorRef.current.innerHTML
      if (newValue === '<br>') {
        onChange('')
      } else {
        onChange(newValue)
      }
    }
  }

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    const text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
    handleContentChange()
  }

  const insertLink = () => {
    const url = prompt('Enter URL:')
    if (url) {
      handleCommand('createLink', url)
    }
  }

  const insertImage = () => {
    const url = prompt('Enter image URL:')
    if (url) {
      handleCommand('insertImage', url)
    }
  }

  const ToolbarButton = ({ 
    icon: Icon, 
    command, 
    commandValue,
    onClick,
    title 
  }: { 
    icon: any
    command?: string
    commandValue?: string
    onClick?: () => void
    title: string
  }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick || (() => handleCommand(command!, commandValue))}
      disabled={disabled}
      title={title}
      className="h-8 w-8 p-0"
    >
      <Icon className="h-4 w-4" />
    </Button>
  )

  return (
    <div className={cn(
      "border rounded-lg overflow-hidden",
      disabled && "opacity-50 pointer-events-none"
    )}>
      {/* Toolbar */}
      <div className="border-b bg-gray-50 p-2 flex flex-wrap gap-1">
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton icon={Undo} command="undo" title="Undo" />
          <ToolbarButton icon={Redo} command="redo" title="Redo" />
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton icon={Heading1} command="formatBlock" commandValue="h1" title="Heading 1" />
          <ToolbarButton icon={Heading2} command="formatBlock" commandValue="h2" title="Heading 2" />
          <ToolbarButton icon={Heading3} command="formatBlock" commandValue="h3" title="Heading 3" />
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton icon={Bold} command="bold" title="Bold" />
          <ToolbarButton icon={Italic} command="italic" title="Italic" />
          <ToolbarButton icon={Underline} command="underline" title="Underline" />
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton icon={AlignLeft} command="justifyLeft" title="Align Left" />
          <ToolbarButton icon={AlignCenter} command="justifyCenter" title="Align Center" />
          <ToolbarButton icon={AlignRight} command="justifyRight" title="Align Right" />
        </div>
        
        <div className="flex items-center gap-1 border-r pr-2 mr-2">
          <ToolbarButton icon={List} command="insertUnorderedList" title="Bullet List" />
          <ToolbarButton icon={ListOrdered} command="insertOrderedList" title="Numbered List" />
          <ToolbarButton icon={Quote} command="formatBlock" commandValue="blockquote" title="Quote" />
        </div>
        
        <div className="flex items-center gap-1">
          <ToolbarButton icon={Link} onClick={insertLink} title="Insert Link" />
          <ToolbarButton icon={Image} onClick={insertImage} title="Insert Image" />
          <ToolbarButton icon={Code} command="formatBlock" commandValue="pre" title="Code Block" />
        </div>
      </div>
      
      {/* Editor */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className={cn(
          "min-h-[300px] p-4 focus:outline-none",
          "prose prose-sm max-w-none",
          "[&_h1]:text-2xl [&_h1]:font-bold [&_h1]:mb-4",
          "[&_h2]:text-xl [&_h2]:font-bold [&_h2]:mb-3",
          "[&_h3]:text-lg [&_h3]:font-bold [&_h3]:mb-2",
          "[&_p]:mb-2",
          "[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-2",
          "[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-2",
          "[&_blockquote]:border-l-4 [&_blockquote]:border-gray-300 [&_blockquote]:pl-4 [&_blockquote]:italic",
          "[&_pre]:bg-gray-100 [&_pre]:p-2 [&_pre]:rounded [&_pre]:font-mono [&_pre]:text-sm",
          "[&_a]:text-blue-600 [&_a]:underline",
          "[&_img]:max-w-full [&_img]:h-auto [&_img]:rounded",
          !value && "text-gray-400"
        )}
        onInput={handleContentChange}
        onPaste={handlePaste}
        data-placeholder={placeholder || "Start typing..."}
        suppressContentEditableWarning
      >
        {!value && <span className="text-gray-400">{placeholder || "Start typing..."}</span>}
      </div>
    </div>
  )
}