@echo off
set "JAVA_HOME=C:\Users\SACHIN GOSWAMI\jdk-17"
set "PATH=%JAVA_HOME%\bin;%PATH%"
set "MAVEN_BIN=C:\Users\SACHIN GOSWAMI\maven\apache-maven-3.9.6\bin\mvn.cmd"

if exist "%MAVEN_BIN%" (
    "%MAVEN_BIN%" %*
) else (
    mvn %*
)
