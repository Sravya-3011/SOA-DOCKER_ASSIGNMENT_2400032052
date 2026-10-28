package com.klef.soa.docker.service;

import java.util.List;

import com.klef.soa.docker.dto.YogaSessionRequest;
import com.klef.soa.docker.dto.YogaSessionResponse;

public interface YogaSessionService 
{
    YogaSessionResponse addYogaSession(YogaSessionRequest request);

    String updateYogaSession(Long id, YogaSessionRequest request);

    YogaSessionResponse displayById(Long id);

    List<YogaSessionResponse> displayAll();

    String delete(Long id);
}