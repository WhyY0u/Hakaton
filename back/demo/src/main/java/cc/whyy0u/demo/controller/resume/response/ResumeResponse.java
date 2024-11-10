package cc.whyy0u.demo.controller.resume.response;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.Data;

@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ResumeResponse {
    String name;
    String desciption;
    double sum;
    boolean favorites;
    Long id;

    public ResumeResponse() {
    }

    public ResumeResponse(Long id, String name, String desciption, double sum, boolean favorites) {
        this.name = name;
        this.desciption = desciption;
        this.sum = sum;
        this.favorites = favorites;
        this.id = id;
    }
    public ResumeResponse(Long id, String name, String desciption, double sum) {
        this.name = name;
        this.desciption = desciption;
        this.sum = sum;
        this.id = id;
    }
}
