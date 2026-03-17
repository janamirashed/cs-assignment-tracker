
package com.csdept.tracker.entity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Assignment {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String courseName;

    @Column(nullable = false)
    private String courseColor;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String dueDate;

    private boolean completed;

    private String comment;
    
    private String requirementUrl;
    
    @Column(nullable = false)
    private String submissionType;
    
    private String submissionUrl;
}