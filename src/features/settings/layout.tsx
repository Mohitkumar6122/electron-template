import { ScrollArea } from '@/components/ui/scroll-area'
import { Brain, Info, Settings } from 'lucide-react'
import { Outlet, useLocation, useNavigate } from 'react-router'

const navigationItems = [
  {
    id: 'general' as const,
    label: 'General',
    icon: Settings
  },
  {
    id: 'models' as const,
    label: 'Models',
    icon: Brain
  },
  {
    id: 'about' as const,
    label: 'About',
    icon: Info
  }
]

export const SettingsLayout = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <div className="relative flex h-screen w-screen bg-card backdrop-blur-xl border border-border rounded-xl overflow-hidden shadow-2xl">
      <div className="absolute top-0 left-0 right-0 h-8 drag" />
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 bg-muted/30 border-r border-border backdrop-blur-sm">
        {/* Header */}
        {/* <div className="px-3 py-3 mt-6 border-b border-border/50">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-sm">
              <Settings className="h-3 w-3 text-white" />
            </div>
            <div>
              <h2 className="text-foreground text-xs">Settings</h2>
              <p className="text-[10px] text-muted-foreground">Text Capture</p>
            </div>
          </div>
        </div> */}

        {/* Navigation */}
        <div className="flex-1 overflow-hidden mt-8">
          <ScrollArea className="h-full">
            <div className="px-2 py-2 space-y-0.5">
              {navigationItems.map(item => {
                const Icon = item.icon
                const isActive = location.pathname.includes(item.id)
                return (
                  <button
                    key={item.id}
                    className={`
                    w-full flex items-center px-2 py-1.5 rounded-lg text-left transition-all duration-200
                    ${
                      isActive
                        ? 'bg-background text-foreground shadow-sm ring-1 ring-border'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                    }
                  `}
                    onClick={() => navigate(`/settings/${item.id}`)}
                  >
                    <Icon
                      className={`mr-2 h-3 w-3 ${
                        isActive ? 'text-primary' : 'text-muted-foreground'
                      }`}
                    />
                    <span className="text-xs">{item.label}</span>
                  </button>
                )
              })}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col bg-background/40 min-w-0">
        <div className="p-4 flex-1 overflow-auto">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
