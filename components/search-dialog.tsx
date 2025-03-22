"use client";

import type React from "react";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import Link from "next/link";

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const popularSearches = [
  "Car seats",
  "Alternator",
  "Lexus ls360 chrome rims",
  "Benz parts",
];

const popularTags = ["Tires", "Interior", "Exterior", "Engine"];

const SearchDialog = ({ open, onOpenChange }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log("Searching for:", searchQuery);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTitle className="hidden">Search</DialogTitle>
      <DialogContent className="sm:max-w-[600px] p-0">
        <div className="p-4 space-y-6">
          <form onSubmit={handleSearch} className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Auto Store"
              className="pl-10 pr-10 focus:outline-none border-b"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                type="button"
                className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
                onClick={() => setSearchQuery("")}
              >
                <X className="h-4 w-4 " />
              </button>
            )}
          </form>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Popular searches</h3>
            <div className="space-y-2">
              {popularSearches.map((search) => (
                <Link
                  key={search}
                  href={`/search?q=${encodeURIComponent(search)}`}
                  className="block py-2 text-sm hover:text-primary"
                  onClick={() => onOpenChange(false)}
                >
                  {search}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-medium">Popular tags</h3>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Link key={tag} href={`/tag/${tag.toLowerCase()}`}>
                  <Badge
                    variant="secondary"
                    className="px-3 py-1 rounded-full"
                    onClick={() => onOpenChange(false)}
                  >
                    {tag}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SearchDialog;
