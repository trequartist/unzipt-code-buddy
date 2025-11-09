import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Search,
  Grid3x3,
  List,
  Filter,
  FolderPlus,
  FileText,
  MoreVertical,
  Tag,
  Trash2,
  Archive,
  Download,
  Copy,
  Edit,
  Clock,
  Calendar,
  Eye,
  Folder,
  Star,
  StarOff,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  type: "blog" | "social" | "case-study" | "report" | "email";
  status: "draft" | "published" | "archived";
  folder: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
  views: number;
  isFavorite: boolean;
  thumbnail?: string;
}

interface Folder {
  id: string;
  name: string;
  count: number;
  color: string;
}

export default function Hub() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterFolder, setFilterFolder] = useState<string>("all");
  const [isAddingFolder, setIsAddingFolder] = useState(false);
  const [isAddingTags, setIsAddingTags] = useState(false);

  // Mock data
  const [contentItems] = useState<ContentItem[]>([
    {
      id: "1",
      title: "AI in Healthcare: The Future is Here",
      type: "blog",
      status: "published",
      folder: "Healthcare Series",
      tags: ["AI", "Healthcare", "Technology"],
      createdAt: new Date(2025, 10, 15),
      updatedAt: new Date(2025, 10, 16),
      wordCount: 2400,
      views: 18500,
      isFavorite: true,
    },
    {
      id: "2",
      title: "Customer Success Story: Acme Corp",
      type: "case-study",
      status: "published",
      folder: "Case Studies",
      tags: ["Customer Success", "B2B"],
      createdAt: new Date(2025, 10, 10),
      updatedAt: new Date(2025, 10, 12),
      wordCount: 1800,
      views: 12300,
      isFavorite: false,
    },
    {
      id: "3",
      title: "Product Launch Announcement",
      type: "social",
      status: "draft",
      folder: "Social Media",
      tags: ["Product", "Launch", "Marketing"],
      createdAt: new Date(2025, 10, 20),
      updatedAt: new Date(2025, 10, 22),
      wordCount: 280,
      views: 0,
      isFavorite: false,
    },
    {
      id: "4",
      title: "Q4 Industry Trends Report",
      type: "report",
      status: "published",
      folder: "Reports",
      tags: ["Industry", "Trends", "Analytics"],
      createdAt: new Date(2025, 9, 25),
      updatedAt: new Date(2025, 9, 28),
      wordCount: 5200,
      views: 15600,
      isFavorite: true,
    },
    {
      id: "5",
      title: "Weekly Newsletter - Nov Edition",
      type: "email",
      status: "archived",
      folder: "Newsletters",
      tags: ["Newsletter", "Email"],
      createdAt: new Date(2025, 10, 1),
      updatedAt: new Date(2025, 10, 2),
      wordCount: 1200,
      views: 8900,
      isFavorite: false,
    },
    {
      id: "6",
      title: "How to Optimize Your Workflow",
      type: "blog",
      status: "draft",
      folder: "Tutorials",
      tags: ["Tutorial", "Productivity", "Tips"],
      createdAt: new Date(2025, 10, 18),
      updatedAt: new Date(2025, 10, 25),
      wordCount: 1600,
      views: 0,
      isFavorite: false,
    },
  ]);

  const [folders] = useState<Folder[]>([
    { id: "1", name: "Healthcare Series", count: 4, color: "hsl(var(--primary))" },
    { id: "2", name: "Case Studies", count: 3, color: "hsl(var(--success))" },
    { id: "3", name: "Social Media", count: 12, color: "hsl(var(--info))" },
    { id: "4", name: "Reports", count: 2, color: "hsl(var(--warning))" },
    { id: "5", name: "Newsletters", count: 8, color: "hsl(var(--secondary))" },
    { id: "6", name: "Tutorials", count: 6, color: "hsl(var(--accent))" },
  ]);

  const allTags = Array.from(
    new Set(contentItems.flatMap((item) => item.tags))
  ).sort();

  // Filter content
  const filteredContent = contentItems.filter((item) => {
    const matchesSearch =
      searchQuery === "" ||
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesType = filterType === "all" || item.type === filterType;
    const matchesStatus = filterStatus === "all" || item.status === filterStatus;
    const matchesFolder = filterFolder === "all" || item.folder === filterFolder;

    return matchesSearch && matchesType && matchesStatus && matchesFolder;
  });

  const handleSelectAll = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map((item) => item.id));
    }
  };

  const handleSelectItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on items:`, selectedItems);
    // Implement bulk actions here
    setSelectedItems([]);
  };

  const getTypeIcon = (type: ContentItem["type"]) => {
    return <FileText className="h-4 w-4" />;
  };

  const getStatusBadge = (status: ContentItem["status"]) => {
    const variants: Record<ContentItem["status"], any> = {
      draft: "secondary",
      published: "success",
      archived: "outline",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Content Hub</h1>
          <p className="text-muted-foreground">
            Manage, organize, and search your content library
          </p>
        </div>
        <Button className="gap-2 hover-scale">
          <FileText className="h-4 w-4" />
          New Content
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search content..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="social">Social</SelectItem>
              <SelectItem value="case-study">Case Study</SelectItem>
              <SelectItem value="report">Report</SelectItem>
              <SelectItem value="email">Email</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterFolder} onValueChange={setFilterFolder}>
            <SelectTrigger className="w-[160px]">
              <SelectValue placeholder="Folder" />
            </SelectTrigger>
            <SelectContent className="bg-card z-50">
              <SelectItem value="all">All Folders</SelectItem>
              {folders.map((folder) => (
                <SelectItem key={folder.id} value={folder.name}>
                  {folder.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex gap-1 border border-border rounded-md">
            <Button
              variant={viewMode === "grid" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "ghost"}
              size="icon"
              onClick={() => setViewMode("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Folders */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Folders</h2>
          <Dialog open={isAddingFolder} onOpenChange={setIsAddingFolder}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <FolderPlus className="h-4 w-4" />
                New Folder
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Folder</DialogTitle>
                <DialogDescription>
                  Organize your content by creating folders
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Folder Name</Label>
                  <Input placeholder="e.g., Product Updates" />
                </div>
                <div className="space-y-2">
                  <Label>Description (Optional)</Label>
                  <Textarea placeholder="Describe what this folder contains..." rows={3} />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingFolder(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setIsAddingFolder(false)}>Create Folder</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {folders.map((folder, index) => (
            <Card
              key={folder.id}
              className="p-4 cursor-pointer hover:shadow-md transition-all hover-scale animate-scale-in"
              style={{ animationDelay: `${index * 30}ms` }}
              onClick={() => setFilterFolder(folder.name)}
            >
              <div className="flex items-center gap-3">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-lg shrink-0"
                  style={{ backgroundColor: `${folder.color}20` }}
                >
                  <Folder className="h-5 w-5" style={{ color: folder.color }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm truncate">{folder.name}</p>
                  <p className="text-xs text-muted-foreground">{folder.count} items</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedItems.length > 0 && (
        <Card className="p-4 border-primary/50 bg-primary/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <p className="font-medium">
                {selectedItems.length} item{selectedItems.length > 1 ? "s" : ""} selected
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedItems([])}
              >
                Clear
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleBulkAction("move")}
              >
                <Folder className="h-4 w-4" />
                Move
              </Button>
              <Dialog open={isAddingTags} onOpenChange={setIsAddingTags}>
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2">
                    <Tag className="h-4 w-4" />
                    Add Tags
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add Tags to Selected Items</DialogTitle>
                    <DialogDescription>
                      Apply tags to {selectedItems.length} selected item
                      {selectedItems.length > 1 ? "s" : ""}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Tags</Label>
                      <div className="flex flex-wrap gap-2 p-4 border border-border rounded-md max-h-[200px] overflow-y-auto">
                        {allTags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="cursor-pointer hover:bg-primary hover:text-primary-foreground"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Or Add New Tag</Label>
                      <Input placeholder="Type and press Enter" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingTags(false)}>
                      Cancel
                    </Button>
                    <Button onClick={() => setIsAddingTags(false)}>Apply Tags</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleBulkAction("archive")}
              >
                <Archive className="h-4 w-4" />
                Archive
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => handleBulkAction("download")}
              >
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button
                variant="destructive"
                size="sm"
                className="gap-2"
                onClick={() => handleBulkAction("delete")}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Content Grid/List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm text-muted-foreground">
            {filteredContent.length} item{filteredContent.length !== 1 ? "s" : ""}
          </p>
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {selectedItems.length === filteredContent.length ? "Deselect All" : "Select All"}
          </Button>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent.map((item) => (
              <Card
                key={item.id}
                className={cn(
                  "p-4 cursor-pointer hover:shadow-lg transition-all",
                  selectedItems.includes(item.id) && "ring-2 ring-primary"
                )}
              >
                <div className="flex items-start gap-3 mb-3">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => handleSelectItem(item.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(item.type)}
                        <h3 className="font-semibold text-sm truncate">{item.title}</h3>
                      </div>
                      {item.isFavorite && <Star className="h-4 w-4 fill-warning text-warning shrink-0" />}
                    </div>
                    <div className="flex items-center gap-2 mb-3">
                      {getStatusBadge(item.status)}
                      <Badge variant="outline" className="text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="space-y-1 mb-3">
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Folder className="h-3 w-3" />
                        {item.folder}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        Updated {format(item.updatedAt, "MMM d, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {item.views.toLocaleString()} views
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {item.tags.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{item.tags.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-card z-50">
                      <DropdownMenuItem>
                        <Edit className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Copy className="mr-2 h-4 w-4" />
                        Duplicate
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {item.isFavorite ? (
                          <>
                            <StarOff className="mr-2 h-4 w-4" />
                            Remove from Favorites
                          </>
                        ) : (
                          <>
                            <Star className="mr-2 h-4 w-4" />
                            Add to Favorites
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Download className="mr-2 h-4 w-4" />
                        Export
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Archive className="mr-2 h-4 w-4" />
                        Archive
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <div className="divide-y divide-border">
              {filteredContent.map((item) => (
                <div
                  key={item.id}
                  className={cn(
                    "p-4 hover:bg-muted/50 transition-colors cursor-pointer",
                    selectedItems.includes(item.id) && "bg-primary/5"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Checkbox
                      checked={selectedItems.includes(item.id)}
                      onCheckedChange={() => handleSelectItem(item.id)}
                    />
                    {item.isFavorite && (
                      <Star className="h-4 w-4 fill-warning text-warning shrink-0" />
                    )}
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
                      <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-1">
                          {getTypeIcon(item.type)}
                          <h3 className="font-semibold">{item.title}</h3>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusBadge(item.status)}
                        <Badge variant="outline">{item.type}</Badge>
                      </div>
                      <div className="text-sm">
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Folder className="h-3 w-3" />
                          {item.folder}
                        </p>
                        <p className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {format(item.updatedAt, "MMM d, yyyy")}
                        </p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-sm text-muted-foreground">
                          <p>{item.wordCount.toLocaleString()} words</p>
                          <p className="flex items-center gap-1">
                            <Eye className="h-3 w-3" />
                            {item.views.toLocaleString()}
                          </p>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-card z-50">
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              {item.isFavorite ? (
                                <>
                                  <StarOff className="mr-2 h-4 w-4" />
                                  Remove from Favorites
                                </>
                              ) : (
                                <>
                                  <Star className="mr-2 h-4 w-4" />
                                  Add to Favorites
                                </>
                              )}
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Download className="mr-2 h-4 w-4" />
                              Export
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Archive className="mr-2 h-4 w-4" />
                              Archive
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {filteredContent.length === 0 && (
        <div className="flex h-[400px] items-center justify-center rounded-lg border-2 border-dashed border-border">
          <div className="text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No content found</h3>
            <p className="text-sm text-muted-foreground">
              Try adjusting your search or filters
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
