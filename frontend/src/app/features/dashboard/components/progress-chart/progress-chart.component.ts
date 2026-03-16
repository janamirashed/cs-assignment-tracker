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
  @Input() totalCount = 0;
  @Input() dueSoonCount = 0;

  readonly CIRCUMFERENCE = 301.6;

  notStartedCount = 0;
  percentage = 0;
  completedArc = 0;
  notStartedArc = 0;

  ngOnChanges(_: SimpleChanges): void {
    this.notStartedCount = this.totalCount - this.completedCount;
    this.percentage = this.totalCount > 0
      ? Math.round((this.completedCount / this.totalCount) * 100)
      : 0;
    this.completedArc = this.totalCount > 0
      ? (this.completedCount / this.totalCount) * this.CIRCUMFERENCE
      : 0;
    this.notStartedArc = this.CIRCUMFERENCE - this.completedArc;
  }
}
