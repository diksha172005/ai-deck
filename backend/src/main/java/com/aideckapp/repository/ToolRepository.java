package com.aideckapp.repository;

import com.aideckapp.model.Tool;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface ToolRepository extends JpaRepository<Tool, Long> {

    List<Tool> findByCategoryId(Long categoryId);

    List<Tool> findByCategoryNameIgnoreCase(String categoryName);

    @Query("SELECT t FROM Tool t WHERE " +
           "LOWER(t.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "EXISTS (SELECT tag FROM t.tags tag WHERE LOWER(tag) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<Tool> searchByNameOrTags(@Param("query") String query);

    List<Tool> findByFeaturedTrue();
}
