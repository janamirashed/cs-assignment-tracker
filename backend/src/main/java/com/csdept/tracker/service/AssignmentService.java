package com.csdept.tracker.service;

import com.csdept.tracker.entity.Assignment;
import com.csdept.tracker.repository.AssignmentRepository;
import com.csdept.tracker.repository.TaskCompletionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;
    private final TaskCompletionRepository taskCompletionRepository;

    public List<Assignment> getAllAssignments() {
        return assignmentRepository.findAll();
    }

    public Assignment getAssignmentById(Long id) {
        return assignmentRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Assignment not found with id: " + id));
    }

    public Assignment createAssignment(Assignment assignment) {
        return assignmentRepository.save(assignment);
    }

    public Assignment updateAssignment(Long id, Assignment updated) {
        Assignment existing = getAssignmentById(id);
        existing.setCourseName(updated.getCourseName());
        existing.setCourseColor(updated.getCourseColor());
        existing.setTitle(updated.getTitle());
        existing.setDueDate(updated.getDueDate());
        existing.setCompleted(updated.isCompleted());
        existing.setComment(updated.getComment());
        existing.setRequirementUrl(updated.getRequirementUrl());
        existing.setSubmissionType(updated.getSubmissionType());
        existing.setSubmissionUrl(updated.getSubmissionUrl());
        return assignmentRepository.save(existing);
    }

    @Transactional
    public void deleteAssignment(Long id) {
        Assignment existing = getAssignmentById(id);
        taskCompletionRepository.deleteAll(taskCompletionRepository.findByAssignmentId(id));
        assignmentRepository.delete(existing);
    }
}
