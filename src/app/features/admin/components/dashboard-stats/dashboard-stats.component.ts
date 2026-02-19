import { CommonModule } from '@angular/common';
import { NgxChartsModule } from '@swimlane/ngx-charts';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-dashboard-stats',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard-stats.component.html',
  styleUrl: './dashboard-stats.component.scss'
})
export class DashboardStatsComponent implements OnInit, OnDestroy {
  private supabase: SupabaseClient;
  private themeObserver: MutationObserver | undefined;

  // Chart Options
  view: [number, number] = [700, 300];
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Sweets';
  showYAxisLabel = true;
  yAxisLabel = 'Total Sales (₹)';

  // 🎨 Define Color Palettes
  darkScheme = {
    domain: ['#F97316', '#FB923C', '#FDBA74', '#FFEDD5'] // Bright Orange (Dark Mode)
  };

  lightScheme = {
    domain: ['#7C2D12', '#9A3412', '#C2410C', '#EA580C'] // Deep Orange (Light Mode)
  };

  // Default to dark scheme initially
  colorScheme: any = this.darkScheme;

  single: any[] = []; 

  constructor() {
    // Note: Ensure these match your environment.ts variable names exactly
    this.supabase = createClient(environment.SUPABASE_URL, environment.SUPABASE_KEY);
  }

  ngOnInit() {
    this.fetchStats();
    this.setupThemeListener(); // 👈 Start watching for theme changes
  }

  ngOnDestroy() {
    // Clean up the observer to prevent memory leaks
    if (this.themeObserver) {
      this.themeObserver.disconnect();
    }
  }

  setupThemeListener() {
    // 1. Set initial color
    this.updateThemeColors();

    // 2. Watch <html> tag for 'dark' class changes
    this.themeObserver = new MutationObserver(() => {
      this.updateThemeColors();
    });

    this.themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });
  }

  updateThemeColors() {
    const isDark = document.documentElement.classList.contains('dark');
    this.colorScheme = isDark ? this.darkScheme : this.lightScheme;
  }

  async fetchStats() {
    // 1. Fetch Orders -> OrderItems -> Sweets (Triple Join)
    const { data: orders, error } = await this.supabase
      .from('Orders')
      .select(`
        *,
        OrderItems (
          *,
          Sweets (
            name
          )
        )
      `)
      .neq('status', 'CANCELLED');

    if (error) {
      console.error('Error fetching stats:', error);
      return;
    }

    if (!orders || orders.length === 0) return;

    const statsMap = new Map<string, number>();

    orders.forEach((order: any) => {
      // Access the OrderItems list (checking multiple possible casing styles)
      const items = order.OrderItems || order.order_items || [];

      if (Array.isArray(items)) {
        items.forEach((item: any) => {
          // 2. Extract name from nested Sweets object
          let sweetName = 'Unknown Sweet';
          
          if (item.Sweets && item.Sweets.name) {
            sweetName = item.Sweets.name;
          } else if (item.sweets && item.sweets.name) {
             sweetName = item.sweets.name;
          }

          const price = Number(item.Price || item.price || 0);
          const quantity = Number(item.Quantity || item.quantity || 1);
          
          // 3. Add to total
          if (sweetName !== 'Unknown Sweet') {
            const currentTotal = statsMap.get(sweetName) || 0;
            statsMap.set(sweetName, currentTotal + (price * quantity));
          }
        });
      }
    });

    // 4. Update Chart
    this.single = Array.from(statsMap, ([name, value]) => ({ name, value }));
  }
}