package com.csdept.tracker.controller;

import com.csdept.tracker.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/toggle")
    public ResponseEntity<Map<String, Boolean>> toggleCompletion(
            @RequestParam Long userId,
            @RequestParam Long assignmentId) {
        boolean completed = progressService.toggleCompletion(userId, assignmentId);
        return ResponseEntity.ok(Map.of("completed", completed));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Long>> getUserCompletions(@PathVariable Long userId) {
        List<Long> completedIds = progressService.getCompletionsByUser(userId).stream()
                .map(tc -> tc.getAssignment().getId())
                .collect(Collectors.toList());
        return ResponseEntity.ok(completedIds);
    }

    @GetMapping("/stats/{userId}")
    public ResponseEntity<Map<String, Long>> getStats(@PathVariable Long userId) {
        long completed = progressService.getCompletedCount(userId);
        long total = progressService.getTotalCount();
        return ResponseEntity.ok(Map.of(
                "completed", completed,
                "total", total
        ));
    }
}
