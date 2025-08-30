package com.shop.controller;

import com.shop.model.Category;
import com.shop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;

	@GetMapping
	public List<Category> getAllCategories() {
		return categoryService.getAllCategories();
	}

	@GetMapping("/{id}")
	public Optional<Category> getCategoryById(@PathVariable Long id) {
		return categoryService.getCategoryById(id);
	}

	@PostMapping
	public Category createCategory(@RequestBody Category category) {
		return categoryService.saveCategory(category);
	}

	@DeleteMapping("/{id}")
	public void deleteCategory(@PathVariable Long id) {
		categoryService.deleteCategory(id);
	}
}
