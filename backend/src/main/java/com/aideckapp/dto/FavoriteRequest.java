package com.aideckapp.dto;

import lombok.Data;

@Data
public class FavoriteRequest {
    private Long userId;
    private Long toolId;
}
