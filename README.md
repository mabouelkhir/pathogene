# DLDiagnosis - Deep Learning Disease Classification

## Version [1.1.0]

DLDiagnosis is a mobile and web application for diseases classification using Deep Learning. The project is divided into three main components: a web application integrated with the backend, a mobile application, and a Python component for loading and using pre-trained models.

### Software Stack

- **JHipster:** Development platform for web applications using Spring Boot and Angular/Vue.js. [JHipster Documentation](https://www.jhipster.tech/documentation-archive/v7.0.0/)
- **TensorFlow:** An open-source machine learning library for building and training deep learning models. [TensorFlow Documentation](https://www.tensorflow.org/guide)
- **Flutter:** UI toolkit for building natively compiled applications for mobile, web, and desktop from a single codebase. [Flutter Documentation](https://flutter.dev/docs)
- **Spring Boot:** Framework for building Java-based enterprise applications. [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/getting-started.html)
- **Spring Security:** Powerful and customizable authentication and access control framework. [Spring Security Documentation](https://docs.spring.io/spring-security/site/docs/current/reference/html5/)
- **Java:** Object-oriented programming language used for backend development. [Java Documentation](https://docs.oracle.com/en/java/)
- **Python:** Programming language used for machine learning model loading. [Python Documentation](https://docs.python.org/3/)
- **RabbitMQ:** Open-source message broker software used for communication between components. [RabbitMQ Documentation](https://www.rabbitmq.com/documentation.html)
- **Dart:** Programming language used for Flutter app development. [Dart Documentation](https://dart.dev/guides)
- **JavaScript:** High-level, interpreted programming language for web application frontend. [JavaScript Documentation](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)


### Compilation Requirements and Dependencies

Ensure you have the following installed and configured on your development machine:

- **Java Development Kit (JDK) 17 or later:** [Download and Install](https://adoptium.net/)
- **Python 3.10:** [Download and Install](https://www.python.org/downloads/release)
- **Flutter:** Follow the installation guide based on your operating system: [Flutter Installation Guide](https://flutter.dev/docs/get-started/install)
- **Node.js:** Required by JHipster and other build tools. [Download and Install](https://nodejs.org/en/download/)
- **Dart SDK:** Required for Flutter development. [Download and Install](https://dart.dev/get-dart)

### Project Structure

1. *Web Application (Frontend & Backend Integration):*
   - Developed with JHipster, Vue.js, Spring Boot, and Spring Security.
   - The frontend is built with Vue.js, providing a responsive and user-friendly interface.
   - Spring Boot powers the backend, offering RESTful APIs and seamless integration with the frontend.
   
   - Frontend source code: [web-application/src/main/webapp](web-application/src/main/webapp)
   - Backend source code: [web-application/src/main/java](web-application/src/main/java)

2. *Mobile Application:*
   - Developed with Flutter and Dart.
   - The mobile app provides a cross-platform experience with a single codebase.
   - Dart is used for building the logic, and Flutter's widgets ensure a native look and feel.

   - Mobile app source code: [mobile-application/lib][(mobile-application/lib](https://github.com/mabouelkhir/dldiagnostics))

3. *Python Component:*
   - Used for loading pre-trained models in `.h5` format.
   - TensorFlow is employed to load and run machine learning models.
   - Predictions are published on a RabbitMQ queue and retrieved at the backend.

   - Python source code: [python-component][(python-component](https://github.com/najiaokacha/DLDiagnosisClassification/tree/master))

### Compilation and Execution

1. *Web Application:*
   ```bash
   # Navigate to the web application directory
   cd web-application

   # Install dependencies
   npm install

   # Run the application
   ./mvnw

2. *Mobile Application:*
    ```bash
    # Navigate to the mobile application directory
    cd mobile-application
    
    # Install dependencies and run the application
    flutter pub get
    flutter run

3. *Python:*
cd python-folder
    ```bash
    # Install Python dependencies
    pip install -r requirements.txt
    
    # Run the Python component
    python database.py
