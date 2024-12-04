package com.tecnocampus.LS2.protube_back.persistance;

import com.tecnocampus.LS2.protube_back.domain.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Long> {

    Category getCategoryByVideoId(Long id);

    @Query("SELECT DISTINCT c.category FROM Category c")
    List<String> findDistinctCategories();

    List<Category> getCategoriesByCategory(String category);
}
