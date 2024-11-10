package cc.whyy0u.demo.controller.resume.request;

import lombok.Data;

@Data
public class AddFavoritesRequest {
    Long resume_id;
    String uuid;
}
