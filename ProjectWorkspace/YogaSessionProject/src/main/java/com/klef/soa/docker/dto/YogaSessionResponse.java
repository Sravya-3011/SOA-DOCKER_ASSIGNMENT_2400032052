package com.klef.soa.docker.dto;

import java.time.LocalDate;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class YogaSessionResponse 
{
    private Long id;
    private String sessionName;
    private String instructor;
    private Integer duration;
    private LocalDate sessionDate;
    private Integer availableSlots;
}