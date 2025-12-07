import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, ExternalLink, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ClickData {
  userId: string;
  bookId: string;
  bookTitle: string;
  timestamp: string;
}

export default function Analytics() {
  const [clicks, setClicks] = useState<ClickData[]>([]);
  const [stats, setStats] = useState({
    totalClicks: 0,
    uniqueBooks: 0,
    clicksThisWeek: 0,
    topBook: ''
  });

  useEffect(() => {
    const clickData = JSON.parse(localStorage.getItem('thoth_amazon_clicks') || '[]');
    setClicks(clickData);

    // Calculate stats
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    const clicksThisWeek = clickData.filter((click: ClickData) => 
      new Date(click.timestamp) > weekAgo
    ).length;

    const bookCounts = clickData.reduce((acc: Record<string, number>, click: ClickData) => {
      acc[click.bookTitle] = (acc[click.bookTitle] || 0) + 1;
      return acc;
    }, {});

    const topBook = Object.entries(bookCounts).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0] || 'None';

    setStats({
      totalClicks: clickData.length,
      uniqueBooks: new Set(clickData.map((c: ClickData) => c.bookId)).size,
      clicksThisWeek,
      topBook
    });
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-foreground" />
              <span className="text-3xl font-bold">{stats.totalClicks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Unique Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-foreground" />
              <span className="text-3xl font-bold">{stats.uniqueBooks}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-foreground" />
              <span className="text-3xl font-bold">{stats.clicksThisWeek}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Top Book</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-foreground" />
              <span className="text-sm font-medium line-clamp-2">{stats.topBook}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Amazon Clicks</CardTitle>
          <CardDescription>Track your book discovery journey</CardDescription>
        </CardHeader>
        <CardContent>
          {clicks.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <ExternalLink className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>No clicks tracked yet</p>
              <p className="text-sm mt-2">Start discovering books to see your analytics</p>
            </div>
          ) : (
            <div className="space-y-3">
              {clicks.slice(0, 10).reverse().map((click, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{click.bookTitle}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(click.timestamp).toLocaleDateString()} at{' '}
                      {new Date(click.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
