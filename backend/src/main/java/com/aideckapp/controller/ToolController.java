package com.aideckapp.controller;

import com.aideckapp.dto.CreateToolRequest;
import com.aideckapp.dto.ToolDTO;
import com.aideckapp.service.ToolService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tools")
@CrossOrigin
public class ToolController {

    @Autowired
    private ToolService toolService;

    @GetMapping
    public ResponseEntity<List<ToolDTO>> getTools(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {

        if (search != null && !search.isBlank()) {
            return ResponseEntity.ok(toolService.searchTools(search));
        }
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(toolService.getToolsByCategory(category));
        }
        return ResponseEntity.ok(toolService.getAllTools());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<ToolDTO>> getFeatured() {
        return ResponseEntity.ok(toolService.getFeaturedTools());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ToolDTO> getTool(@PathVariable Long id) {
        return ResponseEntity.ok(toolService.getToolById(id));
    }

    @PostMapping
    public ResponseEntity<ToolDTO> createTool(@RequestBody CreateToolRequest request) {
        return ResponseEntity.ok(toolService.createTool(request));
    }
}
