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

  // Context menu state
  contextMenuVisible = false;
  contextMenuX = 0;
  contextMenuY = 0;
  contextMenuTask: Assignment | null = null;

  get upcoming(): Assignment[] {
    return this.assignments.filter(a => !a.completed);
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

  // Context menu
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
}
