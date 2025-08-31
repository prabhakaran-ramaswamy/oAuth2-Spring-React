package org.tech;

import org.springframework.stereotype.Component;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class LoggingInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
        System.out.println("🔍 [Interceptor] Controller selected: " + handler);
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response,
                           Object handler, ModelAndView modelAndView) {
        System.out.println("✅ [Interceptor] Controller executed.");
        if (modelAndView != null) {
            System.out.println("🖼️ [Interceptor] View name: " + modelAndView.getViewName());
        } else {
            System.out.println("📤 [Interceptor] No view returned (probably REST).");
        }
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response,
                                Object handler, Exception ex) {
        if (ex != null) {
            System.out.println("❌ [Interceptor] Exception: " + ex.getMessage());
        } else {
            System.out.println("🔚 [Interceptor] Request completed. HTTP Status: " + response.getStatus());
        }
    }
}
