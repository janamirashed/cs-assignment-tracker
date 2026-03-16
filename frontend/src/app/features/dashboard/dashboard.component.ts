import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskListComponent } from './components/task-list/task-list.component';
import { ProgressChartComponent } from './components/progress-chart/progress-chart.component';
import { NavbarComponent } from '../../shared/components/navbar/navbar.component';
import { Assignment } from '../../core/models/assignment.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, TaskListComponent, ProgressChartComponent, NavbarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  searchQuery = '';
  isAdmin = true; // Hardcoded for preview, ties to logic later

  assignments: Assignment[] = [
    {
      id: 1,
      courseName: 'ALGORITHMS', courseColor: 'blue',
      title: 'Implement a Balanced BST',
      dueDate: 'Oct 24, 2023',
      completed: false,
      comment: 'Focus on the AVL rotation logic. Graded on correctness and asymptotic analysis.',
      requirementUrl: 'https://drive.google.com/file/example1',
      submissionType: 'both',
      submissionUrl: 'https://forms.example.com/bst'
    },
    {
      id: 2,
      courseName: 'OS', courseColor: 'purple',
      title: 'Memory Management Simulation',
      dueDate: 'Oct 28, 2023',
      completed: false,
      requirementUrl: 'https://drive.google.com/file/example2',
      submissionType: 'teams'
    },
    {
      id: 3,
      courseName: 'NETWORKS', courseColor: 'amber',
      title: 'TCP/IP Stack Implementation',
      dueDate: 'Nov 5, 2023',
      completed: false,
      comment: 'Must include a working congestion control demo.',
      requirementUrl: 'https://docs.google.com/document/example3',
      submissionType: 'form',
      submissionUrl: 'https://forms.example.com/tcpip'
    },
    {
      id: 4,
      courseName: 'AI', courseColor: 'green',
      title: 'Search Heuristics Lab',
      dueDate: 'Oct 15, 2023',
      completed: true,
      requirementUrl: 'https://drive.google.com/file/example4',
      submissionType: 'form',
      submissionUrl: 'https://forms.example.com/heuristics'
    },
    {
      id: 5,
      courseName: 'ALGORITHMS', courseColor: 'blue',
      title: 'Graph Traversal Algorithms',
      dueDate: 'Oct 10, 2023',
      completed: true,
      requirementUrl: 'https://drive.google.com/file/example5',
      submissionType: 'both',
      submissionUrl: 'https://forms.example.com/graphs'
    },
    {
      id: 6,
      courseName: 'OS', courseColor: 'purple',
      title: 'Shell Implementation',
      dueDate: 'Sep 28, 2023',
      completed: true,
      requirementUrl: 'https://drive.google.com/file/example6',
      submissionType: 'teams'
    }
  ];

  get filteredAssignments(): Assignment[] {
    const q = this.searchQuery.toLowerCase().trim();
    if (!q) return this.assignments;
    return this.assignments.filter(a =>
      a.title.toLowerCase().includes(q) ||
      a.courseName.toLowerCase().includes(q)
    );
  }

  get completedCount(): number { return this.assignments.filter(a => a.completed).length; }
  get totalCount(): number { return this.assignments.length; }
  get dueSoonCount(): number { return this.assignments.filter(a => !a.completed).length; }

  toggleAssignment(id: number): void {
    const a = this.assignments.find(a => a.id === id);
    if (a) a.completed = !a.completed;
  }

  onSearchChange(query: string): void { this.searchQuery = query; }

  // assignment crud logic

  showModal = false;
  isEditMode = false;
  
  formData: Partial<Assignment> = {};

  // Toast state
  showToast = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';
  private toastTimeout: any;

  displayToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToast = true;
    
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.showToast = false;
    }, 3000);
  }

  openAddModal(): void {
    this.isEditMode = false;
    this.formData = {
      courseName: '',
      courseColor: 'blue',
      title: '',
      dueDate: '',
      submissionType: 'form',
      requirementUrl: '',
      submissionUrl: '',
      comment: '',
      completed: false
    };
    this.showModal = true;
  }

  openEditModal(task: Assignment): void {
    this.isEditMode = true;
    this.formData = { ...task };
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
  }

  saveAssignment(): void {
    if (!this.formData.title || !this.formData.courseName || !this.formData.dueDate) return;

    if (this.isEditMode) {
      const idx = this.assignments.findIndex(a => a.id === this.formData.id);
      if (idx !== -1) {
        this.assignments[idx] = { ...this.formData } as Assignment;
        this.displayToast('Assignment updated successfully!');
      }
    } else {
      const newId = this.assignments.length > 0 ? Math.max(...this.assignments.map(a => a.id)) + 1 : 1;
      const newTask = { ...this.formData, id: newId } as Assignment;
      this.assignments = [...this.assignments, newTask];
      this.displayToast('Assignment created successfully!');
    }
    
    this.assignments = [...this.assignments];
    this.closeModal();
  }

  deleteAssignment(id: number): void {
    if (confirm('Are you sure you want to delete this assignment?')) {
      this.assignments = this.assignments.filter(a => a.id !== id);
      this.displayToast('Assignment deleted.', 'success');
    }
  }
}
