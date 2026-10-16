import { useState, useMemo } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  BookOpen,
  Search,
  Eye,
  ThumbsUp,
  Calendar,
  User,
  Plus,
  Sparkles,
  Rocket,
  Code2,
  ShieldCheck,
  CreditCard,
  FileLock,
  ArrowRight,
  Check,
  Share2,
} from "lucide-react";
import { mockKBArticles } from "@/lib/mock-data";
import type { KBArticle } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

export const Route = createFileRoute("/dashboard/knowledge-base/")({
  component: KnowledgeBasePage,
});

const CATEGORIES = [
  "All",
  "Onboarding",
  "Developer",
  "Security",
  "Billing",
  "Internal",
] as const;

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case "onboarding":
      return Rocket;
    case "developer":
      return Code2;
    case "security":
      return ShieldCheck;
    case "billing":
      return CreditCard;
    case "internal":
      return FileLock;
    default:
      return BookOpen;
  }
}

function getCategoryColor(category: string) {
  switch (category.toLowerCase()) {
    case "onboarding":
      return "border-emerald-500/30 bg-emerald-500/10 text-emerald-400";
    case "developer":
      return "border-blue-500/30 bg-blue-500/10 text-blue-400";
    case "security":
      return "border-purple-500/30 bg-purple-500/10 text-purple-400";
    case "billing":
      return "border-amber-500/30 bg-amber-500/10 text-amber-400";
    case "internal":
      return "border-rose-500/30 bg-rose-500/10 text-rose-400";
    default:
      return "border-border bg-muted/50 text-muted-foreground";
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function KnowledgeBasePage() {
  const [articles, setArticles] = useState<KBArticle[]>(mockKBArticles);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeArticle, setActiveArticle] = useState<KBArticle | null>(null);
  const [likedArticles, setLikedArticles] = useState<Record<string, boolean>>({});
  const [copied, setCopied] = useState(false);

  // Filtered articles
  const filteredArticles = useMemo(() => {
    return articles.filter((article) => {
      // Category filter
      if (
        selectedCategory !== "All" &&
        article.category.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      // Search filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const matchesTitle = article.title.toLowerCase().includes(query);
        const matchesContent = article.content.toLowerCase().includes(query);
        const matchesAuthor = article.author.toLowerCase().includes(query);
        const matchesTags = article.tags.some((t) => t.toLowerCase().includes(query));
        return matchesTitle || matchesContent || matchesAuthor || matchesTags;
      }
      return true;
    });
  }, [articles, selectedCategory, searchQuery]);

  // Aggregate metrics
  const totalViews = useMemo(
    () => articles.reduce((sum, a) => sum + a.views, 0),
    [articles]
  );
  const totalHelpful = useMemo(
    () => articles.reduce((sum, a) => sum + a.helpful, 0),
    [articles]
  );
  const publishedCount = useMemo(
    () => articles.filter((a) => a.isPublished).length,
    [articles]
  );

  const handleLike = (articleId: string) => {
    const isAlreadyLiked = likedArticles[articleId];
    setLikedArticles((prev) => ({ ...prev, [articleId]: !isAlreadyLiked }));
    setArticles((prev) =>
      prev.map((a) => {
        if (a.id === articleId) {
          return {
            ...a,
            helpful: isAlreadyLiked ? a.helpful - 1 : a.helpful + 1,
          };
        }
        return a;
      })
    );
    if (activeArticle && activeArticle.id === articleId) {
      setActiveArticle((prev) =>
        prev
          ? {
              ...prev,
              helpful: isAlreadyLiked ? prev.helpful - 1 : prev.helpful + 1,
            }
          : null
      );
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header and Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-gradient-to-r from-card/80 via-card/40 to-background p-6 lg:p-8 backdrop-blur-sm">
        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary gap-1">
                <BookOpen className="h-3 w-3" />
                Documentation & SOPs
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {publishedCount} Public Guides
              </Badge>
            </div>
            <h1 className="text-2xl font-display font-bold tracking-tight text-foreground sm:text-3xl">
              Knowledge Base & Support Hub
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Explore technical documentation, deployment runbooks, billing policies, and internal
              architectural guidelines for engineering and client support teams.
            </p>
          </div>

          {/* Quick Stats on the right */}
          <div className="grid grid-cols-3 gap-3 rounded-xl border border-border/50 bg-muted/20 p-4">
            <div className="text-center px-2">
              <p className="text-xs text-muted-foreground">Articles</p>
              <p className="text-lg font-bold font-display text-foreground mt-0.5">{articles.length}</p>
            </div>
            <div className="text-center px-2 border-x border-border/40">
              <p className="text-xs text-muted-foreground">Total Views</p>
              <p className="text-lg font-bold font-display text-primary mt-0.5">
                {totalViews.toLocaleString()}
              </p>
            </div>
            <div className="text-center px-2">
              <p className="text-xs text-muted-foreground">Helpful</p>
              <p className="text-lg font-bold font-display text-emerald-400 mt-0.5">
                {totalHelpful}
              </p>
            </div>
          </div>
        </div>

        {/* Atmospheric ambient glow */}
        <div className="atmos -top-24 -left-24 h-72 w-72 bg-primary/15" />
      </div>

      {/* Search Bar at Top */}
      <div className="relative max-w-2xl">
        <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search articles by title, keywords, authors, or tags..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="h-12 pl-12 pr-4 text-base bg-card/60 border-border/80 focus-visible:border-primary shadow-sm rounded-xl"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="border-b border-border/50 pb-3">
        <Tabs
          value={selectedCategory}
          onValueChange={setSelectedCategory}
          className="w-full"
        >
          <TabsList className="bg-muted/40 p-1 border border-border/40 flex-wrap h-auto gap-1">
            {CATEGORIES.map((cat) => {
              const count =
                cat === "All"
                  ? articles.length
                  : articles.filter(
                      (a) => a.category.toLowerCase() === cat.toLowerCase()
                    ).length;

              return (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  className="text-xs px-3 py-1.5 data-[state=active]:bg-primary/15 data-[state=active]:text-primary"
                >
                  {cat} ({count})
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredArticles.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-dashed border-border/60 bg-card/20 p-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60 mb-3" />
            <h3 className="text-base font-semibold text-foreground">No articles found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
              No knowledge base articles match your search or selected category filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          filteredArticles.map((article) => {
            const Icon = getCategoryIcon(article.category);
            const isLiked = !!likedArticles[article.id];

            return (
              <Card
                key={article.id}
                onClick={() => setActiveArticle(article)}
                className="group relative flex flex-col justify-between overflow-hidden border-border/60 bg-card/40 backdrop-blur-sm transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:bg-card/80 hover:shadow-lg cursor-pointer"
              >
                <div>
                  <CardHeader className="p-5 pb-3">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      {/* Category Badge */}
                      <span
                        className={cn(
                          "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
                          getCategoryColor(article.category)
                        )}
                      >
                        <Icon className="h-3 w-3" />
                        {article.category}
                      </span>

                      {/* Published / Draft Indicator */}
                      {article.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                          Published
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-semibold text-amber-400 uppercase tracking-wider">
                          Internal Draft
                        </span>
                      )}
                    </div>

                    {/* Article Title */}
                    <CardTitle className="text-base font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </CardTitle>

                    {/* Excerpt */}
                    <CardDescription className="text-xs text-muted-foreground line-clamp-3 mt-2 leading-relaxed">
                      {article.content}
                    </CardDescription>
                  </CardHeader>

                  {/* Tags */}
                  <div className="px-5 pb-3 flex flex-wrap gap-1">
                    {article.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="text-[10px] px-1.5 py-0 font-normal bg-muted/40 text-muted-foreground"
                      >
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Footer Meta: Views, Helpfulness, Last Updated, Author */}
                <div className="border-t border-border/40 bg-muted/10 px-5 py-3 text-xs text-muted-foreground flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center gap-1" title={`${article.views} views`}>
                      <Eye className="h-3.5 w-3.5 text-muted-foreground/70" />
                      <span>{article.views}</span>
                    </span>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLike(article.id);
                      }}
                      className={cn(
                        "inline-flex items-center gap-1 hover:text-emerald-400 transition-colors cursor-pointer",
                        isLiked && "text-emerald-400 font-semibold"
                      )}
                      title="Mark as helpful"
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{article.helpful}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px]" title={`Updated ${formatDate(article.lastUpdated)}`}>
                      <Calendar className="h-3 w-3" />
                      {formatDate(article.lastUpdated)}
                    </span>

                    <Avatar className="h-5 w-5 border border-border">
                      <AvatarFallback className="text-[9px] bg-primary/20 text-primary">
                        {getInitials(article.author)}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Article Reader Modal */}
      <Dialog open={!!activeArticle} onOpenChange={(open) => !open && setActiveArticle(null)}>
        {activeArticle && (
          <DialogContent className="max-w-2xl border-border bg-card">
            <DialogHeader className="border-b border-border/50 pb-4">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span
                  className={cn(
                    "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium",
                    getCategoryColor(activeArticle.category)
                  )}
                >
                  {activeArticle.category}
                </span>

                <div className="flex items-center gap-2">
                  {activeArticle.isPublished ? (
                    <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 text-xs">
                      Published Guide
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="border-amber-500/30 text-amber-400 text-xs">
                      Internal Draft
                    </Badge>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 text-xs gap-1"
                    onClick={handleCopyLink}
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Share2 className="h-3.5 w-3.5" />}
                    {copied ? "Copied" : "Share"}
                  </Button>
                </div>
              </div>

              <DialogTitle className="text-xl font-display font-bold text-foreground">
                {activeArticle.title}
              </DialogTitle>

              <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-1">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary" />
                  Written by <strong className="text-foreground">{activeArticle.author}</strong>
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  Last updated {formatDate(activeArticle.lastUpdated)}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Eye className="h-3.5 w-3.5" />
                  {activeArticle.views} views
                </span>
              </div>
            </DialogHeader>

            {/* Article Content */}
            <div className="space-y-4 py-2">
              <div className="rounded-xl border border-border/60 bg-muted/20 p-5 text-sm leading-relaxed text-foreground/90 space-y-3">
                <p className="font-medium text-foreground">{activeArticle.content}</p>
                <p className="text-muted-foreground text-xs leading-normal">
                  This documentation is maintained in accordance with ARTech engineering and security
                  protocols. For questions regarding configuration flags or production exceptions,
                  please contact the author or raise a ticket in the Support queue.
                </p>

                {/* Simulated doc code snippet for Developer category */}
                {activeArticle.category === "Developer" && (
                  <div className="rounded-lg bg-black/60 p-3 font-mono text-xs text-primary border border-primary/20">
                    <code>
                      curl -X POST https://api.artech.dev/v1/auth \<br />
                      &nbsp;&nbsp;-H &quot;Authorization: Bearer YOUR_API_KEY&quot; \<br />
                      &nbsp;&nbsp;-d &#39;&#123;&quot;service&quot;: &quot;gateway&quot;&#125;&#39;
                    </code>
                  </div>
                )}
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {activeArticle.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      #{t}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Feedback strip */}
              <div className="flex items-center justify-between rounded-xl border border-border/50 bg-muted/15 p-4">
                <span className="text-xs text-muted-foreground">Was this article helpful to you?</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleLike(activeArticle.id)}
                  className={cn(
                    "gap-1.5 text-xs",
                    likedArticles[activeArticle.id] && "border-emerald-500/50 bg-emerald-500/10 text-emerald-400"
                  )}
                >
                  <ThumbsUp className="h-3.5 w-3.5" />
                  <span>Helpful ({activeArticle.helpful})</span>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
