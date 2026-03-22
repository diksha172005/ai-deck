package com.aideckapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class CreateToolRequest {
    private String name;
    private String description;
    private String link;
    private String logoUrl;
    private List<String> tags;
    private Long categoryId;
    private Boolean featured = false;
}
