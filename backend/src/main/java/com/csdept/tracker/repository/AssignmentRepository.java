package com.csdept.tracker.repository;

import com.csdept.tracker.entity.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {

    List<Assignment> findByCourseName(String courseName);

    List<Assignment> findByCompleted(boolean completed);
}
