import { Github, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0 bg-background/50">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          Built with{" "}
          <Heart className="inline-block h-4 w-4 text-red-500 animate-pulse" />{" "}
          using React and Tailwind CSS.
        </p>
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="sm"
            className="h-8 rounded-full px-3"
            onClick={() => window.open("https://github.com/Kenny1338/TransLexify", "_blank")}
          >
            <Github className="mr-2 h-4 w-4" />
            <span>GitHub</span>
          </Button>
        </div>
      </div>
    </footer>
  );
}
