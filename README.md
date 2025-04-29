# Zoning Tool

A full-stack web application for managing zoning updates for real estate parcels. This tool demonstrates integration with real estate data to enable visualization, selection, and updating of zoning designations.

View the project repository: [https://github.com/Alachan/zoning-management-app](https://github.com/Alachan/zoning-management-app)

## Demo

You can watch a demo of the application here:

[![Zoning Tool Demo](https://img.youtube.com/vi/wgRBdqIHHmc/0.jpg)](https://www.youtube.com/watch?v=wgRBdqIHHmc)

## Features

- Interactive map display with real estate parcels
- Select single or multiple parcels (shift+click for multiple on desktop)
- Update zoning types for selected parcels
- View statistics about selected parcels:
  - Total area
  - Distribution by zoning type
  - Before/after comparisons for updates
- Mobile-responsive design with dedicated mobile selection mode
- Full audit logging of all changes

## Technology Stack

### Frontend
- React 19
- Leaflet (via react-leaflet) for map display
- Recharts for data visualization
- Tailwind CSS for styling
- Axios for API communication

### Backend
- Java 21
- Spring Boot 3.4.5
- JPA/Hibernate for database access
- PostgreSQL for data storage

## Prerequisites

- Java Development Kit (JDK) 21
- Node.js 18+ and npm
- PostgreSQL 12+
- Maven 3.9+

## Setup and Installation

### Database Setup

1. You need a local PostgreSQL database for the application:
   - The external real estate database is already provided and configured
   - The application's internal database schema will be created automatically via Spring Boot

2. You only need to update the connection details for your local PostgreSQL database in the backend configuration.

### Backend Setup

1. Clone the repository
   ```bash
   git clone https://github.com/Alachan/zoning-management-app.git
   cd zoning-management-app/backend/zoning-tool
   ```

2. Configure the database connection in `src/main/resources/application.properties`:
   ```properties
   # Local database configuration (update with your settings)
   spring.datasource.jdbc-url=jdbc:postgresql://localhost:5432/your_local_db
   spring.datasource.username=your_username
   spring.datasource.password=your_password
   spring.datasource.driver-class-name=org.postgresql.Driver

   # External Database (already configured - do not change)
   external.datasource.jdbc-url=jdbc:postgresql://108.61.159.122:13432/postgres
   external.datasource.username=real_estate
   external.datasource.password=ZT9b0qv6iQ
   external.datasource.driver-class-name=org.postgresql.Driver
   ```

3. Build and run the backend
   ```bash
   ./mvnw spring-boot:run
   ```
   The backend will start on http://localhost:8080

### Frontend Setup

1. Navigate to the frontend directory
   ```bash
   cd ../../frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Configure the API endpoint in `.env` (create this file if it doesn't exist)
   ```
   VITE_API_BASE_URL=http://localhost:8080
   ```

4. Start the development server
   ```bash
   npm run dev
   ```
   The frontend will start on http://localhost:5173

## Usage

1. Open the application in your browser
2. The map will load with parcels color-coded by their zoning type
3. Click on parcels to select them:
   - On desktop: Use SHIFT+click to select multiple parcels
   - On mobile: Toggle selection mode using the button in the top bar
4. Choose a zoning type from the dropdown
5. Click "Update Zoning" to apply the changes
6. View statistics on the right sidebar (desktop) or bottom panel (mobile)

## Assumptions

- The external database is accessible and contains the real estate parcels data in the `real_estate_zoning` table
- Users have basic knowledge of zoning types and understand what they're changing
- The PostgreSQL database supports geometry/spatial data types (PostGIS extension)
- Permissions to apply zoning changes are managed outside the application (no user authentication is implemented)
- The application demonstrates how zoning data can be integrated into residential analytics platforms to support property lifecycle management, underwriting, and valuation processes

## Project Structure

### Backend

- `config` - Database configuration
- `controller` - REST API endpoints
- `dto` - Data transfer objects for API communication
- `exception` - Custom exception classes
- `model` - Entity classes
- `repository` - Data access interfaces
- `service` - Business logic

### Frontend

- `components` - React components
  - `layout` - Page layout components
  - `map` - Map-related components
  - `stats` - Statistics visualization
  - `zoning` - Zoning update interface
- `hooks` - Custom React hooks
- `services` - API service functions
- `utils` - Utility functions and constants

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Real estate data provided by Spatial Laser
- Map tiles from OpenStreetMap
- Icons from React Icons
