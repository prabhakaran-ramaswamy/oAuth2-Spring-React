package org.tech;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class SampleRestController {

	@GetMapping("/test")
    public String getUser() {
        return "Messae from RestController!";
    }

}
