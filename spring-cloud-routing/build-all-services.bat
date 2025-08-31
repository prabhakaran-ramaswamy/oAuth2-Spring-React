@echo off
echo Building All Microservices...
echo.

REM Set the base directory
set BASE_DIR=%~dp0

REM Function to build a service
goto :build_services

:build_service
set SERVICE_NAME=%1
echo Building %SERVICE_NAME%...
cd /d "%BASE_DIR%%SERVICE_NAME%"
call mvn clean compile package -DskipTests
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to build %SERVICE_NAME%
    pause
    exit /b 1
)
echo %SERVICE_NAME% built successfully.
echo.
goto :eof

:build_services
REM Build shop-model first (shared dependency)
echo Building shop-model (shared dependency)...
cd /d "%BASE_DIR%shop-model"
call mvn clean install -DskipTests
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to build shop-model
    pause
    exit /b 1
)
echo shop-model built successfully.
echo.

REM Build Spring Cloud Gateway
call :build_service "spring-cloud-gateway"

REM Build all microservices
call :build_service "cart-service"
call :build_service "category-service"
call :build_service "customer-service"
call :build_service "order-service"
call :build_service "product-service"

REM Build frontend
echo Building Frontend (React App)...
cd /d "%BASE_DIR%frontend"
call npm install
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)
call npm run build
if %ERRORLEVEL% neq 0 (
    echo ERROR: Failed to build frontend
    pause
    exit /b 1
)
echo Frontend built successfully.
echo.

echo.
echo ========================================
echo All services built successfully!
echo ========================================
echo.
echo Built services:
echo - shop-model (shared dependency)
echo - Spring Cloud Gateway
echo - Cart Service
echo - Category Service
echo - Customer Service
echo - Order Service
echo - Product Service
echo - Frontend (React App)
echo.
echo You can now run start-all-services.bat to start all services.
pause
