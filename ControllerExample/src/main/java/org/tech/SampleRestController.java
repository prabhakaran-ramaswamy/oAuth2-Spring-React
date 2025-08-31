package org.tech;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SampleRestController {

	@GetMapping("/hello")
    public String getUser() {
        return "Messae from RestController!";
    }
}
