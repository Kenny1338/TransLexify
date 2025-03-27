
import { Languages, History } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function Header() {
  const location = useLocation();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60 shadow-sm">
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center gap-2.5 transition-colors hover:text-primary">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Languages className="h-5 w-5 text-primary" />
          </div>
          <span className="text-xl font-semibold tracking-tight">TransLexify</span>
        </Link>
        <div className="ml-auto flex items-center gap-6">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            Translate
          </Link>
          <Link
            to="/history"
            className={`flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary ${location.pathname === '/history' ? 'text-primary' : 'text-muted-foreground'}`}
          >
            <History className="h-4 w-4" />
            History
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
