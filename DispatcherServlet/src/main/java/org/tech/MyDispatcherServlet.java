package org.tech;

import org.springframework.web.servlet.DispatcherServlet;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class MyDispatcherServlet extends DispatcherServlet {
    /**
	 * 
	 */
	private static final long serialVersionUID = -354454707337758435L;

	@Override
    protected void doDispatch(HttpServletRequest request, HttpServletResponse response) throws Exception {
        System.out.println("🧭 [DispatcherServlet] Request reached DispatcherServlet: "
                + request.getMethod() + " " + request.getRequestURI());
        super.doDispatch(request, response);
    }
}
