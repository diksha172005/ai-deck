package com.aideckapp.service;

import com.aideckapp.dto.CreateToolRequest;
import com.aideckapp.dto.ToolDTO;
import com.aideckapp.model.Category;
import com.aideckapp.model.Tool;
import com.aideckapp.repository.CategoryRepository;
import com.aideckapp.repository.ToolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ToolService {

    @Autowired
    private ToolRepository toolRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public List<ToolDTO> getAllTools() {
        return toolRepository.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ToolDTO getToolById(Long id) {
        Tool tool = toolRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tool not found: " + id));
        return toDTO(tool);
    }

    public List<ToolDTO> getToolsByCategory(String category) {
        return toolRepository.findByCategoryNameIgnoreCase(category).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ToolDTO> searchTools(String query) {
        return toolRepository.searchByNameOrTags(query).stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public List<ToolDTO> getFeaturedTools() {
        return toolRepository.findByFeaturedTrue().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    public ToolDTO createTool(CreateToolRequest request) {
        Category category = categoryRepository.findById(request.getCategoryId())
                .orElseThrow(() -> new RuntimeException("Category not found: " + request.getCategoryId()));

        Tool tool = new Tool();
        tool.setName(request.getName());
        tool.setDescription(request.getDescription());
        tool.setLink(request.getLink());
        tool.setLogoUrl(request.getLogoUrl());
        tool.setTags(request.getTags());
        tool.setCategory(category);
        tool.setFeatured(request.getFeatured() != null ? request.getFeatured() : false);

        return toDTO(toolRepository.save(tool));
    }

    public ToolDTO toDTO(Tool tool) {
        ToolDTO dto = new ToolDTO();
        dto.setId(tool.getId());
        dto.setName(tool.getName());
        dto.setDescription(tool.getDescription());
        dto.setLink(tool.getLink());
        dto.setLogoUrl(tool.getLogoUrl());
        dto.setTags(tool.getTags());
        dto.setFeatured(tool.getFeatured());
        if (tool.getCategory() != null) {
            dto.setCategoryName(tool.getCategory().getName());
            dto.setCategoryId(tool.getCategory().getId());
        }
        return dto;
    }
}
