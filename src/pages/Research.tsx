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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search as SearchIcon,
  Plus,
  BookOpen,
  Link2,
  FileText,
  Download,
  ExternalLink,
  Star,
  StarOff,
  Bookmark,
  TrendingUp,
} from "lucide-react";

interface ResearchItem {
  id: string;
  title: string;
  source: string;
  url: string;
  type: "article" | "report" | "video" | "podcast" | "study";
  summary: string;
  tags: string[];
  dateAdded: Date;
  isFavorite: boolean;
  relevanceScore: number;
}

export default function Research() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAdding, setIsAdding] = useState(false);

  const [researchItems] = useState<ResearchItem[]>([
    {
      id: "1",
      title: "The State of AI in Healthcare 2025",
      source: "Healthcare Technology Review",
      url: "https://example.com/ai-healthcare",
      type: "report",
      summary: "Comprehensive analysis of AI adoption in healthcare showing 45% increase in implementation across hospitals and clinics.",
      tags: ["AI", "Healthcare", "Technology"],
      dateAdded: new Date(2025, 10, 20),
      isFavorite: true,
      relevanceScore: 95,
    },
    {
      id: "2",
      title: "Content Marketing Trends Q4 2025",
      source: "Marketing Insights",
      url: "https://example.com/marketing-trends",
      type: "article",
      summary: "Latest trends show shift towards video content and AI-powered personalization in marketing strategies.",
      tags: ["Marketing", "Trends", "Content"],
      dateAdded: new Date(2025, 10, 18),
      isFavorite: true,
      relevanceScore: 88,
    },
    {
      id: "3",
      title: "Case Study: Successful B2B Content Strategy",
      source: "B2B Marketing Journal",
      url: "https://example.com/b2b-case-study",
      type: "study",
      summary: "How a SaaS company increased leads by 200% through strategic content marketing and thought leadership.",
      tags: ["B2B", "Case Study", "Strategy"],
      dateAdded: new Date(2025, 10, 15),
      isFavorite: false,
      relevanceScore: 82,
    },
    {
      id: "4",
      title: "SEO Best Practices for 2025",
      source: "Search Engine Optimization Hub",
      url: "https://example.com/seo-2025",
      type: "article",
      summary: "Updated SEO strategies focusing on E-E-A-T, core web vitals, and AI-generated content detection.",
      tags: ["SEO", "Best Practices", "2025"],
      dateAdded: new Date(2025, 10, 12),
      isFavorite: false,
      relevanceScore: 76,
    },
    {
      id: "5",
      title: "Remote Team Collaboration Tools",
      source: "Productivity Podcast",
      url: "https://example.com/remote-tools",
      type: "podcast",
      summary: "Discussion on latest tools and techniques for effective remote team collaboration and content creation.",
      tags: ["Remote Work", "Tools", "Collaboration"],
      dateAdded: new Date(2025, 10, 10),
      isFavorite: false,
      relevanceScore: 71,
    },
  ]);

  const filteredResearch = researchItems.filter(
    (item) =>
      (filterType === "all" || item.type === filterType) &&
      (searchQuery === "" ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))
  );

  const getTypeIcon = (type: ResearchItem["type"]) => {
    switch (type) {
      case "article":
        return <FileText className="h-4 w-4" />;
      case "report":
        return <BookOpen className="h-4 w-4" />;
      case "study":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getRelevanceColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-info";
    if (score >= 60) return "text-warning";
    return "text-muted-foreground";
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Research</h1>
          <p className="text-muted-foreground">
            Collect, organize, and reference research materials for your content
          </p>
        </div>
        <Dialog open={isAdding} onOpenChange={setIsAdding}>
          <DialogTrigger asChild>
            <Button className="gap-2 hover-scale">
              <Plus className="h-4 w-4" />
              Add Research
            </Button>
          </DialogTrigger>
          <DialogContent className="animate-scale-in sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Research Item</DialogTitle>
              <DialogDescription>
                Save articles, reports, and resources for reference
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input placeholder="Research article or report title" />
              </div>
              <div className="space-y-2">
                <Label>URL</Label>
                <Input placeholder="https://..." type="url" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="report">Report</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="podcast">Podcast</SelectItem>
                    <SelectItem value="study">Study</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Summary</Label>
                <Textarea
                  placeholder="Brief summary of key points..."
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Tags (comma separated)</Label>
                <Input placeholder="e.g., ai, healthcare, trends" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAdding(false)}>
                Cancel
              </Button>
              <Button onClick={() => setIsAdding(false)}>
                Add to Research
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search research..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="article">Articles</SelectItem>
            <SelectItem value="report">Reports</SelectItem>
            <SelectItem value="video">Videos</SelectItem>
            <SelectItem value="podcast">Podcasts</SelectItem>
            <SelectItem value="study">Studies</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Research Items */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredResearch.map((item, index) => (
          <Card
            key={item.id}
            className="p-6 hover:shadow-lg transition-all hover-scale animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  {getTypeIcon(item.type)}
                </div>
                <div>
                  <Badge variant="outline" className="text-xs mb-1">
                    {item.type}
                  </Badge>
                  <div className={`text-xs font-medium ${getRelevanceColor(item.relevanceScore)}`}>
                    {item.relevanceScore}% relevant
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                {item.isFavorite ? (
                  <Star className="h-4 w-4 text-warning fill-warning" />
                ) : (
                  <StarOff className="h-4 w-4" />
                )}
              </Button>
            </div>

            <h3 className="font-semibold mb-2 line-clamp-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground mb-3">{item.source}</p>
            <p className="text-sm mb-4 line-clamp-3">{item.summary}</p>

            <div className="flex flex-wrap gap-1 mb-4">
              {item.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="flex-1 gap-2 hover-scale" asChild>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-3 w-3" />
                  Open Source
                </a>
              </Button>
              <Button variant="outline" size="sm" className="gap-2 hover-scale">
                <Bookmark className="h-3 w-3" />
                Cite
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
