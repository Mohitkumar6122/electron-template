import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertCircle,
  Brain,
  CheckCircle2,
  Cloud,
  Download,
  Key
} from 'lucide-react'
import { useState } from 'react'

type ModelStatus = 'installed' | 'downloading' | 'available' | 'error'
type ModelType =
  | 'tesseract'
  | 'apple-vision'
  | 'vlm'
  | 'easyocr'
  | 'paddleocr'
  | 'cloud'

interface OCRModel {
  id: string
  name: string
  description: string
  size: string
  accuracy: number
  status: ModelStatus
  type: ModelType
  isCloud?: boolean
  downloadProgress?: number
}

const models: OCRModel[] = [
  {
    id: 'tesseract-english',
    name: 'Tesseract English',
    description: 'High-quality English text recognition',
    size: '12.5 MB',
    accuracy: 95,
    status: 'installed',
    type: 'tesseract'
  },
  {
    id: 'apple-vision',
    name: 'Apple Vision',
    description: 'Native Apple OCR with optimal performance',
    size: '5.2 MB',
    accuracy: 97,
    status: 'installed',
    type: 'apple-vision'
  },
  {
    id: 'vlm-gpt4v',
    name: 'VLM GPT-4V',
    description: 'Vision Language Model for complex text extraction',
    size: '2.1 GB',
    accuracy: 99,
    status: 'downloading',
    type: 'vlm',
    downloadProgress: 67
  },
  {
    id: 'easyocr-accurate',
    name: 'EasyOCR Accurate',
    description: 'Deep learning model with high accuracy',
    size: '125.8 MB',
    accuracy: 98,
    status: 'available',
    type: 'easyocr'
  },
  {
    id: 'paddleocr-fast',
    name: 'PaddleOCR Fast',
    description: 'Lightweight model optimized for speed',
    size: '8.3 MB',
    accuracy: 88,
    status: 'available',
    type: 'paddleocr'
  },
  {
    id: 'openai-gpt4v',
    name: 'OpenAI GPT-4V',
    description: 'Cloud-based vision model',
    size: 'API',
    accuracy: 99,
    status: 'available',
    type: 'cloud',
    isCloud: true
  },
  {
    id: 'google-vision',
    name: 'Google Vision API',
    description: 'Google Cloud vision service',
    size: 'API',
    accuracy: 96,
    status: 'available',
    type: 'cloud',
    isCloud: true
  },
  {
    id: 'azure-vision',
    name: 'Azure Computer Vision',
    description: 'Microsoft cloud OCR service',
    size: 'API',
    accuracy: 95,
    status: 'available',
    type: 'cloud',
    isCloud: true
  }
]

export const ModelsSettingsPage = () => {
  const [selectedModel, setSelectedModel] = useState('apple-vision')
  const [modelList, setModelList] = useState(models)
  const [modelSettings, setModelSettings] = useState({
    autoDetectLanguage: true,
    selectedLanguage: 'english',
    visionMode: 'fast', // 'fast' or 'slow'
    vlmPrompt:
      'Extract all text from this image, maintaining the original formatting and structure.',
    vlmOutputFormat: 'plain', // 'plain', 'markdown', 'json'
    // API Keys
    openaiApiKey: '',
    googleApiKey: '',
    azureApiKey: '',
    azureEndpoint: ''
  })

  const getStatusIcon = (status: ModelStatus, isCloud?: boolean) => {
    if (isCloud) {
      return <Cloud className="h-3 w-3 text-blue-500" />
    }
    switch (status) {
      case 'installed':
        return <CheckCircle2 className="h-3 w-3 text-green-500" />
      case 'downloading':
        return <Download className="h-3 w-3 text-blue-500" />
      case 'available':
        return <Download className="h-3 w-3 text-muted-foreground" />
      case 'error':
        return <AlertCircle className="h-3 w-3 text-red-500" />
    }
  }

  const getStatusBadge = (status: ModelStatus) => {
    switch (status) {
      case 'installed':
        return (
          <Badge
            variant="default"
            className="bg-green-100 text-green-800 text-xs px-2 py-0.5"
          >
            Installed
          </Badge>
        )
      case 'downloading':
        return (
          <Badge variant="secondary" className="text-xs px-2 py-0.5">
            Downloading
          </Badge>
        )
      case 'available':
        return (
          <Badge variant="outline" className="text-xs px-2 py-0.5">
            Available
          </Badge>
        )
      case 'error':
        return (
          <Badge variant="destructive" className="text-xs px-2 py-0.5">
            Error
          </Badge>
        )
    }
  }

  const handleDownload = (modelId: string) => {
    setModelList(prevModels =>
      prevModels.map(model =>
        model.id === modelId
          ? {
              ...model,
              status: 'downloading' as ModelStatus,
              downloadProgress: 0
            }
          : model
      )
    )

    // Simulate download progress
    const interval = setInterval(() => {
      setModelList(prevModels =>
        prevModels.map(model => {
          if (model.id === modelId && model.status === 'downloading') {
            const newProgress =
              (model.downloadProgress || 0) + Math.random() * 15
            if (newProgress >= 100) {
              clearInterval(interval)
              return {
                ...model,
                status: 'installed' as ModelStatus,
                downloadProgress: 100
              }
            }
            return { ...model, downloadProgress: newProgress }
          }
          return model
        })
      )
    }, 500)
  }
  const selectedModelData = modelList.find(model => model.id === selectedModel)

  const renderCloudSettings = () => {
    switch (selectedModelData?.id) {
      case 'openai-gpt4v':
        return (
          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
            <Label className="text-xs text-foreground">OpenAI API Key</Label>
            <Input
              type="password"
              value={modelSettings.openaiApiKey}
              onChange={e =>
                setModelSettings({
                  ...modelSettings,
                  openaiApiKey: e.target.value
                })
              }
              placeholder="sk-..."
              className="bg-background/80 border-border text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://platform.openai.com/api-keys"
                className="text-blue-500 hover:underline"
              >
                OpenAI Platform
              </a>
            </p>
          </div>
        )
      case 'google-vision':
        return (
          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
            <Label className="text-xs text-foreground">
              Google Cloud API Key
            </Label>
            <Input
              type="password"
              value={modelSettings.googleApiKey}
              onChange={e =>
                setModelSettings({
                  ...modelSettings,
                  googleApiKey: e.target.value
                })
              }
              placeholder="AIza..."
              className="bg-background/80 border-border text-xs"
            />
            <p className="text-xs text-muted-foreground">
              Get your API key from{' '}
              <a
                href="https://console.cloud.google.com/apis/credentials"
                className="text-blue-500 hover:underline"
              >
                Google Cloud Console
              </a>
            </p>
          </div>
        )
      case 'azure-vision':
        return (
          <div className="space-y-3">
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Label className="text-xs text-foreground">Azure API Key</Label>
              <Input
                type="password"
                value={modelSettings.azureApiKey}
                onChange={e =>
                  setModelSettings({
                    ...modelSettings,
                    azureApiKey: e.target.value
                  })
                }
                placeholder="Your Azure API key"
                className="bg-background/80 border-border text-xs"
              />
            </div>
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Label className="text-xs text-foreground">Azure Endpoint</Label>
              <Input
                value={modelSettings.azureEndpoint}
                onChange={e =>
                  setModelSettings({
                    ...modelSettings,
                    azureEndpoint: e.target.value
                  })
                }
                placeholder="https://your-resource.cognitiveservices.azure.com/"
                className="bg-background/80 border-border text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Get your credentials from{' '}
                <a
                  href="https://portal.azure.com/"
                  className="text-blue-500 hover:underline"
                >
                  Azure Portal
                </a>
              </p>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  const renderModelSettings = () => {
    if (!selectedModelData) return null

    switch (selectedModelData.type) {
      case 'apple-vision':
        return (
          <div className="space-y-3">
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Label className="text-xs text-foreground">
                Language Detection
              </Label>
              <Select
                value={modelSettings.autoDetectLanguage ? 'auto' : 'manual'}
                onValueChange={value =>
                  setModelSettings({
                    ...modelSettings,
                    autoDetectLanguage: value === 'auto'
                  })
                }
              >
                <SelectTrigger className="bg-background/80 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect language</SelectItem>
                  <SelectItem value="manual">
                    Select language manually
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {!modelSettings.autoDetectLanguage && (
              <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
                <Label className="text-xs text-foreground">Language</Label>
                <Select
                  value={modelSettings.selectedLanguage}
                  onValueChange={value =>
                    setModelSettings({
                      ...modelSettings,
                      selectedLanguage: value
                    })
                  }
                >
                  <SelectTrigger className="bg-background/80 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Label className="text-xs text-foreground">Processing Mode</Label>
              <Select
                value={modelSettings.visionMode}
                onValueChange={value =>
                  setModelSettings({ ...modelSettings, visionMode: value })
                }
              >
                <SelectTrigger className="bg-background/80 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">
                    Fast (Optimized for speed)
                  </SelectItem>
                  <SelectItem value="slow">
                    Slow (Optimized for accuracy)
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                {modelSettings.visionMode === 'fast'
                  ? 'Faster processing with good accuracy for most documents'
                  : 'Slower processing with maximum accuracy for complex layouts'}
              </p>
            </div>
          </div>
        )

      case 'vlm':
        return (
          <div className="space-y-3">
            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Label className="text-xs text-foreground">Custom Prompt</Label>
              <Textarea
                value={modelSettings.vlmPrompt}
                onChange={e =>
                  setModelSettings({
                    ...modelSettings,
                    vlmPrompt: e.target.value
                  })
                }
                placeholder="Describe how you want the text to be extracted..."
                className="bg-background/80 border-border min-h-[60px] resize-none text-xs"
              />
              <p className="text-xs text-muted-foreground">
                Customize the prompt to control how the VLM extracts and formats
                text
              </p>
            </div>

            <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
              <Label className="text-xs text-foreground">Output Format</Label>
              <Select
                value={modelSettings.vlmOutputFormat}
                onValueChange={value =>
                  setModelSettings({ ...modelSettings, vlmOutputFormat: value })
                }
              >
                <SelectTrigger className="bg-background/80 border-border">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="plain">Plain text</SelectItem>
                  <SelectItem value="markdown">Markdown</SelectItem>
                  <SelectItem value="json">JSON structure</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 'cloud':
        return (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/60">
              <div className="flex items-center space-x-2 mb-2">
                <Key className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span className="text-xs font-medium text-blue-800 dark:text-blue-200">
                  API Configuration Required
                </span>
              </div>
              <p className="text-xs text-blue-700 dark:text-blue-300">
                This cloud model requires API credentials to function. Your data
                will be sent to the cloud provider for processing.
              </p>
            </div>
            {renderCloudSettings()}
          </div>
        )

      default:
        return (
          <div className="space-y-2 p-3 rounded-lg bg-muted/30 border border-border">
            <Label className="text-xs text-foreground">
              Language Detection
            </Label>
            <Select
              value={modelSettings.autoDetectLanguage ? 'auto' : 'manual'}
              onValueChange={value =>
                setModelSettings({
                  ...modelSettings,
                  autoDetectLanguage: value === 'auto'
                })
              }
            >
              <SelectTrigger className="bg-background/80 border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto-detect language</SelectItem>
                <SelectItem value="manual">Select language manually</SelectItem>
              </SelectContent>
            </Select>

            {!modelSettings.autoDetectLanguage && (
              <div className="mt-2">
                <Select
                  value={modelSettings.selectedLanguage}
                  onValueChange={value =>
                    setModelSettings({
                      ...modelSettings,
                      selectedLanguage: value
                    })
                  }
                >
                  <SelectTrigger className="bg-background/80 border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="german">German</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="text-lg text-foreground">Models</h1>
        <p className="text-xs text-muted-foreground">
          Manage OCR models and configure recognition settings.
        </p>
      </div>

      {/* Active Model */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg flex items-center justify-center">
            <Brain className="h-3.5 w-3.5 text-white" />
          </div>
          <div>
            <h3 className="text-sm text-foreground">Active Model Settings</h3>
            <p className="text-xs text-muted-foreground">
              Configure settings for the currently selected OCR model
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {selectedModelData && (
            <div className="p-3 rounded-lg bg-muted/30 border border-border">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(
                    selectedModelData.status,
                    selectedModelData.isCloud
                  )}
                  <span className="text-xs font-medium text-foreground">
                    {selectedModelData.name}
                  </span>
                  {selectedModelData.isCloud && (
                    <Cloud className="h-3 w-3 text-blue-500" />
                  )}
                </div>
                <Badge className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs px-2 py-0.5">
                  Active
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {selectedModelData.description}
              </p>
            </div>
          )}

          {renderModelSettings()}
        </div>
      </div>

      {/* Available Models */}
      <div className="bg-card/60 backdrop-blur-sm rounded-xl p-3 border border-border shadow-sm">
        <div className="mb-3">
          <h3 className="text-sm text-foreground mb-1">Available Models</h3>
          <p className="text-xs text-muted-foreground">
            Download and manage OCR models for different use cases
          </p>
        </div>

        <div className="bg-background/80 rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-xs text-muted-foreground w-[40%] min-w-0">
                  Model
                </TableHead>
                <TableHead className="text-xs text-muted-foreground w-[12%]">
                  Size
                </TableHead>
                <TableHead className="text-xs text-muted-foreground w-[12%]">
                  Acc
                </TableHead>
                <TableHead className="text-xs text-muted-foreground w-[36%]">
                  Status & Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {modelList.map(model => (
                <TableRow
                  key={model.id}
                  className="hover:bg-muted/30 transition-colors"
                >
                  <TableCell className="py-2 pr-2 w-[40%] min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center min-w-0">
                        {getStatusIcon(model.status, model.isCloud)}
                        <span className="ml-2 text-xs font-medium text-foreground truncate">
                          {model.name}
                        </span>
                        {model.isCloud && (
                          <Cloud className="ml-1 h-2.5 w-2.5 text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 truncate">
                        {model.description}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="py-2 text-xs text-foreground w-[12%]">
                    {model.size}
                  </TableCell>
                  <TableCell className="py-2 w-[12%]">
                    <span className="text-xs font-medium text-foreground">
                      {model.accuracy}%
                    </span>
                  </TableCell>
                  <TableCell className="py-2 w-[36%]">
                    <div className="flex items-center space-x-2">
                      <div className="flex-1 min-w-0">
                        {getStatusBadge(model.status)}
                        {model.status === 'downloading' &&
                          model.downloadProgress !== undefined && (
                            <div className="mt-1">
                              <Progress
                                value={model.downloadProgress}
                                className="h-1.5 bg-muted"
                              />
                              <p className="text-xs text-muted-foreground mt-0.5">
                                {Math.round(model.downloadProgress)}%
                              </p>
                            </div>
                          )}
                      </div>
                      <div className="flex-shrink-0">
                        {model.status === 'available' && !model.isCloud && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-border hover:bg-accent text-foreground text-xs h-6 px-2"
                            onClick={() => handleDownload(model.id)}
                          >
                            Download
                          </Button>
                        )}
                        {((model.status === 'installed' && !model.isCloud) ||
                          model.isCloud) &&
                          model.id !== selectedModel && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="border-border hover:bg-accent text-foreground text-xs h-6 px-2"
                              onClick={() => setSelectedModel(model.id)}
                            >
                              Use
                            </Button>
                          )}
                        {model.id === selectedModel && (
                          <Badge className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white text-xs px-2 py-0.5">
                            Active
                          </Badge>
                        )}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
