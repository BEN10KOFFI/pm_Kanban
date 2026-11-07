# Scripts agent guide

This directory contains local start and stop scripts for the project. It is intended to provide a simple way to run and shut down the app in development on macOS, Windows, and Linux.

## Current purpose

The scripts are designed to:
- start the local application stack from the repository root
- stop the stack cleanly when development is complete
- support Docker-based local execution of the backend and future integrated app

## Files

- `start.sh`: Unix/macOS/Linux start script
- `stop.sh`: Unix/macOS/Linux stop script
- `start.ps1`: Windows PowerShell start script
- `stop.ps1`: Windows PowerShell stop script

## Expected behavior

- Run from the repository root.
- Start the app using Docker Compose.
- Expose the Docker service locally on port 8001 (container port 8000).
- Stop the service cleanly and remove orphaned containers.

## Validation

Once the app is running, confirm that the backend responds on:
- `http://localhost:8001/`
- `http://localhost:8001/api/health`