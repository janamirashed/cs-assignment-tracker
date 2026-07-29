import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Assignment } from '../../../../core/models/assignment.model';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent {
  @Input() assignments: Assignment[] = [];
  @Input() searchQuery = '';
  @Input() isAdmin = false;
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() addAssignment = new EventEmitter<void>();
  @Output() editAssignment = new EventEmitter<Assignment>();
  @Output() deleteAssignment = new EventEmitter<number>();

  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuTask: Assignment | null = null;
  completedExpanded = false;

  private parseDate(dateStr: string | undefined): number {
    if (!dateStr) return NaN;
    // Clean ordinal suffixes e.g., "August 9th 23:59" -> "August 9 23:59"
    let cleanDate = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, '$1').trim();
    
    // If no 4-digit year is specified (e.g. "August 9 23:59"), append current year
    if (!/\b20\d\d\b/.test(cleanDate)) {
      const currentYear = new Date().getFullYear();
      cleanDate = `${cleanDate} ${currentYear}`;
    }

    const time = new Date(cleanDate).getTime();
    return isNaN(time) ? NaN : time;
  }


  get upcoming(): Assignment[] {
    const now = Date.now();
    return this.assignments.filter(a => {
      if (a.completed) return false;
      const time = this.parseDate(a.dueDate);
      if (!isNaN(time) && time < now) {
        return false;
      }
      return true;
    });
  }

  get overdue(): Assignment[] {
    const now = Date.now();
    return this.assignments.filter(a => {
      if (a.completed) return false;
      const time = this.parseDate(a.dueDate);
      return !isNaN(time) && time < now;
    });
  }

  get completed(): Assignment[] {
    return this.assignments.filter(a => a.completed);
  }


  toggle(id: number): void {
    this.toggleComplete.emit(id);
  }

  onAdd(): void {
    this.addAssignment.emit();
  }

  onEdit(task: Assignment): void {
    this.editAssignment.emit(task);
  }

  onDelete(id: number): void {
    this.deleteAssignment.emit(id);
  }

  openContextMenu(event: MouseEvent, task: Assignment): void {
    event.preventDefault();
    event.stopPropagation();
    this.contextMenuX = event.clientX;
    this.contextMenuY = event.clientY;
    this.contextMenuTask = task;
    this.contextMenuVisible = true;
  }

  closeContextMenu(): void {
    this.contextMenuVisible = false;
    this.contextMenuTask = null;
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.closeContextMenu();
  }

  toggleCompletedSection(): void {
    this.completedExpanded = !this.completedExpanded;
  }
}