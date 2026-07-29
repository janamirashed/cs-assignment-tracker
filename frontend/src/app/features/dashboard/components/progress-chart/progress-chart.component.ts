import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-progress-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './progress-chart.component.html',
  styleUrls: ['./progress-chart.component.css']
})
export class ProgressChartComponent implements OnChanges {
  @Input() completedCount = 0;
  @Input() upcomingCount = 0;
  @Input() overdueCount = 0;
  @Input() totalCount = 0;
  @Input() dueSoonCount = 0;

  readonly CIRCUMFERENCE = 301.6;

  percentage = 0;
  completedArc = 0;
  upcomingArc = 0;
  overdueArc = 0;

  ngOnChanges(_: SimpleChanges): void {
    this.percentage = this.totalCount > 0
      ? Math.round((this.completedCount / this.totalCount) * 100)
      : 0;

    if (this.totalCount > 0) {
      this.completedArc = (this.completedCount / this.totalCount) * this.CIRCUMFERENCE;
      this.upcomingArc = (this.upcomingCount / this.totalCount) * this.CIRCUMFERENCE;
      this.overdueArc = (this.overdueCount / this.totalCount) * this.CIRCUMFERENCE;
    } else {
      this.completedArc = 0;
      this.upcomingArc = 0;
      this.overdueArc = 0;
    }
  }
}

