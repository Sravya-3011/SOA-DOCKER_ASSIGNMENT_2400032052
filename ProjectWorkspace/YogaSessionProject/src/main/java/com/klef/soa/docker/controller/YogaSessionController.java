
package com.klef.soa.docker.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import com.klef.soa.docker.dto.YogaSessionRequest;
import com.klef.soa.docker.dto.YogaSessionResponse;
import com.klef.soa.docker.service.YogaSessionService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.RequestBody;

@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class YogaSessionController 
{
    @Autowired
    private YogaSessionService service;

    @GetMapping("/")
    public String Home() {
        return "Yoga Session Service is running...";
    }

    @PostMapping("/addYogaSession") 
    public YogaSessionResponse addYogaSession(@Valid @RequestBody YogaSessionRequest session) {
        return service.addYogaSession(session); 
    }

    @GetMapping("/displayAll")
    public List<YogaSessionResponse> getAllYogaSessions() 
    {
        return service.displayAll();
    }

    @DeleteMapping("/delete/{id}")
    public String deleteYogaSession(@PathVariable long id) {
        return service.delete(id);
    }

    @PutMapping("/update/{id}")
    public String updateYogaSession(@Valid @RequestBody YogaSessionRequest session, @PathVariable Long id)
    {
        return service.updateYogaSession(id, session);
    }

    @GetMapping("/displayById/{id}")
    public YogaSessionResponse displayById(@PathVariable Long id)
    {
        return service.displayById(id);
    }
}
