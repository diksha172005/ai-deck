package com.aideckapp.service;

import com.aideckapp.dto.ToolDTO;
import com.aideckapp.model.Tool;
import com.aideckapp.model.User;
import com.aideckapp.repository.ToolRepository;
import com.aideckapp.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class FavoriteService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ToolRepository toolRepository;

    @Autowired
    private ToolService toolService;

    public List<ToolDTO> getFavorites(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        return user.getFavorites().stream()
                .map(toolService::toDTO)
                .collect(Collectors.toList());
    }

    public void addFavorite(Long userId, Long toolId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Tool not found: " + toolId));

        user.getFavorites().add(tool);
        userRepository.save(user);
    }

    public void removeFavorite(Long userId, Long toolId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found: " + userId));
        Tool tool = toolRepository.findById(toolId)
                .orElseThrow(() -> new RuntimeException("Tool not found: " + toolId));

        user.getFavorites().remove(tool);
        userRepository.save(user);
    }
}
