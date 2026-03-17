package com.csdept.tracker.repository;

import com.csdept.tracker.entity.TaskCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface TaskCompletionRepository extends JpaRepository<TaskCompletion, Long> {

    List<TaskCompletion> findByUserId(Long userId);

    List<TaskCompletion> findByAssignmentId(Long assignmentId);

    Optional<TaskCompletion> findByUserIdAndAssignmentId(Long userId, Long assignmentId);
}
