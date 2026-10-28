package com.klef.soa.docker.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

	import com.klef.soa.docker.dto.YogaSessionRequest;
	import com.klef.soa.docker.dto.YogaSessionResponse;
	import com.klef.soa.docker.entity.YogaSession;
	import com.klef.soa.docker.repository.YogaSessionRepository;
	import com.klef.soa.docker.service.YogaSessionService;

	@Service
	public class YogaSessionServiceImpl implements YogaSessionService
	{
	    @Autowired
	    private YogaSessionRepository repo;

	    @Override
	    public YogaSessionResponse addYogaSession(YogaSessionRequest request) 
	    {
	        YogaSession session = YogaSession.builder()
	                .sessionName(request.getSessionName())
	                .instructor(request.getInstructor())
	                .duration(request.getDuration())
	                .sessionDate(request.getSessionDate())
	                .availableSlots(request.getAvailableSlots())
	                .build();

	        YogaSession savedSession = repo.save(session);

	        return mapToResponse(savedSession);
	    }

	    @Override
	    public List<YogaSessionResponse> displayAll() 
	    {
	        return repo.findAll()
	                .stream()
	                .map(this::mapToResponse)
	                .toList();
	    }

	    @Override
	    public YogaSessionResponse displayById(Long id) 
	    {
	        YogaSession session = repo.findById(id)
	                .orElseThrow(() -> new ResponseStatusException(
	                        HttpStatus.NOT_FOUND,
	                        "Yoga session with ID " + id + " not found"));

	        return mapToResponse(session);
	    }

	    @Override
	    public String updateYogaSession(Long id, YogaSessionRequest request) 
	    {
	        YogaSession session = repo.findById(id)
	                .orElseThrow(() -> new ResponseStatusException(
	                        HttpStatus.NOT_FOUND,
	                        "Yoga session with ID " + id + " not found"));

	        session.setSessionName(request.getSessionName());
	        session.setInstructor(request.getInstructor());
	        session.setDuration(request.getDuration());
	        session.setSessionDate(request.getSessionDate());
	        session.setAvailableSlots(request.getAvailableSlots());

	        repo.save(session);

	        return "Yoga session updated successfully";
	    }

	    @Override
	    public String delete(Long id) 
	    {
	        YogaSession session = repo.findById(id)
	                .orElseThrow(() -> new ResponseStatusException(
	                        HttpStatus.NOT_FOUND,
	                        "Yoga session with ID " + id + " not found"));

	        repo.delete(session);

	        return "Yoga session deleted successfully";
	    }

	    private YogaSessionResponse mapToResponse(YogaSession session) 
	    {
	        return YogaSessionResponse.builder()
	                .id(session.getId())
	                .sessionName(session.getSessionName())
	                .instructor(session.getInstructor())
	                .duration(session.getDuration())
	                .sessionDate(session.getSessionDate())
	                .availableSlots(session.getAvailableSlots())
	                .build();
	    }
	}

