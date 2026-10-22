import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from '../components/common/Card';
import { StatCard } from '../components/common/StatCard';
import { Button } from '../components/common/Button';
import { BarComparisonChart } from '../components/charts/BarComparisonChart';
import { AreaTrendChart } from '../components/charts/AreaTrendChart';
import { DonutCategoryChart } from '../components/charts/DonutCategoryChart';
import { formatCurrency, formatNumber } from '../utils/formatters';
import {
  TrendingUp,
  Percent,
  CreditCard,
  PieChart,
  Target,
  Users,
  Download,
} from 'lucide-react';

export const AnalyticsPage = () => {
  const { stats, products } = useData();

  const handleExportReport = () => {
    window.print();
  };

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">Commerce Analytics & Financials</h1>
          <p className="page-description">
            In-depth evaluation of revenue margins, conversion funnels, category performance, and unit economics.
          </p>
        </div>
        <div className="page-actions">
          <Button variant="secondary" icon={Download} onClick={handleExportReport}>
            Print / Export Report
          </Button>
        </div>
      </div>

      {/* Analytics KPI Cards */}
      <div className="stats-grid">
        <StatCard
          title="Gross Profit Margin"
          value="58.4%"
          trend={3.2}
          subtitle="Net after product cost"
          color="success"
          icon={Percent}
        />
        <StatCard
          title="Customer Acq. Cost (CAC)"
          value="$28.50"
          trend={-8.4}
          subtitle="Blended paid ads CAC"
          color="primary"
          icon={Target}
        />
        <StatCard
          title="Return on Ad Spend (ROAS)"
          value="4.85x"
          trend={12.0}
          subtitle="Across meta & google ads"
          color="info"
          icon={TrendingUp}
        />
        <StatCard
          title="Returning Customer Rate"
          value="42.6%"
          trend={5.7}
          subtitle="Repeat purchase loyalty"
          color="secondary"
          icon={Users}
        />
      </div>

      {/* Financial Comparison Chart */}
      <div style={{ marginBottom: '24px' }}>
        <Card
          title="Revenue vs Cost of Goods Sold (COGS)"
          subtitle="Historical monthly comparisons highlighting gross operating margin"
        >
          <BarComparisonChart />
        </Card>
      </div>

      {/* Category Sales & Trajectory Grid */}
      <div className="charts-grid-2">
        <Card title="Quarterly Revenue Trajectory" subtitle="Cumulative sales flow">
          <AreaTrendChart />
        </Card>

        <Card title="Category Revenue Share" subtitle="Contribution breakdown per line">
          <DonutCategoryChart categoryBreakdown={stats.categoryBreakdown} />
        </Card>
      </div>

      {/* Performance by Category Table */}
      <Card
        title="Departmental Profitability Benchmark"
        subtitle="Catalog volume, average pricing, and estimated margins per category"
      >
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th style={{ textAlign: 'center' }}>SKUs</th>
                <th style={{ textAlign: 'center' }}>Total Units Sold</th>
                <th style={{ textAlign: 'right' }}>Est. Revenue</th>
                <th style={{ textAlign: 'right' }}>Avg Price</th>
                <th style={{ textAlign: 'center' }}>Avg Margin</th>
              </tr>
            </thead>
            <tbody>
              {[
                { cat: 'Electronics', skus: 3, units: 1980, rev: 399580, avg: 132.83, margin: '54.2%' },
                { cat: 'Audio', skus: 1, units: 890, rev: 266991, avg: 299.99, margin: '53.3%' },
                { cat: 'Accessories', skus: 2, units: 627, rev: 169365, avg: 234.00, margin: '52.7%' },
                { cat: 'Fashion & Apparel', skus: 2, units: 710, rev: 115910, avg: 167.00, margin: '61.0%' },
                { cat: 'Footwear', skus: 2, units: 1015, rev: 139840, avg: 124.99, margin: '61.4%' },
                { cat: 'Home & Living', skus: 2, units: 990, rev: 71755, avg: 77.24, margin: '57.7%' },
              ].map((row) => (
                <tr key={row.cat} className="tr-hover">
                  <td style={{ fontWeight: 700 }}>{row.cat}</td>
                  <td style={{ textAlign: 'center' }}>{row.skus}</td>
                  <td style={{ textAlign: 'center', fontWeight: 600 }}>{formatNumber(row.units)}</td>
                  <td style={{ textAlign: 'right', fontWeight: 700, color: 'var(--primary)' }}>
                    {formatCurrency(row.rev)}
                  </td>
                  <td style={{ textAlign: 'right' }}>{formatCurrency(row.avg)}</td>
                  <td style={{ textAlign: 'center', color: 'var(--success)', fontWeight: 700 }}>
                    {row.margin}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
