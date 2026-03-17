package com.csdept.tracker.service;

import com.csdept.tracker.entity.TaskCompletion;
import com.csdept.tracker.repository.AssignmentRepository;
import com.csdept.tracker.repository.TaskCompletionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {
    private final TaskCompletionRepository taskCompletionRepository;
    private final AssignmentRepository assignmentRepository;

    public List<TaskCompletion> getCompletionsByUser(Long userId) {
        return taskCompletionRepository.findByUserId(userId);
    }

    public boolean toggleCompletion(Long userId, Long assignmentId) {
        var existing = taskCompletionRepository
                .findByUserIdAndAssignmentId(userId, assignmentId);
        if (existing.isPresent()) {
            taskCompletionRepository.delete(existing.get());
            return false;
        } else {
            TaskCompletion completion = new TaskCompletion();
            completion.setUser(new com.csdept.tracker.entity.User());
            completion.getUser().setId(userId);
            completion.setAssignment(new com.csdept.tracker.entity.Assignment());
            completion.getAssignment().setId(assignmentId);
            taskCompletionRepository.save(completion);
            return true;
        }
    }

    public long getCompletedCount(Long userId) {
        return taskCompletionRepository.findByUserId(userId).size();
    }
    public long getTotalCount() {
        return assignmentRepository.count();
    }

}
