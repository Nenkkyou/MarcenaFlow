import { useState, type FormEvent } from 'react'
import { Upload, X, FileText, Image, Send, CheckCircle, Building2, Users, FileQuestion, AlertCircle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Priority, Attachment } from '../types'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { useApp } from '../context/AppContext'

const requestTypes = [
  'Corte de MDF',
  'Montagem de Módulo',
  'Acabamento',
  'Instalação',
  'Retrabalho',
  'Ajuste de Medida',
  'Outro',
]

export default function RequestForm() {
  const navigate = useNavigate()
  const { addRequest } = useApp()
  const [submitted, setSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    projectId: '',
    teamId: '',
    type: '',
    description: '',
    priority: '' as Priority | '',
    deadline: '',
  })

  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [dragActive, setDragActive] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    if (!formData.projectId || !formData.teamId || !formData.type || !formData.description || !formData.priority || !formData.deadline) {
      return
    }

    addRequest({
      projectId: formData.projectId,
      teamId: formData.teamId,
      type: formData.type,
      description: formData.description,
      priority: formData.priority as Priority,
      deadline: formData.deadline,
      status: 'pendente',
      attachments,
    })

    setSubmitted(true)
    setTimeout(() => navigate('/solicitacoes'), 1500)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    const files = Array.from(e.dataTransfer.files)
    addFiles(files)
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files))
    }
  }

  const addFiles = (files: File[]) => {
    const newAttachments: Attachment[] = files.map((file, i) => ({
      id: `att-new-${Date.now()}-${i}`,
      name: file.name,
      size: formatFileSize(file.size),
      type: file.type,
    }))
    setAttachments(prev => [...prev, ...newAttachments])
  }

  const removeAttachment = (id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id))
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    return FileText
  }

  const isValid = formData.projectId && formData.teamId && formData.type && formData.description && formData.priority && formData.deadline

  // Success state
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-12">
        <div className="card p-12 text-center">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-500/10 rounded-2xl mx-auto flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-emerald-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Solicitação criada!</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
            Sua solicitação foi registrada com sucesso. Redirecionando...
          </p>
        </div>
      </div>
    )
  }

  // Progress indicator
  const filledFields = [formData.projectId, formData.teamId, formData.type, formData.description, formData.priority, formData.deadline].filter(Boolean).length
  const progress = Math.round((filledFields / 6) * 100)

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl">
      {/* Progress bar */}
      <div className="card p-4 mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-bold text-gray-900 dark:text-white">Progresso do formulário</span>
          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
        </div>
        <div className="h-2 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Preencha todos os campos obrigatórios para enviar
        </p>
      </div>

      <div className="space-y-6">
        {/* Obra e Equipe */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-blue-50 dark:bg-blue-500/10 rounded-lg flex items-center justify-center">
              <Building2 className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Onde será feito?</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Selecione a obra e a equipe responsável</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-text">
                Obra <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.projectId}
                onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                className="select-field"
              >
                <option value="">Escolha uma obra...</option>
                {mockProjects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">
                Equipe <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.teamId}
                onChange={(e) => setFormData(prev => ({ ...prev, teamId: e.target.value }))}
                className="select-field"
              >
                <option value="">Escolha a equipe...</option>
                {mockTeams.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Tipo e Descrição */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-violet-50 dark:bg-violet-500/10 rounded-lg flex items-center justify-center">
              <FileQuestion className="w-4 h-4 text-violet-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">O que precisa?</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Descreva o que está sendo solicitado</p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="label-text">
                Tipo de Serviço <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value }))}
                className="select-field"
              >
                <option value="">Escolha o tipo...</option>
                {requestTypes.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="label-text">
                Descrição Detalhada <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Ex: Preciso de 3 peças de MDF 15mm na cor branca, medidas 60x40cm para o armário da cozinha..."
                rows={4}
                className="input-field resize-none"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                Quanto mais detalhes, melhor a equipe vai entender o pedido
              </p>
            </div>
          </div>
        </div>

        {/* Prioridade e Prazo */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-amber-50 dark:bg-amber-500/10 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Qual a urgência?</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Defina a prioridade e o prazo de entrega</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="label-text">
                Prioridade <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {(['baixa', 'media', 'alta', 'urgente'] as Priority[]).map(p => {
                  const isActive = formData.priority === p
                  const styles: Record<Priority, { active: string; icon: string }> = {
                    baixa: {
                      active: 'border-gray-400 bg-gray-50 dark:bg-gray-500/10 dark:border-gray-500',
                      icon: '🔹',
                    },
                    media: {
                      active: 'border-blue-500 bg-blue-50 dark:bg-blue-500/10 dark:border-blue-500',
                      icon: '🔸',
                    },
                    alta: {
                      active: 'border-orange-500 bg-orange-50 dark:bg-orange-500/10 dark:border-orange-500',
                      icon: '🔶',
                    },
                    urgente: {
                      active: 'border-red-500 bg-red-50 dark:bg-red-500/10 dark:border-red-500',
                      icon: '🔴',
                    },
                  }
                  const labels: Record<Priority, string> = {
                    baixa: 'Baixa',
                    media: 'Média',
                    alta: 'Alta',
                    urgente: 'Urgente',
                  }
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, priority: p }))}
                      className={`flex items-center justify-center gap-2 px-3 py-3 border-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                        isActive
                          ? styles[p].active
                          : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span>{styles[p].icon}</span>
                      {labels[p]}
                    </button>
                  )
                })}
              </div>
            </div>

            <div>
              <label className="label-text">
                Prazo de Entrega <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                className="input-field"
              />
              <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                Quando este serviço precisa estar pronto?
              </p>
            </div>
          </div>
        </div>

        {/* Anexos */}
        <div className="card p-6">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 bg-emerald-50 dark:bg-emerald-500/10 rounded-lg flex items-center justify-center">
              <Upload className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Anexos (opcional)</h3>
              <p className="text-xs text-gray-400 dark:text-gray-500">Adicione fotos, plantas ou documentos</p>
            </div>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
            onDragLeave={() => setDragActive(false)}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-200 ${
              dragActive
                ? 'border-blue-400 bg-blue-50/50 dark:bg-blue-500/5'
                : 'border-gray-200 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-dark-surface/50'
            }`}
          >
            <Upload className={`w-10 h-10 mx-auto mb-3 ${dragActive ? 'text-blue-500' : 'text-gray-400 dark:text-gray-500'}`} />
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
              <span className="hidden sm:inline">Arraste arquivos aqui ou{' '}</span>
              <label className="text-blue-500 hover:text-blue-600 cursor-pointer underline underline-offset-2">
                <span className="sm:hidden">Toque para selecionar arquivos</span>
                <span className="hidden sm:inline">clique para selecionar</span>
                <input
                  type="file"
                  multiple
                  onChange={handleFileInput}
                  className="hidden"
                  accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
                />
              </label>
            </p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">Fotos, PDFs ou documentos até 10MB</p>
          </div>

          {/* Attached files */}
          {attachments.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachments.map(att => {
                const Icon = getFileIcon(att.type)
                return (
                  <div key={att.id} className="flex items-center gap-3 p-3.5 bg-gray-50 dark:bg-dark-surface rounded-xl group">
                    <div className="w-10 h-10 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                      <Icon className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 truncate">{att.name}</p>
                      <p className="text-xs text-gray-400 dark:text-gray-500">{att.size}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAttachment(att.id)}
                      className="p-2.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-2">
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center sm:text-left">
            Campos com <span className="text-red-500">*</span> são obrigatórios
          </p>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => navigate('/app/solicitacoes')}
              className="btn-secondary flex-1 sm:flex-none justify-center"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!isValid}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed flex-1 sm:flex-none justify-center"
            >
              <Send className="w-4 h-4" />
              Criar Solicitação
            </button>
          </div>
        </div>
      </div>
    </form>
  )
}
