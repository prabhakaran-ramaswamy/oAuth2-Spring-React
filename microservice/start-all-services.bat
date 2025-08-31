@echo off
echo Starting All Microservices...
echo.

REM Set the base directory
set BASE_DIR=%~dp0

REM Function to start a service
goto :start_services

:start_service
set SERVICE_NAME=%1
set SERVICE_PORT=%2
echo Starting %SERVICE_NAME% on port %SERVICE_PORT%...
start "Shop %SERVICE_NAME%" cmd /k "cd /d %BASE_DIR%%SERVICE_NAME% && mvn clean compile && mvn spring-boot:run"
timeout /t 5
goto :eof

:start_services
REM Build shop-model first (without running)
echo Building shop-model...
cd /d "%BASE_DIR%shop-model"
call mvn clean install
timeout /t 10

REM Start all services with updated ports
call :start_service "cart-service" "9091"
call :start_service "category-service" "9092" 
call :start_service "customer-service" "9093"
call :start_service "order-service" "9094"
call :start_service "product-service" "9095"

REM Start frontend
echo Starting Frontend (React App)...
start "Shop Frontend" cmd /k "cd /d %BASE_DIR%frontend && npm run dev"

echo.
echo All services are starting...
echo Check individual command windows for service status.
echo.
echo Services:
echo - Cart Service: http://localhost:9091
echo - Category Service: http://localhost:9092
echo - Customer Service: http://localhost:9093
echo - Order Service: http://localhost:9094
echo - Product Service: http://localhost:9095
echo - Frontend: http://localhost:3000
echo.
pause
