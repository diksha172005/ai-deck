package com.aideckapp.controller;

import com.aideckapp.model.Category;
import com.aideckapp.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getCategories() {
        List<Map<String, Object>> result = categoryRepository.findAll().stream()
            .map(c -> Map.of(
                "id", (Object) c.getId(),
                "name", c.getName(),
                "icon", c.getIcon() != null ? c.getIcon() : "🔧"
            ))
            .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }
}
