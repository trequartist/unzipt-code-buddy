import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  Share2,
  Clock,
  Target,
  Sparkles,
  BarChart3,
  Calendar,
  Download,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCard {
  title: string;
  value: string;
  change: number;
  icon: React.ReactNode;
  trend: "up" | "down";
}

interface ContentPerformance {
  id: string;
  title: string;
  type: string;
  views: number;
  engagement: number;
  conversions: number;
  publishDate: string;
  status: "excellent" | "good" | "average" | "poor";
}

export default function Intelligence() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeView = searchParams.get("view") || "overview";
  const [timePeriod, setTimePeriod] = useState("30d");

  const setActiveView = (view: string) => {
    navigate(`/intelligence?view=${view}`, { replace: true });
  };

  // Mock data
  const metrics: MetricCard[] = [
    {
      title: "Total Views",
      value: "127.5K",
      change: 12.5,
      icon: <Eye className="h-5 w-5" />,
      trend: "up",
    },
    {
      title: "Engagement Rate",
      value: "8.4%",
      change: 2.3,
      icon: <Heart className="h-5 w-5" />,
      trend: "up",
    },
    {
      title: "Avg. Read Time",
      value: "4m 32s",
      change: -5.2,
      icon: <Clock className="h-5 w-5" />,
      trend: "down",
    },
    {
      title: "Conversions",
      value: "1,834",
      change: 18.7,
      icon: <Target className="h-5 w-5" />,
      trend: "up",
    },
  ];

  const engagementData = [
    { date: "Nov 1", views: 4200, engagement: 320, conversions: 45 },
    { date: "Nov 5", views: 5100, engagement: 410, conversions: 62 },
    { date: "Nov 10", views: 6800, engagement: 580, conversions: 78 },
    { date: "Nov 15", views: 5900, engagement: 490, conversions: 71 },
    { date: "Nov 20", views: 7200, engagement: 620, conversions: 89 },
    { date: "Nov 25", views: 8100, engagement: 710, conversions: 102 },
    { date: "Nov 30", views: 9200, engagement: 820, conversions: 118 },
  ];

  const contentTypeData = [
    { name: "Blog Posts", value: 45, color: "hsl(var(--primary))" },
    { name: "Social Media", value: 30, color: "hsl(var(--info))" },
    { name: "Case Studies", value: 15, color: "hsl(var(--success))" },
    { name: "Reports", value: 10, color: "hsl(var(--warning))" },
  ];

  const topPerformers: ContentPerformance[] = [
    {
      id: "1",
      title: "AI in Healthcare: The Future is Here",
      type: "Blog",
      views: 18500,
      engagement: 12.4,
      conversions: 234,
      publishDate: "Nov 15, 2025",
      status: "excellent",
    },
    {
      id: "2",
      title: "Customer Success: Acme Corp Case Study",
      type: "Case Study",
      views: 12300,
      engagement: 18.7,
      conversions: 189,
      publishDate: "Nov 10, 2025",
      status: "excellent",
    },
    {
      id: "3",
      title: "10 Trends Shaping the Industry",
      type: "Report",
      views: 15600,
      engagement: 9.2,
      conversions: 156,
      publishDate: "Nov 20, 2025",
      status: "good",
    },
    {
      id: "4",
      title: "Product Update: New Features Launch",
      type: "Blog",
      views: 8900,
      engagement: 7.8,
      conversions: 98,
      publishDate: "Nov 25, 2025",
      status: "good",
    },
    {
      id: "5",
      title: "How to Optimize Your Workflow",
      type: "Blog",
      views: 6200,
      engagement: 5.4,
      conversions: 45,
      publishDate: "Nov 5, 2025",
      status: "average",
    },
  ];

  const aiInsights = [
    {
      id: "1",
      type: "opportunity",
      title: "Trending Topic Alert",
      description:
        "Healthcare AI content is performing 45% above average. Consider creating more content in this category.",
      action: "Create Content",
    },
    {
      id: "2",
      type: "warning",
      title: "Engagement Drop",
      description:
        "Social media posts show declining engagement over the past week. Try shorter formats or video content.",
      action: "View Details",
    },
    {
      id: "3",
      type: "success",
      title: "High Conversion Content",
      description:
        "Case studies are converting 3x better than other formats. Prioritize more customer success stories.",
      action: "Analyze",
    },
    {
      id: "4",
      type: "info",
      title: "Optimal Posting Time",
      description:
        "Content published between 9-11 AM gets 28% more engagement. Schedule accordingly.",
      action: "Adjust Schedule",
    },
  ];

  const getStatusBadge = (status: ContentPerformance["status"]) => {
    const variants: Record<ContentPerformance["status"], any> = {
      excellent: "success",
      good: "info",
      average: "warning",
      poor: "destructive",
    };
    return <Badge variant={variants[status]}>{status}</Badge>;
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case "opportunity":
        return <TrendingUp className="h-5 w-5 text-success" />;
      case "warning":
        return <TrendingDown className="h-5 w-5 text-warning" />;
      case "success":
        return <Target className="h-5 w-5 text-success" />;
      default:
        return <Sparkles className="h-5 w-5 text-info" />;
    }
  };

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3 },
    { id: "performance", label: "Performance", icon: TrendingUp },
    { id: "insights", label: "AI Insights", icon: Sparkles },
    { id: "trends", label: "Trends", icon: Target },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between animate-scale-in">
        <div>
          <h1 className="text-4xl font-bold mb-2">Intelligence</h1>
          <p className="text-muted-foreground">
            Analytics, insights, and performance tracking for your content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={timePeriod} onValueChange={setTimePeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
              <SelectItem value="12m">Last 12 months</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2 hover-scale">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <Card
            key={metric.title}
            className="p-6 hover:shadow-lg transition-all hover-scale cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                {metric.icon}
              </div>
              <Badge
                variant={metric.trend === "up" ? "success" : "destructive"}
                className="gap-1"
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                {Math.abs(metric.change)}%
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground mb-1">{metric.title}</p>
            <p className="text-3xl font-bold">{metric.value}</p>
          </Card>
        ))}
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

      {/* Overview Tab */}
      {activeView === "overview" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Engagement Trends */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4">Engagement Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={engagementData}>
                  <defs>
                    <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--info))" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(var(--info))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="views"
                    stroke="hsl(var(--primary))"
                    fillOpacity={1}
                    fill="url(#colorViews)"
                  />
                  <Area
                    type="monotone"
                    dataKey="engagement"
                    stroke="hsl(var(--info))"
                    fillOpacity={1}
                    fill="url(#colorEngagement)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Card>

            {/* Content Type Distribution */}
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold mb-4">Content Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={contentTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Conversion Funnel */}
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Bar dataKey="views" fill="hsl(var(--primary))" name="Views" />
                <Bar dataKey="engagement" fill="hsl(var(--info))" name="Engaged" />
                <Bar dataKey="conversions" fill="hsl(var(--success))" name="Converted" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Performance Tab */}
      {activeView === "performance" && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Top Performing Content</h3>
              <Button variant="outline" size="sm" className="hover-scale">
                View All
              </Button>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead className="text-right">Engagement</TableHead>
                  <TableHead className="text-right">Conversions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Published</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {topPerformers.map((content) => (
                  <TableRow key={content.id} className="cursor-pointer hover:bg-muted/50 transition-colors">
                    <TableCell className="font-medium">{content.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{content.type}</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {content.views.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">{content.engagement}%</TableCell>
                    <TableCell className="text-right">
                      {content.conversions.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(content.status)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {content.publishDate}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* AI Insights Tab */}
      {activeView === "insights" && (
        <div className="space-y-6 animate-fade-in">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {aiInsights.map((insight, index) => (
              <Card
                key={insight.id}
                className="p-6 hover:shadow-lg transition-all hover-scale cursor-pointer animate-scale-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                    {getInsightIcon(insight.type)}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold mb-2">{insight.title}</h4>
                    <p className="text-sm text-muted-foreground mb-4">
                      {insight.description}
                    </p>
                    <Button variant="outline" size="sm" className="gap-2 hover-scale">
                      <Sparkles className="h-3 w-3" />
                      {insight.action}
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* AI Summary */}
          <Card className="p-6 bg-primary/5 border-primary/20 hover:shadow-lg transition-shadow">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20 shrink-0">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">AI Analysis Summary</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Your content strategy is performing well overall with a 12.5% increase in views.
                  Healthcare-focused content is your strongest performer. Consider doubling down
                  on case studies and optimizing posting times for maximum engagement. Social media
                  content needs attention - try shorter formats or video to reverse the declining
                  engagement trend.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="hover-scale">
                    Generate Report
                  </Button>
                  <Button variant="outline" size="sm" className="hover-scale">
                    View Recommendations
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Trends Tab */}
      {activeView === "trends" && (
        <div className="space-y-6 animate-fade-in">
          <Card className="p-6 hover:shadow-lg transition-shadow">
            <h3 className="text-lg font-semibold mb-4">Growth Trends</h3>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={engagementData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                <YAxis stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="views"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))" }}
                />
                <Line
                  type="monotone"
                  dataKey="engagement"
                  stroke="hsl(var(--info))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--info))" }}
                />
                <Line
                  type="monotone"
                  dataKey="conversions"
                  stroke="hsl(var(--success))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--success))" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}
    </div>
  );
}
