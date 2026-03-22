package com.aideckapp.dto;

import lombok.Data;
import java.util.List;

@Data
public class ToolDTO {
    private Long id;
    private String name;
    private String description;
    private String link;
    private String logoUrl;
    private List<String> tags;
    private String categoryName;
    private Long categoryId;
    private Boolean featured;
}
