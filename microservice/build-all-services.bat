@echo off
echo Building All Microservices...
echo.

set BASE_DIR=%~dp0

echo Building shop-model (shared model)...
cd /d "%BASE_DIR%shop-model"
call mvn clean install
if %errorlevel% neq 0 (
    echo Failed to build shop-model
    pause
    exit /b 1
)

echo.
echo Building product-service (Port: 9091)...
cd /d "%BASE_DIR%product-service"
call mvn clean compile
if %errorlevel% neq 0 (
    echo Failed to build product-service
    pause
    exit /b 1
)

echo.
echo Building customer-service (Port: 9092)...
cd /d "%BASE_DIR%customer-service"
call mvn clean compile
if %errorlevel% neq 0 (
    echo Failed to build customer-service
    pause
    exit /b 1
)

echo.
echo Building order-service (Port: 9093)...
cd /d "%BASE_DIR%order-service"
call mvn clean compile
if %errorlevel% neq 0 (
    echo Failed to build order-service
    pause
    exit /b 1
)

echo.
echo Building cart-service (Port: 9094)...
cd /d "%BASE_DIR%cart-service"
call mvn clean compile
if %errorlevel% neq 0 (
    echo Failed to build cart-service
    pause
    exit /b 1
)

echo.
echo Building category-service (Port: 9095)...
cd /d "%BASE_DIR%category-service"
call mvn clean compile
if %errorlevel% neq 0 (
    echo Failed to build category-service
    pause
    exit /b 1
)

echo.
echo All services built successfully!
echo.
echo Service Ports:
echo - product-service: 9091
echo - customer-service: 9092
echo - order-service: 9093
echo - cart-service: 9094
echo - category-service: 9095
pause
