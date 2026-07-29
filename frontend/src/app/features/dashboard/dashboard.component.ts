import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Assignment } from '../../core/models/assignment.model';
import { AssignmentService } from '../../core/services/assignment.service';
import { ProgressService } from '../../core/services/progress.service';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, ProgressChartComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  searchQuery = '';

  get isAdmin(): boolean { return this.authService.isAdmin(); }
  get currentUserId(): number { return this.authService.getUserId(); }

  assignments: Assignment[] = [];

  constructor(
    private assignmentService: AssignmentService,
    private progressService: ProgressService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadAssignments();
  }

  loadAssignments(): void {
    this.assignmentService.getAllAssignments().subscribe({
      next: (data) => {
        this.assignments = data;
        this.loadCompletions();
      },
      error: (err) => {
        console.error('Failed to load assignments', err);
        this.displayToast('Failed to connect to the backend server.', 'error');
      }
    });
  }

  loadCompletions(): void {
    this.progressService.getUserCompletions(this.currentUserId).subscribe({
      next: (completedIds) => {
        this.assignments = this.assignments.map(a => ({
          ...a,
          completed: completedIds.includes(a.id)
        }));
      },
      error: (err) => {
        console.error('Failed to load user completions', err);
      }
    });

    this.progressService.getStats(this.currentUserId).subscribe({
      next: (stats) => {
        console.log("Stats loaded:", stats);
      }
    });
  }

  get filteredAssignments(): Assignment[] {
    const q = this.searchQuery.toLowerCase().trim();
    let result = [...this.assignments]; // clone to avoid mutating original during sort

    if (q) {
      result = result.filter(a =>
        a.title.toLowerCase().includes(q) ||
        (a.courseName && a.courseName.toLowerCase().includes(q))
      );
    }

    // Sort by due date (from soonest to furthest)
    return result.sort((a, b) => {
      const valA = this.parseDate(a.dueDate);
      const valB = this.parseDate(b.dueDate);

      if (valA !== valB) {
        return valA - valB;
      }
      
      // Secondary sort by ID for stability
      return (a.id || 0) - (b.id || 0);
    });
  }

  private parseDate(dateStr: string | undefined): number {
    if (!dateStr) return Infinity;
    
    // Clean ordinal suffixes e.g., "August 9th 23:59" -> "August 9 23:59"
    let cleanDate = dateStr.replace(/(\d+)(st|nd|rd|th)/gi, '$1').trim();

    // If no 4-digit year is specified (e.g. "August 9 23:59"), append current year
    if (!/\b20\d\d\b/.test(cleanDate)) {
      const currentYear = new Date().getFullYear();
      cleanDate = `${cleanDate} ${currentYear}`;
    }

    const time = new Date(cleanDate).getTime();
    
    return isNaN(time) ? Infinity : time;
  }


  get completedCount(): number { return this.assignments.filter(a => a.completed).length; }
  get upcomingCount(): number {
    const now = Date.now();
    return this.assignments.filter(a => {
      if (a.completed) return false;
      const time = this.parseDate(a.dueDate);
      if (!isNaN(time) && time < now) return false;
      return true;
    }).length;
  }
  get overdueCount(): number {
    const now = Date.now();
    return this.assignments.filter(a => {
      if (a.completed) return false;
      const time = this.parseDate(a.dueDate);
      return !isNaN(time) && time < now;
    }).length;
  }
  get totalCount(): number { return this.assignments.length; }
  get dueSoonCount(): number { return this.upcomingCount; }


  toggleAssignment(id: number): void {
    const a = this.assignments.find(a => a.id === id);
    if (!a) return;
    a.completed = !a.completed;

    this.progressService.toggleCompletion(this.currentUserId, id).subscribe({
      next: (response) => {
        a.completed = response.completed;
      },
      error: (err) => {
        console.error('Failed to toggle completion', err);
        a.completed = !a.completed;
      }
    });
  }

  onSearchChange(query: string): void { this.searchQuery = query; }


  showModal = false;
  isEditMode = false;
  formData: Partial<Assignment> = {};

  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  displayToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;

    if (this.toastTimeout) clearTimeout(this.toastTimeout);
    this.toastTimeout = setTimeout(() => { this.showToast = false; }, 3000);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.formData = {
      courseName: '', courseColor: 'blue', title: '', dueDate: '',
      submissionType: 'form', requirementUrl: '', submissionUrl: '', comment: '', completed: false
    };
    this.showModal = true;
  }

  openEditModal(task: Assignment): void {
    this.isEditMode = true;
    this.formData = { ...task };
    this.showModal = true;
  }

  closeModal(): void { this.showModal = false; }

  saveAssignment(): void {
    if (!this.formData.title || !this.formData.courseName || !this.formData.dueDate) return;

    if (this.isEditMode && this.formData.id) {
      this.assignmentService.updateAssignment(this.formData.id, this.formData as Assignment).subscribe({
        next: (updatedTask) => {
          const idx = this.assignments.findIndex(a => a.id === updatedTask.id);
          if (idx !== -1) {
            this.assignments[idx] = updatedTask;
          }
          this.displayToast('Assignment updated successfully!');
          this.closeModal();
        },
        error: (err) => {
          this.displayToast('Error updating assignment', 'error');
        }
      });
    } else {
      this.assignmentService.createAssignment(this.formData as Assignment).subscribe({
        next: (newTask) => {
          this.assignments = [...this.assignments, newTask];
          this.displayToast('Assignment created successfully!');
          this.closeModal();
        },
        error: (err) => {
          this.displayToast('Error creating assignment', 'error');
        }
      });
    }
  }

  showDeleteModal = false;
  assignmentIdToDelete: number | null = null;

  deleteAssignment(id: number): void {
    this.assignmentIdToDelete = id;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.assignmentIdToDelete = null;
  }

  confirmDelete(): void {
    if (this.assignmentIdToDelete === null) return;
    const id = this.assignmentIdToDelete;
    
    this.assignmentService.deleteAssignment(id).subscribe({
      next: () => {
        this.assignments = this.assignments.filter(a => a.id !== id);
        this.displayToast('Assignment deleted.', 'success');
        this.cancelDelete();
      },
      error: (err) => {
        this.displayToast('Error deleting assignment', 'error');
        this.cancelDelete();
      }
    });
  }
}
