@echo off
echo Stopping All Microservices...
echo.

REM Kill Spring Boot applications by port
echo Stopping services on their respective ports...
echo - Stopping product-service (port 9091)
echo - Stopping customer-service (port 9092)
echo - Stopping order-service (port 9093)
echo - Stopping cart-service (port 9094)
echo - Stopping category-service (port 9095)

REM Kill all Java processes running Spring Boot applications
echo Stopping Spring Boot applications...
taskkill /f /im java.exe 2>nul
if %errorlevel%==0 (
    echo All Java processes stopped successfully.
) else (
    echo No Java processes found or failed to stop.
)

echo.
echo All microservices stopped.
pause
