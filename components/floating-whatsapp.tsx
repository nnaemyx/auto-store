import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FloatingWhatsApp() {
  return (
    <a
      href="https://wa.me/2349039756266"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-24 right-4 z-50"
    >
      <Button
        size="icon"
        className="h-12 w-12 rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg"
      >
        <MessageCircle className="h-6 w-6" />
      </Button>
    </a>
  );
} 