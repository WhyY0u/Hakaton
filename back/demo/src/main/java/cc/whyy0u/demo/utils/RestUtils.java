package cc.whyy0u.demo.utils;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;

import cc.whyy0u.demo.entity.ResumeEntity;

public class RestUtils {
    public static final String pythonServerUrl = "http://127.0.0.1:5000/process";

    public static ResumeEntity getMatchScoreFromPython(String resumeText, String jobDescription) {
        ResumeEntity response = new ResumeEntity();
        RestTemplate restTemplate = new RestTemplate();
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        
        Map<String, String> body = new HashMap<>();
        body.put("resume_text", resumeText);
        body.put("query", jobDescription);
        
        HttpEntity<Map<String, String>> requestEntity = new HttpEntity<>(body, headers);
        
        try {
            ResponseEntity<Map> responseEntity = restTemplate.exchange(pythonServerUrl, HttpMethod.POST, requestEntity, Map.class);
            Map<String, Object> responseBody = responseEntity.getBody();
            if (responseBody != null && responseBody.containsKey("similarity_score") && responseBody.containsKey("entities")) {
                response.setText(resumeText);

                Map<String, Object> entities = (Map<String, Object>) responseBody.get("entities");
               if(entities != null) {
                if (entities.containsKey("ORG")) {
                    String orgList = (String) entities.get("ORG");
                    if (!orgList.isEmpty()) {
                        response.setOrg(orgList);
                    }
                }

                if (entities.containsKey("PERSON")) {
                    String personList = (String) entities.get("PERSON");
                    if (!personList.isEmpty()) {
                        response.setPerson(personList);
                    }
                }
                if (entities.containsKey("LOC")) {
                    String locList = (String) entities.get("LOC");
                    if (!locList.isEmpty()) {
                        response.setLoc(locList);
                    }
                }
                if (entities.containsKey("EXPERIENCE")) {
                    String experienceList = (String) entities.get("EXPERIENCE");
                    if (!experienceList.isEmpty()) {
                        response.setExperience(experienceList);
                    }
                }
            }

                response.setSum((Double)responseBody.get("similarity_score") * 100);
                return response; 
            }
        } catch (HttpClientErrorException e) {
            e.printStackTrace();
        }
        return null;
    }
    
}
