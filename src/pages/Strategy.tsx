import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
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
import { Label } from "@/components/ui/label";
import {
  Calendar as CalendarIcon,
  Plus,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  Clock,
  CheckCircle2,
  Circle,
  AlertCircle,
  Megaphone,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContentItem {
  id: string;
  title: string;
  type: string;
  status: "ideation" | "draft" | "review" | "scheduled" | "published";
  date?: Date;
  campaign?: string;
}

interface Campaign {
  id: string;
  name: string;
  goal: string;
  audience: string;
  startDate: Date;
  endDate: Date;
  status: "planning" | "active" | "completed";
  contentCount: number;
}

interface Audience {
  id: string;
  name: string;
  demographics: string;
  interests: string[];
  size: string;
}

export default function Strategy() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get("view") || "calendar";
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [isAddingAudience, setIsAddingAudience] = useState(false);

  const setActiveView = (view: string) => {
    navigate(`/strategy?view=${view}`, { replace: true });
  };

  // Mock data
  const [contentItems] = useState<ContentItem[]>([
    {
      id: "1",
      title: "AI in Healthcare Blog Post",
      type: "Blog",
      status: "scheduled",
      date: new Date(2025, 10, 15),
      campaign: "Healthcare Series",
    },
    {
      id: "2",
      title: "Product Launch Announcement",
      type: "Social",
      status: "review",
      campaign: "Q4 Launch",
    },
    {
      id: "3",
      title: "Customer Success Story",
      type: "Case Study",
      status: "draft",
    },
    {
      id: "4",
      title: "Industry Trends Report",
      type: "Report",
      status: "ideation",
    },
  ]);

  const [campaigns] = useState<Campaign[]>([
    {
      id: "1",
      name: "Healthcare Series",
      goal: "Establish thought leadership in healthcare AI",
      audience: "Healthcare Professionals",
      startDate: new Date(2025, 10, 1),
      endDate: new Date(2025, 11, 31),
      status: "active",
      contentCount: 12,
    },
    {
      id: "2",
      name: "Q4 Launch",
      goal: "Generate awareness for new product",
      audience: "Tech Decision Makers",
      startDate: new Date(2025, 9, 15),
      endDate: new Date(2025, 10, 30),
      status: "active",
      contentCount: 8,
    },
  ]);

  const [audiences] = useState<Audience[]>([
    {
      id: "1",
      name: "Healthcare Professionals",
      demographics: "Ages 30-55, Healthcare Industry",
      interests: ["Medical Technology", "AI", "Healthcare Innovation"],
      size: "50K-100K",
    },
    {
      id: "2",
      name: "Tech Decision Makers",
      demographics: "Ages 35-60, C-Level & Directors",
      interests: ["Technology", "Innovation", "Business Strategy"],
      size: "100K-250K",
    },
  ]);

  const getStatusIcon = (status: ContentItem["status"]) => {
    switch (status) {
      case "ideation":
        return <Circle className="h-4 w-4 text-muted-foreground" />;
      case "draft":
        return <Clock className="h-4 w-4 text-warning" />;
      case "review":
        return <AlertCircle className="h-4 w-4 text-info" />;
      case "scheduled":
        return <CalendarIcon className="h-4 w-4 text-primary" />;
      case "published":
        return <CheckCircle2 className="h-4 w-4 text-success" />;
    }
  };

  const getStatusBadge = (status: ContentItem["status"]) => {
    const variants: Record<ContentItem["status"], any> = {
      ideation: "secondary",
      draft: "warning",
      review: "info",
      scheduled: "default",
      published: "success",
    };
    return (
      <Badge variant={variants[status]} className="gap-1">
        {getStatusIcon(status)}
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const navItems = [
    { id: "calendar", label: "Calendar", icon: CalendarIcon },
    { id: "campaigns", label: "Campaigns", icon: Megaphone },
    { id: "pipeline", label: "Pipeline", icon: TrendingUp },
    { id: "audience", label: "Audience", icon: Target },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Strategy</h1>
          <p className="text-muted-foreground">
            Plan campaigns, manage your content pipeline, and target your audience
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2 hover-scale">
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          <Button className="gap-2 hover-scale">
            <Plus className="h-4 w-4" />
            New Campaign
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveView(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-3 text-sm font-medium transition-all",
              "hover:bg-accent hover:text-accent-foreground",
              "border-b-2 -mb-px",
              activeView === item.id
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </div>

      {/* Calendar View */}
      {activeView === "calendar" && (
        <div className="space-y-4 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 p-6 hover:shadow-lg transition-shadow">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && setSelectedDate(date)}
                className={cn("rounded-md border-0 pointer-events-auto")}
              />
            </Card>

            <div className="space-y-4">
              <Card className="p-4 hover:shadow-lg transition-shadow">
                <h3 className="font-semibold mb-3">
                  {format(selectedDate, "MMMM d, yyyy")}
                </h3>
                <div className="space-y-2">
                  {contentItems
                    .filter(
                      (item) =>
                        item.date &&
                        format(item.date, "yyyy-MM-dd") ===
                          format(selectedDate, "yyyy-MM-dd")
                    )
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer animate-scale-in"
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="font-medium text-sm">{item.title}</p>
                          {getStatusBadge(item.status)}
                        </div>
                        <p className="text-xs text-muted-foreground">{item.type}</p>
                        {item.campaign && (
                          <Badge variant="outline" className="mt-2">
                            {item.campaign}
                          </Badge>
                        )}
                      </div>
                    ))}
                  {contentItems.filter(
                    (item) =>
                      item.date &&
                      format(item.date, "yyyy-MM-dd") ===
                        format(selectedDate, "yyyy-MM-dd")
                  ).length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No content scheduled for this date
                    </p>
                  )}
                </div>
                <Button variant="outline" className="w-full mt-4 gap-2 hover-scale">
                  <Plus className="h-4 w-4" />
                  Schedule Content
                </Button>
              </Card>
            </div>
          </div>
        </div>
      )}

      {/* Campaigns View */}
      {activeView === "campaigns" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Campaigns</h2>
              <p className="text-sm text-muted-foreground">
                Manage your content campaigns
              </p>
            </div>
            <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
              <DialogTrigger asChild>
                <Button className="gap-2 hover-scale">
                  <Plus className="h-4 w-4" />
                  New Campaign
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Create New Campaign</DialogTitle>
                  <DialogDescription>
                    Set up a new content campaign with goals and timeline
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Campaign Name</Label>
                    <Input placeholder="e.g., Q1 Product Launch" />
                  </div>
                  <div className="space-y-2">
                    <Label>Goal</Label>
                    <Textarea
                      placeholder="What do you want to achieve with this campaign?"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Start Date</Label>
                      <Input type="date" />
                    </div>
                    <div className="space-y-2">
                      <Label>End Date</Label>
                      <Input type="date" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Target Audience</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        {audiences.map((aud) => (
                          <SelectItem key={aud.id} value={aud.id}>
                            {aud.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingCampaign(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddingCampaign(false)}>
                    Create Campaign
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6 hover:shadow-lg transition-all hover-scale cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Megaphone className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{campaign.name}</h3>
                      <Badge
                        variant={
                          campaign.status === "active"
                            ? "success"
                            : campaign.status === "planning"
                            ? "warning"
                            : "secondary"
                        }
                      >
                        {campaign.status}
                      </Badge>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-muted-foreground mb-4">
                  {campaign.goal}
                </p>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Audience:</span>
                    <span className="font-medium">{campaign.audience}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Duration:</span>
                    <span className="font-medium">
                      {format(campaign.startDate, "MMM d")} -{" "}
                      {format(campaign.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <BarChart3 className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Content:</span>
                    <span className="font-medium">{campaign.contentCount} pieces</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 hover-scale">
                    View Details
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 hover-scale">
                    Add Content
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {activeView === "pipeline" && (
        <div className="space-y-4 animate-fade-in">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Content Pipeline</h2>
            <p className="text-sm text-muted-foreground">
              Track content through production stages
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { status: "ideation", label: "Ideation", count: 1 },
              { status: "draft", label: "In Draft", count: 1 },
              { status: "review", label: "In Review", count: 1 },
              { status: "scheduled", label: "Scheduled", count: 1 },
              { status: "published", label: "Published", count: 0 },
            ].map((stage) => (
              <Card key={stage.status} className="p-4 hover:shadow-lg transition-shadow animate-scale-in">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(stage.status as ContentItem["status"])}
                    <h3 className="font-semibold text-sm">{stage.label}</h3>
                  </div>
                  <Badge variant="secondary">{stage.count}</Badge>
                </div>

                <div className="space-y-2">
                  {contentItems
                    .filter((item) => item.status === stage.status)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-lg border border-border hover:border-primary hover:shadow-md transition-all cursor-pointer"
                      >
                        <p className="font-medium text-sm mb-1">{item.title}</p>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {item.type}
                          </Badge>
                          {item.campaign && (
                            <Badge variant="secondary" className="text-xs">
                              {item.campaign}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>

                <Button variant="ghost" size="sm" className="w-full mt-3 gap-1 hover-scale">
                  <Plus className="h-3 w-3" />
                  Add Content
                </Button>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Audience View */}
      {activeView === "audience" && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold">Target Audiences</h2>
              <p className="text-sm text-muted-foreground">
                Define and manage your audience segments
              </p>
            </div>
            <Dialog open={isAddingAudience} onOpenChange={setIsAddingAudience}>
              <DialogTrigger asChild>
                <Button className="gap-2 hover-scale">
                  <Plus className="h-4 w-4" />
                  New Audience
                </Button>
              </DialogTrigger>
              <DialogContent className="animate-scale-in">
                <DialogHeader>
                  <DialogTitle>Create Audience Segment</DialogTitle>
                  <DialogDescription>
                    Define a new target audience for your content
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Audience Name</Label>
                    <Input placeholder="e.g., Enterprise Decision Makers" />
                  </div>
                  <div className="space-y-2">
                    <Label>Demographics</Label>
                    <Textarea
                      placeholder="Describe age, location, job roles..."
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Interests & Behaviors</Label>
                    <Textarea
                      placeholder="What are their interests and pain points?"
                      rows={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Estimated Size</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select size range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">0-10K</SelectItem>
                        <SelectItem value="2">10K-50K</SelectItem>
                        <SelectItem value="3">50K-100K</SelectItem>
                        <SelectItem value="4">100K-250K</SelectItem>
                        <SelectItem value="5">250K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddingAudience(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => setIsAddingAudience(false)}>
                    Create Audience
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {audiences.map((audience) => (
              <Card key={audience.id} className="p-6 hover:shadow-lg transition-all hover-scale cursor-pointer">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Target className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{audience.name}</h3>
                      <p className="text-sm text-muted-foreground">{audience.size}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">
                      Demographics
                    </p>
                    <p className="text-sm">{audience.demographics}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-2">
                      Interests
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {audience.interests.map((interest) => (
                        <Badge key={interest} variant="secondary" className="text-xs">
                          {interest}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1 hover-scale">
                    Edit Segment
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 hover-scale">
                    View Content
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
