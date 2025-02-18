import { Button } from "@/components/ui/button"
import { LayoutDashboard, BarChart2, MessageSquare, Lightbulb } from "lucide-react"
import { useNavigate, useLocation } from "react-router-dom"

const sidebarItems = [
  {
    title: "Dashboard Summary",
    icon: LayoutDashboard,
    href: "/",
  },
  {
    title: "Feedback Sources",
    icon: MessageSquare,
    href: "/feedback-sources",
  },
  {
    title: "Category Analysis",
    icon: BarChart2,
    href: "/category-analysis",
  },

  {
    title: "Insights",
    icon: Lightbulb,
    href: "/insights",
  },
]

export function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="pb-12 min-h-screen border-r w-[20%]"> 
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">
            Voice of Customer
          </h2>
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                onClick={() => navigate(item.href)}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.title}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}