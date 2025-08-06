'use client'

import { useState } from 'react'
import { templates, TemplateCategory } from '@/lib/templates'

interface TemplatesModalContentProps {
  onBack: () => void
  onSelectTemplate: (message: string) => void
}

const categories: TemplateCategory[] = [
  'Promotions',
  'Announcements',
  'Holiday / Seasonal',
  'Winback',
  'Urgency',
  'Social Proof',
]

export default function TemplatesModalContent({
  onBack,
  onSelectTemplate,
}: TemplatesModalContentProps) {
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory>('Promotions')

  const filteredTemplates = templates.filter((t) => t.category === selectedCategory)

  return (
    <div className="flex flex-col gap-4">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="self-start text-sm text-zinc-600 hover:underline"
      >
        ← Back
      </button>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-3 py-1.5 text-sm rounded-md border ${
              selectedCategory === category
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-zinc-700 border-zinc-300 hover:bg-zinc-100'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Templates */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template.message)}
            className="text-left p-4 rounded-md border border-zinc-200 bg-zinc-50 hover:bg-zinc-100 transition"
          >
            <p className="font-medium text-zinc-800">{template.title}</p>
            <p className="mt-1 text-sm text-zinc-600 line-clamp-3">{template.message}</p>
          </button>
        ))}
        {filteredTemplates.length === 0 && (
          <p className="text-sm text-zinc-500 col-span-full">No templates available in this category.</p>
        )}
      </div>
    </div>
  )
}
