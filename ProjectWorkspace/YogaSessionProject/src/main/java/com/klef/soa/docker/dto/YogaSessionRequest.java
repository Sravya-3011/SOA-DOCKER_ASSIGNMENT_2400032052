package com.klef.soa.docker.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class YogaSessionRequest 
{
    @NotBlank(message = "Session name is required")
    @Size(max = 100, message = "Session name cannot exceed 100 characters")
    private String sessionName;

    @NotBlank(message = "Instructor name is required")
    @Size(max = 100, message = "Instructor name cannot exceed 100 characters")
    private String instructor;

    @NotNull(message = "Session duration is required")
    @Min(value = 1, message = "Session duration must be at least 1 minute")
    private Integer duration;

    @NotNull(message = "Session date is required")
    private LocalDate sessionDate;

    @NotNull(message = "Available slots are required")
    @Min(value = 0, message = "Available slots cannot be negative")
    private Integer availableSlots;
}