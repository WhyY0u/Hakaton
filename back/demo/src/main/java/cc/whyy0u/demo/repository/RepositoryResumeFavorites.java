package cc.whyy0u.demo.repository;


import java.util.ArrayList;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import cc.whyy0u.demo.entity.ResumeEntityFavorites;

public interface RepositoryResumeFavorites extends CrudRepository<ResumeEntityFavorites, Long> {
    ArrayList<ResumeEntityFavorites> findResumeFavoritesByuuid(String uuid);
    ResumeEntityFavorites findResumeFavoritesByresume_id(Long resume_id);
    Page<ResumeEntityFavorites> findResumeFavoritesByuuid(String uuid, Pageable pageable);
    @Query("SELECT rf FROM ResumeEntityFavorites rf JOIN rf.resume r " +
    "WHERE rf.uuid = :uuid AND (r.name LIKE %:text% OR r.text LIKE %:text%) " +
    "ORDER BY r.sum DESC")
Page<ResumeEntityFavorites> searchFavoritesByUuidAndText(
     @Param("uuid") String uuid,
     @Param("text") String text,
     Pageable pageable);

     void deleteByResume_Id(Long resumeId);


}
