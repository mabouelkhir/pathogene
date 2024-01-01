package emsi.iir4.pathogene.service;

import static org.springframework.util.StringUtils.cleanPath;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MaxUploadSizeExceededException;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private static final String UPLOAD_DIR = "C:\\Users\\admin\\Documents\\projet_maladies\\Brain-cancer";

    public String uploadModelFile(MultipartFile file, String maladieName, Long tailleImage) {
        String fileName = generateFileName(file, maladieName, tailleImage);
        Path filePath = getPath(fileName);

        try {
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
            return fileName;
        } catch (IOException e) {
            throw new FileStorageException("Could not store file " + fileName + ". Please try again!", e);
        }
    }

    private String generateFileName(MultipartFile file, String maladieName, Long tailleImage) {
        String originalFileName = cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));

        // Utiliser le nom de la maladie et un UUID pour générer le nouveau nom du fichier
        return maladieName + "_" + UUID.randomUUID().toString() + "_" + tailleImage + fileExtension;
    }

    public void deleteModelFile(String fileName) {
        Path filePath = getPath(fileName);

        try {
            Files.deleteIfExists(filePath);
        } catch (IOException e) {
            throw new FileStorageException("Could not delete file " + fileName + ". Please try again!", e);
        }
    }

    private Path getPath(String fileName) {
        return Path.of(UPLOAD_DIR).resolve(fileName).normalize();
    }

    @ExceptionHandler(MaxUploadSizeExceededException.class)
    public ResponseEntity<String> handleMaxSizeException(MaxUploadSizeExceededException exc) {
        return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body("File size too large!");
    }
}
