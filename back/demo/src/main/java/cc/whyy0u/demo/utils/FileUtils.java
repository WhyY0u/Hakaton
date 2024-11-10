package cc.whyy0u.demo.utils;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.StringWriter;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.imageio.ImageIO;

import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.tika.metadata.Metadata;
import org.apache.tika.parser.ParseContext;
import org.apache.tika.parser.microsoft.rtf.RTFParser;
import org.apache.tika.sax.BodyContentHandler;
import org.springframework.web.multipart.MultipartFile;

import cc.whyy0u.demo.entity.ResumeEntity;

import org.apache.commons.compress.archivers.zip.ZipArchiveInputStream;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.rendering.PDFRenderer;
import org.apache.pdfbox.text.PDFTextStripper;
import java.awt.image.BufferedImage;
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

public class FileUtils {

    private final static String DEV_DIR = System.getProperty("user.dir") + "/temp/";
    private final static String RELESE_DIR = System.getProperty("user.dir") + "/temp/";
    private final static String VERSION = "dev";
    
    
        public static String getPathDir() {
            if("dev".equals(VERSION)) {
                return DEV_DIR;
            } 
            return RELESE_DIR;
        }

    public static void deleteFile(String fileName, String uuid) {
        File file = new File(getPathDir() + "/" + uuid + "/" + fileName);
        if(file.exists()) {
            if(file.delete()) {
                System.out.println("Файл успешно удален.");
            } else {
                System.out.println("Не удалось удалить файл.");
            }
        }
    }

    public static String extractTextFromPdf(InputStream pdfInputStream) {
    try (PDDocument document = PDDocument.load(pdfInputStream)) {
        PDFTextStripper pdfStripper = new PDFTextStripper();
        return pdfStripper.getText(document);
    } catch (Exception e) {
        e.printStackTrace();
        return "Ошибка при извлечении текста из PDF";
    }
}
public static String extractTextFromDocx(InputStream is) throws IOException {
    XWPFDocument doc = new XWPFDocument(is);
    XWPFWordExtractor extractor = new XWPFWordExtractor(doc);
    return extractor.getText();
}
public static String extractTextFromTxt(InputStream is) throws IOException {
    BufferedReader reader = new BufferedReader(new InputStreamReader(is));
    StringBuilder text = new StringBuilder();
    String line;
    
    while ((line = reader.readLine()) != null) {
        text.append(line).append("\n");
    }
    
    return text.toString();
}


public static String extractTextFromRtf(InputStream is) throws IOException {
    RTFParser parser = new RTFParser();
    BodyContentHandler handler = new BodyContentHandler();
    Metadata metadata = new Metadata();
    ParseContext context = new ParseContext();
    try {
        parser.parse(is, handler, metadata, context);
    } catch (Exception e) {
        throw new IOException("Error parsing RTF file", e);
    }
    return handler.toString();
}
public static String extractTextFromImage(InputStream imageStream) {
        try {
            Tesseract tesseract = new Tesseract();
            tesseract.setDatapath("/usr/share/tesseract-ocr/5/tessdata");
            tesseract.setLanguage("rus");
            BufferedImage image = ImageIO.read(imageStream);
            String str = tesseract.doOCR(image);
            return str;
        } catch (IOException | TesseractException e) {
            e.printStackTrace();
            return null;
        }
    }
    public static boolean isZipFile(MultipartFile file) throws IOException {
    try (InputStream is = file.getInputStream()) {
        ZipArchiveInputStream zis = new ZipArchiveInputStream(is);
        return zis.getNextEntry() != null;
    } catch (IOException e) {
        return false;
    }
    }
    public static ResumeEntity processEntry(String name, InputStream is, String uuid, String jobDescription) throws IOException {
        String resumeText = null;
        if (name.endsWith(".pdf")) {
            resumeText = FileUtils.extractTextFromPdf(is);
        } else if (name.endsWith(".docx") || name.endsWith(".doc")) {
            resumeText = FileUtils.extractTextFromDocx(is);
        } else if (name.endsWith(".jpg") || name.endsWith(".png") || name.endsWith(".jpeg")) {
            resumeText = FileUtils.extractTextFromImage(is);
        }else if (name.endsWith(".rtf")) {
            resumeText = FileUtils.extractTextFromRtf(is);
        }else if (name.endsWith(".txt")) {
            resumeText = FileUtils.extractTextFromTxt(is);
        }
    
        if (resumeText != null) {
            resumeText = TextUtils.cleanText(resumeText);
            ResumeEntity entity = RestUtils.getMatchScoreFromPython(resumeText, jobDescription);
            if(entity.getName() == null) {
                entity.setName(name);
            }
            entity.setFileName(name);
            entity.setText(resumeText);
            entity.setDescription(resumeText.substring(0, 121));
            entity.setUuid(uuid);

            return entity;
        }
        return null;
    }
    
    private static String extractPhoneNumber(String text) {
        String phoneRegex = "\\+?\\(?\\d{1,4}\\)?\\s?\\d{3}\\s?-?\\d{2}\\s?-?\\d{2}";
        Pattern phonePattern = Pattern.compile(phoneRegex);
        Matcher phoneMatcher = phonePattern.matcher(text);
        if (phoneMatcher.find()) {
            return phoneMatcher.group();
        }
        return "Не найден";
    }
    
    public static String extractTextFromPdfImages(InputStream pdfStream) {
        StringBuilder extractedText = new StringBuilder();

        try (PDDocument document = PDDocument.load(pdfStream)) {
            PDFRenderer pdfRenderer = new PDFRenderer(document);
            Tesseract tesseract = new Tesseract();
            tesseract.setLanguage("rus");  

            for (int page = 0; page < document.getNumberOfPages(); page++) {
                BufferedImage image = pdfRenderer.renderImageWithDPI(page, 300); 
                String pageText = tesseract.doOCR(image);
                extractedText.append(pageText).append("\n"); 
            }

        } catch (IOException | TesseractException e) {
            e.printStackTrace();
            return null;
        }

        return extractedText.toString();
    }

}
