package com.aideckapp.controller;

import com.aideckapp.dto.FavoriteRequest;
import com.aideckapp.dto.ToolDTO;
import com.aideckapp.service.FavoriteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/favorites")
@CrossOrigin
public class FavoriteController {

    @Autowired
    private FavoriteService favoriteService;

    @GetMapping("/{userId}")
    public ResponseEntity<List<ToolDTO>> getFavorites(@PathVariable Long userId) {
        return ResponseEntity.ok(favoriteService.getFavorites(userId));
    }

    @PostMapping
    public ResponseEntity<?> addFavorite(@RequestBody FavoriteRequest request) {
        favoriteService.addFavorite(request.getUserId(), request.getToolId());
        return ResponseEntity.ok(Map.of("message", "Added to favorites"));
    }

    @DeleteMapping
    public ResponseEntity<?> removeFavorite(@RequestBody FavoriteRequest request) {
        favoriteService.removeFavorite(request.getUserId(), request.getToolId());
        return ResponseEntity.ok(Map.of("message", "Removed from favorites"));
    }
}
