package cc.whyy0u.demo.controller.resume;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.commons.compress.archivers.ArchiveEntry;
import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.web.ServerProperties.Tomcat.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import cc.whyy0u.demo.controller.resume.request.AddFavoritesRequest;
import cc.whyy0u.demo.entity.ResumeEntity;
import cc.whyy0u.demo.entity.ResumeEntityFavorites;
import cc.whyy0u.demo.service.ResumeService;
import cc.whyy0u.demo.utils.FileUtils;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.data.domain.Sort;
import cc.whyy0u.demo.controller.resume.response.ResumeResponse;


@Controller
@RequestMapping("/api/resumes")
public class ResumeControll {

    @Autowired
    ResumeService resumeService;

    
@GetMapping("/getAllResume")
public ResponseEntity<?> getResume(@RequestHeader String uuid, @PageableDefault(size = 10, sort = "sum", direction = Sort.Direction.DESC) Pageable pageable) {
    Page<ResumeEntity> resumes = resumeService.findPageResumeByUUID(uuid, pageable);
    List<ResumeResponse> sortedResumes = resumes.getContent().stream()
    .map(resume -> {
        
        return new ResumeResponse(
            resume.getId(),
            resume.getName(),
            resume.getDescription(),
            resume.getSum(),
            resumeService.findResumeEntityFavoritesByResume_ID(resume.getId()) != null);
    })  
    .collect(Collectors.toList());
    HashMap<String, Object> map = new HashMap<>();
    map.put("resume", sortedResumes);
    map.put("totalPages", resumes.getTotalPages());

    return ResponseEntity.ok(map);
}

@GetMapping("/file")
public ResponseEntity<org.springframework.core.io.Resource> getFile(@RequestParam String uuid, @RequestParam String fileName) {
    try {
        Path filePath = Paths.get(FileUtils.getPathDir() + uuid + "/", fileName).normalize();
        org.springframework.core.io.Resource resource = new UrlResource(filePath.toUri());
        if (resource.exists()) {
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"");
            return ResponseEntity.ok()
                    .headers(headers)
                    .body(resource);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
}

@GetMapping("/search")
public ResponseEntity<?> searchResume(@RequestHeader String uuid, @RequestParam String text, @PageableDefault(size = 10, sort = "sum", direction = Sort.Direction.DESC) Pageable pageable) {
    Page<ResumeEntity> resumes = resumeService.findByUuidAndNameContainingOrTextContaining(uuid, text, pageable);
    HashMap<String, Object> map = new HashMap<>();
    List<ResumeResponse> sortedResumes = resumes.getContent().stream()
            .map(resume -> new ResumeResponse(
                    resume.getId(),
                    resume.getName(),
                    resume.getDescription(),
                    resume.getSum(),
                    false))
            .collect(Collectors.toList());
    map.put("resume", sortedResumes);
    map.put("totalPage", resumes.getTotalPages());
    return ResponseEntity.ok(map);
}

@GetMapping("/favorites/search")
public ResponseEntity<?> searchFavorites(@RequestHeader String uuid, @RequestParam String text, @PageableDefault(size = 10, direction = Sort.Direction.DESC) Pageable pageable) {
    Page<ResumeEntityFavorites> resumes = resumeService.searchFavoritesByUuidAndText(uuid, text, pageable);
    List<ResumeResponse> sortedResumes = resumes.getContent().stream()
    .map(resume -> {
        ResumeEntity resumeEntity = resume.getResume();
        return new ResumeResponse(
        resumeEntity.getId(),
        resumeEntity.getName(),
        resumeEntity.getDescription(),
        resumeEntity.getSum());
    })
    .collect(Collectors.toList());
    HashMap<String, Object> map = new HashMap<>();
    map.put("resume", sortedResumes);
    map.put("totalPages", resumes.getTotalPages());
    return ResponseEntity.ok(map);
}
@GetMapping("/getAllFavorites")
public ResponseEntity<?> favoritesResume(@RequestHeader String uuid, @PageableDefault(size = 10, direction = Sort.Direction.DESC) Pageable pageable) {
    Page<ResumeEntityFavorites> resumes = resumeService.findPageResumeFavoritesByUUID(uuid, pageable);

    List<ResumeResponse> sortedResumes = resumes.getContent().stream()
    .map(resume -> {
        ResumeEntity resumeEntity = resume.getResume();
        return new ResumeResponse(
        resumeEntity.getId(),
        resumeEntity.getName(),
        resumeEntity.getDescription(),
        resumeEntity.getSum());
    })
    .collect(Collectors.toList());
    HashMap<String, Object> map = new HashMap<>();
    map.put("resume", sortedResumes);
    map.put("totalPages", resumes.getTotalPages());
    return ResponseEntity.ok(map);
}

@DeleteMapping("/favorites/remove")
public ResponseEntity<?> removeFavorites(@RequestHeader String uuid, @RequestHeader Long id) {
    resumeService.removeResumeFavorites(id);
    return ResponseEntity.ok("Ok");
}

@DeleteMapping("/remove")
public ResponseEntity<?> removeResume(@RequestHeader String uuid, @RequestHeader Long id) {
    ResumeEntity resumeEntity = resumeService.findResumeById(id);
    if(resumeEntity != null) {
    FileUtils.deleteFile(resumeEntity.getFileName(), uuid);
    resumeService.deleteResume(id);
    return ResponseEntity.ok("Ok");
    }
    return ResponseEntity.notFound().build();
}


@PostMapping("/favorites/add")
public ResponseEntity<?> addFavorites(@RequestBody AddFavoritesRequest request) {
    ResumeEntity entity = resumeService.findResumeById(request.getResume_id());

    if(entity != null) {
        if(resumeService.findResumeEntityFavoritesByResume_ID(entity.getId()) == null) {
         ResumeEntityFavorites entityfavorites = new ResumeEntityFavorites();
         entityfavorites.setResume(entity);
         entityfavorites.setUuid(entity.getUuid());
         resumeService.saveRepositoryFavorites(entityfavorites);
        }
    return ResponseEntity.ok("Ok");
    }
    return ResponseEntity.notFound().build();
}

@PostMapping("/loadResume")
public ResponseEntity<?> addResume(@RequestParam("file") MultipartFile file, @RequestParam String jobDescription) throws IOException {
    String uuid = UUID.randomUUID().toString();
    File dir = new File(FileUtils.getPathDir());
    
    if (!dir.exists()) {
        dir.mkdirs();
    }
    
    File uploadDir = new File(FileUtils.getPathDir(), uuid);
    if (!uploadDir.exists()) {
        uploadDir.mkdirs(); 
    }

    try {
        if (file.isEmpty()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Загруженный файл пустой.");
        }
        if (FileUtils.isZipFile(file)) {
            try (InputStream is = file.getInputStream();
                 ZipArchiveInputStream zis = new ZipArchiveInputStream(is)) {
                 
                ArchiveEntry entry;
                boolean isArchiveEmpty = true;

                while ((entry = zis.getNextEntry()) != null) {
                    if (!entry.isDirectory()) {
                        isArchiveEmpty = false; 
                        File extractedFile = new File(uploadDir, entry.getName());
                        try (OutputStream os = new FileOutputStream(extractedFile)) {
                            byte[] buffer = new byte[1024];
                            int len;

                            while ((len = zis.read(buffer)) > 0) {
                                os.write(buffer, 0, len);
                            }
                        }

                        if (extractedFile.length() == 0) {
                            continue; 
                        }

                        try (FileInputStream fis = new FileInputStream(extractedFile)) {
                            ResumeEntity resumeEntity = FileUtils.processEntry(entry.getName(), fis, uuid, jobDescription);

                            System.out.println(resumeEntity.getSum());
                            if (resumeEntity != null && resumeEntity.getSum() > 50) {
                                System.out.println("save");
                                  resumeService.saveResume(resumeEntity);
                            } else {
                                continue;
                            }
                        } 
                    }
                }

                if (isArchiveEmpty) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Архив пуст.");
                }
            }
        } else {
            File uploadedFile = new File(uploadDir, file.getOriginalFilename());
            file.transferTo(uploadedFile);

            if (uploadedFile.length() == 0) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Файл пустой.");
            }

            System.out.println("Обрабатываем файл: " + uploadedFile.getName());

            try (FileInputStream fis = new FileInputStream(uploadedFile)) {
                ResumeEntity resumeEntity = FileUtils.processEntry(uploadedFile.getName(), fis, uuid, jobDescription);
                if (resumeEntity != null && resumeEntity.getSum() > 50) {
                    System.out.println("Файл сохранен: " + uploadedFile.getName());
                    resumeService.saveResume(resumeEntity);
                } else {
                    System.out.println("Файл пропущен из-за низкой суммы: " + uploadedFile.getName());
                }
            } catch (Exception e) {
                System.out.println("Ошибка при обработке файла: " + uploadedFile.getName() + ", ошибка: " + e.getMessage());
            }
        }

        return ResponseEntity.ok(uuid);
    } catch (Exception e) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Ошибка обработки файла: " + e.getMessage());
    }
}
    
}
