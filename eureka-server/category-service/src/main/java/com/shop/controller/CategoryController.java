package com.shop.controller;

import com.shop.model.Category;
import com.shop.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/categories")
public class CategoryController {

	@Autowired
	private CategoryService categoryService;
	
	@Value("${app.upload.dir:uploads}")
	private String uploadDir;

	@GetMapping
	public List<Category> getAllCategories() {
		return categoryService.getAllCategories();
	}

	@GetMapping("/{id}")
	public Optional<Category> getCategoryById(@PathVariable Long id) {
		return categoryService.getCategoryById(id);
	}

	@PostMapping
	public Category createCategory(@RequestParam("name") String name,
								 @RequestParam("description") String description,
								 @RequestParam(value = "file", required = false) MultipartFile file) {
		Category category = new Category();
		category.setName(name);
		category.setDescription(description);
		
		// Handle image upload if file is provided
		if (file != null && !file.isEmpty()) {
			try {
				// Validate file type
				String contentType = file.getContentType();
				if (contentType != null && contentType.startsWith("image/")) {
					// Create upload directory if it doesn't exist
					Path uploadPath = Paths.get(uploadDir);
					if (!Files.exists(uploadPath)) {
						Files.createDirectories(uploadPath);
					}

					// Generate unique filename
					String originalFilename = file.getOriginalFilename();
					String extension = originalFilename != null && originalFilename.contains(".") 
						? originalFilename.substring(originalFilename.lastIndexOf(".")) 
						: ".jpg";
					String filename = UUID.randomUUID().toString() + extension;

					// Save file
					Path filePath = uploadPath.resolve(filename);
					Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

					// Set image URL
					category.setImageUrl("/images/" + filename);
				}
			} catch (IOException e) {
				// Log error but continue without image
				System.err.println("Failed to upload image: " + e.getMessage());
			}
		}
		
		return categoryService.saveCategory(category);
	}

	@PutMapping("/{id}")
	public Category updateCategory(@PathVariable Long id,
								 @RequestParam("name") String name,
								 @RequestParam("description") String description,
								 @RequestParam(value = "file", required = false) MultipartFile file) {
		Optional<Category> existingCategory = categoryService.getCategoryById(id);
		if (existingCategory.isPresent()) {
			Category category = existingCategory.get();
			category.setName(name);
			category.setDescription(description);
			
			// Handle image upload if file is provided
			if (file != null && !file.isEmpty()) {
				try {
					// Validate file type
					String contentType = file.getContentType();
					if (contentType != null && contentType.startsWith("image/")) {
						// Create upload directory if it doesn't exist
						Path uploadPath = Paths.get(uploadDir);
						if (!Files.exists(uploadPath)) {
							Files.createDirectories(uploadPath);
						}

						// Generate unique filename
						String originalFilename = file.getOriginalFilename();
						String extension = originalFilename != null && originalFilename.contains(".") 
							? originalFilename.substring(originalFilename.lastIndexOf(".")) 
							: ".jpg";
						String filename = UUID.randomUUID().toString() + extension;

						// Save file
						Path filePath = uploadPath.resolve(filename);
						Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

						// Set image URL
						category.setImageUrl("/images/" + filename);
					}
				} catch (IOException e) {
					// Log error but continue without image
					System.err.println("Failed to upload image: " + e.getMessage());
				}
			}
			
			return categoryService.saveCategory(category);
		}
		return null;
	}

	@DeleteMapping("/{id}")
	public void deleteCategory(@PathVariable Long id) {
		categoryService.deleteCategory(id);
	}
}
