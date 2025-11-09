import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Book,
  Plus,
  Search,
  Star,
  StarOff,
  MoreVertical,
  Copy,
  Edit,
  Trash2,
  Play,
  CheckCircle2,
  Clock,
} from "lucide-react";

interface Playbook {
  id: string;
  title: string;
  description: string;
  category: string;
  steps: number;
  completedUses: number;
  avgTime: string;
  isFavorite: boolean;
  tags: string[];
}

export default function Playbooks() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const [playbooks] = useState<Playbook[]>([
    {
      id: "1",
      title: "Blog Post Launch Workflow",
      description: "Complete workflow from ideation to publication with SEO optimization and distribution steps",
      category: "Content Creation",
      steps: 8,
      completedUses: 42,
      avgTime: "2-3 hours",
      isFavorite: true,
      tags: ["Blog", "SEO", "Distribution"],
    },
    {
      id: "2",
      title: "Social Media Campaign",
      description: "Multi-platform social campaign with content calendar, asset creation, and performance tracking",
      category: "Marketing",
      steps: 12,
      completedUses: 28,
      avgTime: "4-5 hours",
      isFavorite: true,
      tags: ["Social", "Campaign", "Multi-channel"],
    },
    {
      id: "3",
      title: "Case Study Production",
      description: "Customer interview to published case study with quotes, data points, and testimonials",
      category: "Content Creation",
      steps: 10,
      completedUses: 15,
      avgTime: "5-6 hours",
      isFavorite: false,
      tags: ["Case Study", "Interview", "B2B"],
    },
    {
      id: "4",
      title: "Product Launch Content",
      description: "Comprehensive content package for product launches including announcements, FAQs, and guides",
      category: "Product",
      steps: 15,
      completedUses: 8,
      avgTime: "8-10 hours",
      isFavorite: false,
      tags: ["Product", "Launch", "Multi-format"],
    },
    {
      id: "5",
      title: "Weekly Newsletter",
      description: "Curated newsletter with topic selection, content summary, and email optimization",
      category: "Email",
      steps: 6,
      completedUses: 56,
      avgTime: "1-2 hours",
      isFavorite: true,
      tags: ["Newsletter", "Email", "Curation"],
    },
  ]);

  const filteredPlaybooks = playbooks.filter(
    (playbook) =>
      searchQuery === "" ||
      playbook.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playbook.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      playbook.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Playbooks</h1>
          <p className="text-muted-foreground">
            Repeatable workflows and templates for consistent content creation
          </p>
        </div>
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
          <DialogTrigger asChild>
            <Button className="gap-2 hover-scale">
              <Plus className="h-4 w-4" />
              Create Playbook
            </Button>
          </DialogTrigger>
          <DialogContent className="animate-scale-in sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Create New Playbook</DialogTitle>
              <DialogDescription>
                Build a reusable workflow template for your content process
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Playbook Name</Label>
                <Input placeholder="e.g., Monthly Report Creation" />
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  placeholder="Describe the workflow and its purpose..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input placeholder="e.g., Content Creation, Marketing" />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input placeholder="e.g., blog, seo, weekly" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsCreating(false)}>
                Create & Add Steps
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search playbooks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Favorites */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Star className="h-5 w-5 text-warning fill-warning" />
          Favorites
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaybooks
            .filter((p) => p.isFavorite)
            .map((playbook, index) => (
              <Card
                key={playbook.id}
                className="p-6 hover:shadow-lg transition-all hover-scale cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <Book className="h-5 w-5 text-primary" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Start Workflow
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <StarOff className="mr-2 h-4 w-4" />
                        Remove from Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <h3 className="font-semibold mb-2">{playbook.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {playbook.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Steps</span>
                    <Badge variant="secondary">{playbook.steps}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Used</span>
                    <span className="font-medium">{playbook.completedUses}x</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Avg. Time</span>
                    <span className="font-medium">{playbook.avgTime}</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {playbook.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button className="w-full gap-2 hover-scale">
                  <Play className="h-4 w-4" />
                  Start Playbook
                </Button>
              </Card>
            ))}
        </div>
      </div>

      {/* All Playbooks */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">All Playbooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPlaybooks
            .filter((p) => !p.isFavorite)
            .map((playbook, index) => (
              <Card
                key={playbook.id}
                className="p-6 hover:shadow-lg transition-all hover-scale cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                    <Book className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Play className="mr-2 h-4 w-4" />
                        Start Workflow
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Star className="mr-2 h-4 w-4" />
                        Add to Favorites
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <Badge variant="outline" className="mb-3">
                  {playbook.category}
                </Badge>

                <h3 className="font-semibold mb-2">{playbook.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                  {playbook.description}
                </p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      {playbook.steps} steps
                    </span>
                    <span className="text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {playbook.avgTime}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {playbook.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <Button variant="outline" className="w-full gap-2 hover-scale">
                  <Play className="h-4 w-4" />
                  Start Playbook
                </Button>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
}
