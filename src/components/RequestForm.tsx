import { useState, type FormEvent } from 'react'
import {
  Upload, X, FileText, Image as ImageIcon, Send, CheckCircle, Building2,
  Users, FileQuestion, AlertCircle, ChevronRight, ChevronLeft, Sparkles,
  Scissors, Combine, Paintbrush, Wrench, RotateCcw, Ruler, HelpCircle,
  Calendar, ArrowRight, Paperclip, CloudUpload,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Priority, Attachment } from '../types'
import { mockProjects } from '../mock/mockProjects'
import { mockTeams } from '../mock/mockTeams'
import { useApp } from '../context/AppContext'

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */

const requestTypes = [
  { value: 'Corte de MDF',       label: 'Corte de MDF',       icon: Scissors,    color: 'blue'    },
  { value: 'Montagem de Módulo', label: 'Montagem de Módulo', icon: Combine,     color: 'violet'  },
  { value: 'Acabamento',         label: 'Acabamento',         icon: Paintbrush,  color: 'emerald' },
  { value: 'Instalação',         label: 'Instalação',         icon: Wrench,      color: 'amber'   },
  { value: 'Retrabalho',         label: 'Retrabalho',         icon: RotateCcw,   color: 'rose'    },
  { value: 'Ajuste de Medida',   label: 'Ajuste de Medida',   icon: Ruler,       color: 'cyan'    },
  { value: 'Outro',              label: 'Outro',              icon: HelpCircle,  color: 'gray'    },
]

const priorityOptions: { value: Priority; label: string; description: string; color: string; gradient: string }[] = [
  { value: 'baixa',   label: 'Baixa',   description: 'Sem pressa',    color: 'gray',   gradient: 'from-gray-400 to-gray-500'   },
  { value: 'media',   label: 'Média',   description: 'Padrão',        color: 'blue',   gradient: 'from-blue-400 to-blue-500'   },
  { value: 'alta',    label: 'Alta',    description: 'Importante',    color: 'orange', gradient: 'from-orange-400 to-orange-500' },
  { value: 'urgente', label: 'Urgente', description: 'Crítico!',      color: 'red',    gradient: 'from-red-400 to-red-500'     },
]

const steps = [
  { id: 0, label: 'Local',       shortLabel: 'Local',    icon: Building2,    color: 'blue'   },
  { id: 1, label: 'Serviço',     shortLabel: 'Serviço',  icon: FileQuestion, color: 'violet' },
  { id: 2, label: 'Urgência',    shortLabel: 'Urgência', icon: AlertCircle,  color: 'amber'  },
  { id: 3, label: 'Anexos',      shortLabel: 'Anexos',   icon: Paperclip,    color: 'emerald'},
]

const colorMap: Record<string, { bg: string; bgDark: string; text: string; ring: string; border: string; activeBg: string; activeBorder: string }> = {
  blue:    { bg: 'bg-blue-50',    bgDark: 'dark:bg-blue-500/10',    text: 'text-blue-500',    ring: 'ring-blue-500/20',    border: 'border-blue-200 dark:border-blue-500/30',    activeBg: 'bg-blue-50 dark:bg-blue-500/10',       activeBorder: 'border-blue-500 dark:border-blue-400'   },
  violet:  { bg: 'bg-violet-50',  bgDark: 'dark:bg-violet-500/10',  text: 'text-violet-500',  ring: 'ring-violet-500/20',  border: 'border-violet-200 dark:border-violet-500/30',  activeBg: 'bg-violet-50 dark:bg-violet-500/10',   activeBorder: 'border-violet-500 dark:border-violet-400' },
  emerald: { bg: 'bg-emerald-50', bgDark: 'dark:bg-emerald-500/10', text: 'text-emerald-500', ring: 'ring-emerald-500/20', border: 'border-emerald-200 dark:border-emerald-500/30', activeBg: 'bg-emerald-50 dark:bg-emerald-500/10', activeBorder: 'border-emerald-500 dark:border-emerald-400' },
  amber:   { bg: 'bg-amber-50',   bgDark: 'dark:bg-amber-500/10',   text: 'text-amber-500',   ring: 'ring-amber-500/20',   border: 'border-amber-200 dark:border-amber-500/30',   activeBg: 'bg-amber-50 dark:bg-amber-500/10',     activeBorder: 'border-amber-500 dark:border-amber-400'   },
  rose:    { bg: 'bg-rose-50',    bgDark: 'dark:bg-rose-500/10',    text: 'text-rose-500',    ring: 'ring-rose-500/20',    border: 'border-rose-200 dark:border-rose-500/30',    activeBg: 'bg-rose-50 dark:bg-rose-500/10',       activeBorder: 'border-rose-500 dark:border-rose-400'   },
  cyan:    { bg: 'bg-cyan-50',    bgDark: 'dark:bg-cyan-500/10',    text: 'text-cyan-500',    ring: 'ring-cyan-500/20',    border: 'border-cyan-200 dark:border-cyan-500/30',    activeBg: 'bg-cyan-50 dark:bg-cyan-500/10',       activeBorder: 'border-cyan-500 dark:border-cyan-400'   },
  gray:    { bg: 'bg-gray-50',    bgDark: 'dark:bg-gray-500/10',    text: 'text-gray-500',    ring: 'ring-gray-500/20',    border: 'border-gray-200 dark:border-gray-500/30',    activeBg: 'bg-gray-50 dark:bg-gray-500/10',       activeBorder: 'border-gray-500 dark:border-gray-400'   },
  orange:  { bg: 'bg-orange-50',  bgDark: 'dark:bg-orange-500/10',  text: 'text-orange-500',  ring: 'ring-orange-500/20',  border: 'border-orange-200 dark:border-orange-500/30',  activeBg: 'bg-orange-50 dark:bg-orange-500/10',   activeBorder: 'border-orange-500 dark:border-orange-400' },
  red:     { bg: 'bg-red-50',     bgDark: 'dark:bg-red-500/10',     text: 'text-red-500',     ring: 'ring-red-500/20',     border: 'border-red-200 dark:border-red-500/30',     activeBg: 'bg-red-50 dark:bg-red-500/10',         activeBorder: 'border-red-500 dark:border-red-400'     },
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export default function RequestForm() {
  const navigate = useNavigate()
  const { addRequest } = useApp()
  const [submitted, setSubmitted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

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
    if (!formData.projectId || !formData.teamId || !formData.type || !formData.description || !formData.priority || !formData.deadline) return

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
    setTimeout(() => navigate('/app/solicitacoes'), 1800)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    addFiles(Array.from(e.dataTransfer.files))
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) addFiles(Array.from(e.target.files))
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

  const removeAttachment = (id: string) => setAttachments(prev => prev.filter(a => a.id !== id))

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(0)} KB`
    return `${(bytes / 1048576).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => type.startsWith('image/') ? ImageIcon : FileText

  const isValid = formData.projectId && formData.teamId && formData.type && formData.description && formData.priority && formData.deadline

  const canProceed = (step: number): boolean => {
    if (step === 0) return !!(formData.projectId && formData.teamId)
    if (step === 1) return !!(formData.type && formData.description)
    if (step === 2) return !!(formData.priority && formData.deadline)
    return true
  }

  const filledFields = [formData.projectId, formData.teamId, formData.type, formData.description, formData.priority, formData.deadline].filter(Boolean).length
  const progress = Math.round((filledFields / 6) * 100)

  const selectedProject = mockProjects.find(p => p.id === formData.projectId)
  const selectedTeam = mockTeams.find(t => t.id === formData.teamId)

  /* ── Success state ── */
  if (submitted) {
    return (
      <div className="max-w-lg mx-auto mt-6 sm:mt-16">
        <div className="relative overflow-hidden card p-8 sm:p-12 text-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-cyan-500/5" />
          <div className="relative">
            <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-3xl mx-auto flex items-center justify-center mb-5 shadow-xl shadow-emerald-500/20">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Solicitação Criada!</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 max-w-xs mx-auto">
              Sua solicitação foi registrada com sucesso e a equipe será notificada. Redirecionando...
            </p>
            <div className="mt-6 h-1 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden max-w-[200px] mx-auto">
              <div className="h-full bg-emerald-500 rounded-full animate-[progressFill_1.8s_ease-out_forwards]" />
            </div>
          </div>
        </div>
        <style>{`@keyframes progressFill { from { width: 0 } to { width: 100% } }`}</style>
      </div>
    )
  }

  /* ── Main form ── */
  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">

      {/* ─── Stepper header ─── */}
      <div className="card p-3 sm:p-4 mb-5 sm:mb-6">
        <div className="flex items-center gap-1 sm:gap-0 sm:justify-between">
          {steps.map((step, i) => {
            const StepIcon = step.icon
            const isActive = currentStep === i
            const isDone = currentStep > i || (i < 3 && canProceed(i))
            const c = colorMap[step.color]

            return (
              <div key={step.id} className="flex items-center flex-1 last:flex-none">
                <button
                  type="button"
                  onClick={() => setCurrentStep(i)}
                  className={`flex items-center gap-2 sm:gap-2.5 px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl transition-all duration-300 w-full sm:w-auto ${
                    isActive
                      ? `${c.bg} ${c.bgDark} ring-1 ${c.ring} shadow-sm`
                      : isDone
                        ? 'hover:bg-gray-50 dark:hover:bg-dark-hover'
                        : 'opacity-50'
                  }`}
                >
                  <div className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                    isActive
                      ? `${c.bg} ${c.bgDark}`
                      : isDone
                        ? 'bg-emerald-50 dark:bg-emerald-500/10'
                        : 'bg-gray-100 dark:bg-dark-surface'
                  }`}>
                    {isDone && !isActive ? (
                      <CheckCircle className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <StepIcon className={`w-4 h-4 ${isActive ? c.text : 'text-gray-400 dark:text-gray-500'}`} />
                    )}
                  </div>
                  <div className="hidden sm:block min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}`}>
                      {step.shortLabel}
                    </p>
                  </div>
                </button>
                {i < steps.length - 1 && (
                  <div className={`hidden sm:block flex-1 h-px mx-2 transition-colors duration-300 ${
                    currentStep > i ? 'bg-emerald-300 dark:bg-emerald-500/40' : 'bg-gray-200 dark:bg-dark-border'
                  }`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Progress bar */}
        <div className="mt-3 sm:mt-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400">
              Etapa {currentStep + 1} de {steps.length}
            </span>
            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400">{progress}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 dark:bg-dark-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-violet-500 rounded-full transition-all duration-700 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* ─── Step content ─── */}
      <div className="min-h-[340px] sm:min-h-[380px]">

        {/* ── STEP 0: Local ── */}
        {currentStep === 0 && (
          <div className="space-y-4 sm:space-y-5 animate-[fadeSlideIn_0.35s_ease-out]">
            <div className="card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600" />
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-blue-50 dark:bg-blue-500/10 rounded-xl flex items-center justify-center">
                    <Building2 className="w-5 h-5 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Onde será feito?</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Selecione a obra e a equipe responsável</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                  {/* Obra selector */}
                  <div>
                    <label className="label-text flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-gray-400" />
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
                    {selectedProject && (
                      <div className="mt-2.5 p-3 bg-blue-50/50 dark:bg-blue-500/5 rounded-xl border border-blue-100 dark:border-blue-500/10">
                        <p className="text-xs font-semibold text-blue-700 dark:text-blue-400">{selectedProject.name}</p>
                        <p className="text-[11px] text-blue-500/70 dark:text-blue-400/50 mt-0.5">{selectedProject.client} · {selectedProject.address}</p>
                      </div>
                    )}
                  </div>

                  {/* Equipe selector */}
                  <div>
                    <label className="label-text flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gray-400" />
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
                    {selectedTeam && (
                      <div className="mt-2.5 p-3 bg-violet-50/50 dark:bg-violet-500/5 rounded-xl border border-violet-100 dark:border-violet-500/10">
                        <p className="text-xs font-semibold text-violet-700 dark:text-violet-400">{selectedTeam.name}</p>
                        <p className="text-[11px] text-violet-500/70 dark:text-violet-400/50 mt-0.5">👷 {selectedTeam.members} membros</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 1: Serviço ── */}
        {currentStep === 1 && (
          <div className="space-y-4 sm:space-y-5 animate-[fadeSlideIn_0.35s_ease-out]">
            <div className="card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-violet-500 to-purple-600" />
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-violet-50 dark:bg-violet-500/10 rounded-xl flex items-center justify-center">
                    <FileQuestion className="w-5 h-5 text-violet-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">O que precisa?</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Selecione o tipo de serviço e descreva o que precisa</p>
                  </div>
                </div>

                {/* Service type cards */}
                <label className="label-text mb-3">
                  Tipo de Serviço <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5 mb-5">
                  {requestTypes.map(rt => {
                    const RtIcon = rt.icon
                    const isActive = formData.type === rt.value
                    const c = colorMap[rt.color]
                    return (
                      <button
                        key={rt.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, type: rt.value }))}
                        className={`flex flex-col items-center gap-1.5 p-3 sm:p-3.5 rounded-xl border-2 transition-all duration-200 text-center ${
                          isActive
                            ? `${c.activeBg} ${c.activeBorder} shadow-sm`
                            : 'border-gray-150 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-dark-hover/50'
                        }`}
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isActive ? `${c.bg} ${c.bgDark}` : 'bg-gray-100 dark:bg-dark-surface'}`}>
                          <RtIcon className={`w-4 h-4 ${isActive ? c.text : 'text-gray-400 dark:text-gray-500'}`} />
                        </div>
                        <span className={`text-xs font-semibold leading-tight ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-400'}`}>
                          {rt.label}
                        </span>
                      </button>
                    )
                  })}
                </div>

                {/* Description */}
                <label className="label-text flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-gray-400" />
                  Descrição Detalhada <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Ex: Preciso de 3 peças de MDF 15mm na cor branca, medidas 60x40cm para o armário da cozinha..."
                  rows={4}
                  className="input-field resize-none"
                />
                <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-1.5 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Quanto mais detalhes, melhor a equipe vai entender o pedido
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 2: Urgência ── */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-5 animate-[fadeSlideIn_0.35s_ease-out]">
            <div className="card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-amber-500 to-orange-500" />
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-amber-50 dark:bg-amber-500/10 rounded-xl flex items-center justify-center">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Qual a urgência?</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Defina a prioridade e o prazo de entrega</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                  {/* Priority cards */}
                  <div>
                    <label className="label-text mb-3">
                      Prioridade <span className="text-red-500">*</span>
                    </label>
                    <div className="space-y-2">
                      {priorityOptions.map(opt => {
                        const isActive = formData.priority === opt.value
                        const c = colorMap[opt.color]
                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, priority: opt.value }))}
                            className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl border-2 transition-all duration-200 text-left group ${
                              isActive
                                ? `${c.activeBg} ${c.activeBorder} shadow-sm`
                                : 'border-gray-150 dark:border-dark-border hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50/50 dark:hover:bg-dark-hover/50'
                            }`}
                          >
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-br ${opt.gradient} ${isActive ? 'scale-125 ring-4 ' + c.ring : ''} transition-all duration-200`} />
                            <div className="flex-1 min-w-0">
                              <span className={`text-sm font-semibold ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}>
                                {opt.label}
                              </span>
                              <span className="text-xs text-gray-400 dark:text-gray-500 ml-2">{opt.description}</span>
                            </div>
                            {isActive && <CheckCircle className={`w-4 h-4 ${c.text} flex-shrink-0`} />}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Deadline */}
                  <div>
                    <label className="label-text flex items-center gap-1.5 mb-3">
                      <Calendar className="w-3.5 h-3.5 text-gray-400" />
                      Prazo de Entrega <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
                      className="input-field"
                    />
                    <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">
                      Quando este serviço precisa estar pronto?
                    </p>

                    {/* Quick summary */}
                    {(formData.priority || formData.deadline) && (
                      <div className="mt-4 p-3.5 bg-amber-50/50 dark:bg-amber-500/5 rounded-xl border border-amber-100 dark:border-amber-500/10">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-amber-600/70 dark:text-amber-400/70 mb-2">Resumo</p>
                        {formData.priority && (
                          <p className="text-xs text-amber-800 dark:text-amber-300">
                            Prioridade: <strong>{priorityOptions.find(o => o.value === formData.priority)?.label}</strong>
                          </p>
                        )}
                        {formData.deadline && (
                          <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                            Prazo: <strong>{new Date(formData.deadline + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</strong>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── STEP 3: Anexos ── */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-5 animate-[fadeSlideIn_0.35s_ease-out]">
            <div className="card overflow-hidden">
              <div className="h-1 bg-gradient-to-r from-emerald-500 to-teal-500" />
              <div className="p-4 sm:p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl flex items-center justify-center">
                    <CloudUpload className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white">Anexos</h3>
                    <p className="text-xs text-gray-400 dark:text-gray-500">Opcional — adicione fotos, plantas ou documentos</p>
                  </div>
                </div>

                {/* Drop zone */}
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-6 sm:p-10 text-center transition-all duration-300 ${
                    dragActive
                      ? 'border-emerald-400 bg-emerald-50/50 dark:bg-emerald-500/5 scale-[1.01]'
                      : 'border-gray-200 dark:border-dark-border hover:border-emerald-300 dark:hover:border-emerald-500/30 hover:bg-gray-50/30 dark:hover:bg-dark-surface/30'
                  }`}
                >
                  <div className={`w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center transition-colors duration-300 ${
                    dragActive ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-gray-100 dark:bg-dark-surface'
                  }`}>
                    <Upload className={`w-6 h-6 ${dragActive ? 'text-emerald-500' : 'text-gray-400 dark:text-gray-500'}`} />
                  </div>
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    <span className="hidden sm:inline">Arraste arquivos aqui ou{' '}</span>
                    <label className="text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 cursor-pointer underline underline-offset-2 decoration-emerald-300 dark:decoration-emerald-500/30">
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
                  <p className="text-[11px] text-gray-400 dark:text-gray-500 mt-2">Fotos, PDFs ou documentos até 10MB</p>
                </div>

                {/* Attached files */}
                {attachments.length > 0 && (
                  <div className="mt-4 space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                      {attachments.length} arquivo{attachments.length !== 1 ? 's' : ''} anexado{attachments.length !== 1 ? 's' : ''}
                    </p>
                    {attachments.map(att => {
                      const Icon = getFileIcon(att.type)
                      return (
                        <div key={att.id} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-dark-surface rounded-xl group hover:bg-gray-100/70 dark:hover:bg-dark-hover transition-colors">
                          <div className="w-9 h-9 bg-white dark:bg-dark-card rounded-lg flex items-center justify-center border border-gray-200 dark:border-dark-border">
                            <Icon className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{att.name}</p>
                            <p className="text-[11px] text-gray-400 dark:text-gray-500">{att.size}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => removeAttachment(att.id)}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Summary card */}
            {isValid && (
              <div className="card overflow-hidden">
                <div className="h-1 bg-gradient-to-r from-blue-500 via-violet-500 to-emerald-500" />
                <div className="p-4 sm:p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-3 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3" /> Resumo da Solicitação
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Obra</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate mt-0.5">{selectedProject?.name}</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Equipe</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate mt-0.5">{selectedTeam?.name}</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Serviço</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate mt-0.5">{formData.type}</p>
                    </div>
                    <div className="p-2.5 bg-gray-50 dark:bg-dark-surface rounded-lg">
                      <p className="text-[10px] uppercase tracking-wider text-gray-400 dark:text-gray-500 font-semibold">Prioridade</p>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate mt-0.5">
                        {priorityOptions.find(o => o.value === formData.priority)?.label}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── Navigation footer ─── */}
      <div className="flex items-center justify-between gap-3 mt-5 sm:mt-6 pt-4 border-t border-gray-100 dark:border-dark-border">
        {/* Left: back / cancel */}
        <div>
          {currentStep === 0 ? (
            <button
              type="button"
              onClick={() => navigate('/app/solicitacoes')}
              className="text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              Cancelar
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s - 1)}
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </button>
          )}
        </div>

        {/* Right: next / submit */}
        <div>
          {currentStep < steps.length - 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(s => s + 1)}
              disabled={!canProceed(currentStep)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold rounded-xl hover:from-blue-600 hover:to-blue-700 shadow-sm shadow-blue-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Próximo
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!isValid}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white text-sm font-semibold rounded-xl hover:from-emerald-600 hover:to-emerald-700 shadow-sm shadow-emerald-500/20 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98]"
            >
              <Send className="w-4 h-4" />
              Criar Solicitação
            </button>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </form>
  )
}
