package com.aideckapp.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.util.List;

@Entity
@Table(name = "tools")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Tool {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private String link;

    @Column
    private String logoUrl;

   import jakarta.persistence.FetchType;

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "tool_tags", joinColumns = @JoinColumn(name = "tool_id"))
    @Column(name = "tag")
    private List<String> tags;
    ```

    ---

## See the Full Build Error

Railway → **Deployments** → failed deployment → **View Logs** → scroll to find:
```
[ERROR] COMPILATION ERROR
[ERROR] .../ToolService.java:[line] error message

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(nullable = false)
    private Boolean featured = false;
}
